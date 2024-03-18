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
    if (!event.queryStringParameters.ID || (!event.queryStringParameters.class & !event.queryStringParameters.organisation)) {//Almeno un parametro mancante
        const response = {
            statusCode: 400,
            body: "Parametro mancante"
        }
        return response;
    }

    //Setup dei parametri di ricerca
    const ID = event.queryStringParameters.ID;
    const className = event.queryStringParameters.class;
    const organisation= event.queryStringParameters.organisation;
    const data_key = ID+ ".xml";

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

    //Parse String->JSON
    const data_json = JSON.parse(data_string)
    
 //Caso ID+class   
    if(event.queryStringParameters.class){
        const classlist = data_json.ResultList.ClassResult
        var ClassResult;
        classlist.forEach(function (element){
                if(element.Class[0].Name[0]==className){
                ClassResult = element;
            }
        });
        
        if(ClassResult==null){
            const response = {
            statusCode: 400,
            body: "Categoria non esistente"
            };
         return response;
        }
    
        var classificati =[];
        var NC= [];
        var ris= [];
        ClassResult.PersonResult.forEach(function (element){
        if(element.Result.Status=="OK"){
            classificati.push(element);
        }
        else{
            NC.push(element);
        }
        })

        var classificatiOrd=classificati.sort(function (a, b) {
            return a.Result.Position.localeCompare(b.Result.Position);
        });

        classificatiOrd.forEach(function (element){
            ris.push(element)
        });
    
        NC.forEach(function (element){
            ris.push(element)
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
    }
    else{
        var ris = [];
        
        data_json.ResultList.ClassResult.forEach(function (element){
            element.PersonResult.forEach(function (element){
                if(element.Organisation){
                    console.log(element.Organisation[0].Name)
                    if(element.Organisation[0].Name==organisation){
                        ris.push(""+element.Person[0].Name[0].Family+' '+element.Person[0].Name[0].Given)
                    }
                }
            })
        })
        const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ris)

    };
    return response;  
    }
    
};