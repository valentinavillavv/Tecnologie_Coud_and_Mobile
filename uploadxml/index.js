const AWS = require('aws-sdk');        //Import AWS
const parser = require('xml2js');      //Import parser XML->JSON
const xmllint = require('xmllint');    //Import check XML 
const fs=require('fs');                //Import fs
const S3 = new AWS.S3;                  //Inizializzazione variabile bucket
const DB = new AWS.DynamoDB();          //Inizializzazione DynamoDB
const bucket_name = "risultati-gare";      //Nome bucket

exports.handler = async (event) => {

    console.log(event)
//Controllo parametri inseriti
    if (!event.queryStringParameters) {//Non sono inseriti parametri
        const response = {
            statusCode: 400,
            body: 'Parametro token mancante'
        };
        return response;
    }
    if (!event.queryStringParameters.token) {//Manca almeno un parametro
        const response = {
            statusCode: 400,
            body: 'Parametro token mancante'
        };
        return response;
    }

//Estrazione dati (data_xml, data_string, data_json)
    //Dati ricevuti dalla richiesta POST (data_xml -> XML)
    const data_xml = event.body;
    const token = event.queryStringParameters.token;

    //Dati XML convertiti in string (data_string -> String)
    const data_string = await parser.parseStringPromise(data_xml).then(function (result) {
        return JSON.stringify(result);
    })
        .catch(function (err) {
            throw err;
        });

    //Dati String convertiti in JSON (data_json ->JSON)
    const data_json = JSON.parse(data_string);

//Recupero gara da DB
    //Parametri query su DB
    const DBParams = {
        ExpressionAttributeValues: {
            ":id": { S: token }
        },
        FilterExpression: "TokenGara= :id",
        ProjectionExpression: "NomeGara, DataGara",
        TableName: "Gare",
    }
    //Estrazione di NomeGara e DataGara corrispondenti al token inserito
    const datiDB = await DB.scan(DBParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
    }).promise();

    //Controllo validità token
    if (datiDB.Items.length == 0) {
        const response = {
            statusCode: 400,
            body: 'Il codice non corrisponde a nessuna gara'
        };
        return response;
    }

    //Salvataggio valori estratti
    const nomeGara = datiDB.Items[0].NomeGara.S;
    const dataGara = datiDB.Items[0].DataGara.S;

//Check file xml
    //Controllo che il file XML rispetti lo standard
    const xsd=fs.readFileSync("Standard.xsd","utf8");
    const validationOpt={
        xml:data_xml,
        schema:xsd
    };
    if(xmllint.validateXML(validationOpt).errors){
        const response = {
            statusCode: 400,
            body: "Il file caricato non è conforme con lo standard IOF"
        };
        return response;
    }

    //Controllo che Event.Name e Event.StartTime.Date (file xml) siano coerenti a quelli salvati nel DB
    if(data_json.ResultList.Event[0].Name!=nomeGara){
        const response = {
            statusCode: 400,
            body: "Il nome dell' evento contenuto nell'XML non corrisponde al token inserito"
        };
        return response;
    }
    if(data_json.ResultList.Event[0].StartTime[0].Date!=dataGara){
        const response = {
            statusCode: 400,
            body: "La data dell' evento contenuta nell'XML non corrisponde al token inserito"
        };
        return response;
    }

//Caricamentro file xml su S3
    //Definizione dei parametri per upload
    const S3Params = {
        Bucket: bucket_name,
        Key: nomeGara + dataGara + ".xml",
        Body: data_xml
    };

    //Upload del file
    await S3.putObject(S3Params, function (err, data) {
        if (err) console.log(err, err.stack);
    }).promise();

//Risposta alla richiesta POST
    const response = {
        statusCode: 200,
        body: 'Gara registrata!'
    };
    return response;
};