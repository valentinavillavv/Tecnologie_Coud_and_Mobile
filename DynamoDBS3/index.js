const AWS = require('aws-sdk');//Import aws-sdk
const parser = require('xml2js');//Import xml2js
const DB = new AWS.DynamoDB();//Inizializzazione DB
const S3 = new AWS.S3;//Inizializzazione Bucket
exports.handler = async (event) => {
    //Estrazione nome bucket
    const bucket = event.Records[0].s3.bucket.name;

    //Estrazione key
    const keyRaw1 = JSON.stringify(event.Records[0].s3.object.key);
    const keyRaw2 = keyRaw1.split('+').join(" ");
    const key_string = decodeURIComponent(keyRaw2);
    const key = JSON.parse(key_string);

    //Get XML
    const params = {
        Bucket: bucket,
        Key: key
    };
    const data = await S3.getObject(params).promise();
    const data_xml = data.Body.toString('utf-8');

    //Parse JSON
    const data_string = await parser.parseStringPromise(data_xml).then(function (result) {
        return JSON.stringify(result);
    })
        .catch(function (err) {
            throw err;
        });
    const data_json = JSON.parse(data_string);

    //Creazione item DynamoDB
    const nomeGara = "" + data_json.root.nameEvent;
    const dataGara = "" + data_json.root.dateEvent;
    const email = "" + data_json.root.emailCreator;
    const nomeFile = nomeGara + dataGara + ".xml";
    const token = "" + data_json.root.token;
    const id=""+nomeGara+dataGara;

    var DynamoParams = {
        "TableName": 'Gare',
        Item: {
            "NomeGara": { S: nomeGara },
            "DataGara": { S: dataGara },
            "Email": { S: email },
            "NomeFile": { S: nomeFile },
            "TokenGara": { S: token },
            "ID": {S: id}
        }
    };

    //Inserimento in DynamoDB
    await DB.putItem(DynamoParams, function (err, data) {
    if (err) throw err;
    }).promise();
};
