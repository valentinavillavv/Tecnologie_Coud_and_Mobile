const AWS = require('aws-sdk');//Import AWS
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
        };
        return response;
    }

    //Setup dei parametri di ricerca
    const ID = event.queryStringParameters.ID;
    const data_key = ID+ ".xml";

    const params = {
        Bucket: bucket_name,
        Key: data_key
    };

    //Estrazione file richiesto
    const data = await S3.getObject(params).promise();
    const data_xml = data.Body.toString('utf-8');
    
    //Conversione in base64
    var buff= new Buffer.from(data_xml);
    var bodyRes=buff.toString('base64');
    
    //Risposta (e download)
    const response = {
            statusCode: 200,
            body: bodyRes,
            headers:{
                "Content-Type" : "application/xml",
                "Content-Disposition": "attachment; filename=download.xml"
            },
            isBase64Encoded: true
        };
    return response;
};