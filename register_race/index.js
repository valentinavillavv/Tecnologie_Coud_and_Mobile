const AWS = require('aws-sdk');//Import aws-sdk
const xml2js = require('xml2js');//Import xml2js
const uuid = require('uuid');//Import UUID
const S3 = new AWS.S3;//Inizializzazione bucket
const bucket_name = "risultati-gare";//Nome bucket
var builder = new xml2js.Builder();//Inizializzazione builder xml

exports.handler = async (event) => {
    //Controllo inserimento parametri
    if (!event.queryStringParameters) {//Non sono inseriti parametri
        const response = {
            statusCode: 400,
            body: 'Parametri mancanti'
        };
        return response;
    }
    if (!event.queryStringParameters.name || !event.queryStringParameters.date || !event.queryStringParameters.email) {//Manca almeno un parametro
        const response = {
            statusCode: 400,
            body: "Parametri mancanti"
        }
        return response;
    }

    //Estrazione parametri
    const name = event.queryStringParameters.name;
    const date = event.queryStringParameters.date;
    const email = event.queryStringParameters.email;
    const token = uuid.v4();
    const file = {
        nameEvent: name,
        dateEvent: date,
        emailCreator: email,
        token: token
    }
    //Costruzione file XML
    var file_xml = builder.buildObject(file)

    //Caricamento del file di registrazione nel bucket
    const params = {
        Bucket: bucket_name,
        Key: name + date + ".xml",
        Body: file_xml
    }
    await S3.putObject(params).promise();

    //Risposta
    const response = {
        statusCode: 200,
        body: "Gara creata\n IDGara = " + name + date + "\n token = " + token
    }
    return response;
}