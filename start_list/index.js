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
    if (!event.queryStringParameters.ID || !event.queryStringParameters.class) {//Almeno un parametro mancante
        const response = {
            statusCode: 400,
            body: "Parametro mancante"
        }
        return response;
    }

    //Setup dei parametri di ricerca
    const ID = event.queryStringParameters.ID;
    const className = event.queryStringParameters.class;
    const start_key= ID+ "Start.xml"

    const params = {
        Bucket: bucket_name,
        Key: start_key
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

    //Parse String->JSON
    const data_json = JSON.parse(data_string)
    
 //Estrazione StartList  
    const classlist = data_json.StartList.ClassStart
    var ClassStart;
    classlist.forEach(function (element){
            if(element.Class[0].Name[0]==className){
            ClassStart = element;
        }
    });
    
    if(ClassStart==null){
        const response = {
        statusCode: 400,
        body: "Categoria non esistente"
        };
        return response;
    }
    
    //Risposta 
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(ClassStart)
    };
    return response;
}