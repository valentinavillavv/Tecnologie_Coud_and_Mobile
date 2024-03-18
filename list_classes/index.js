const AWS = require('aws-sdk');//Import AWS
const parser = require("xml2js")//Import parser xml->json
const S3 = new AWS.S3;//Inizializzazione S3
const bucket_name = "risultati-gare";//Nome bucket

exports.handler = async (event) => {
    //Controllo inserimento parametri
    if (!event.queryStringParameters) {//Non sono inseriti parametri
        const response = {
            statusCode: 400,
            body: 'Parametro mancante'
        };
        return response;
    }
    if (!event.queryStringParameters.ID) {//Almeno un parametro mancante
        const response = {
            statusCode: 400,
            body: "Parametro mancante"
        }
        return response;
    }

    //Setup dei parametri di ricerca
    const ID = event.queryStringParameters.ID
    const data_key = ID+ ".xml"

    const params = {
        Bucket: bucket_name,
        Key: data_key
    };

    //Estrazione file richiesto
    const data = await S3.getObject(params).promise();
    const data_xml = data.Body.toString('utf-8')

    //Parse Xml->String
    const data_string = await parser.parseStringPromise(data_xml).then(function (result) {
        return JSON.stringify(result);
    })
        .catch(function (err) {
            throw err;
        });

    //Estrazione lista delle categorie
    const data_json = JSON.parse(data_string);
    const classlist = data_json.ResultList.ClassResult;
    var ris=[];
    classlist.forEach(function (element){
        ris.push(element.Class[0].Name[0]);
    });

    //Risposta 
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ris)
    };
    return response;
};