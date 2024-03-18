const AWS = require('aws-sdk');//Import aws-sdk
const DB = new AWS.DynamoDB();//Inizializzazione DB

exports.handler = async (event) =>{
    //Parametri per la selezione del DB
    const params={
        ProjectionExpression: "NomeGara, DataGara, ID",
        TableName: "Gare"
    };

    //Scan del DB
    const ListaGare= await DB.scan(params, function(err,data){
        if(err){
            throw err;
        }
    }).promise();

    var res = [];
    ListaGare.Items.forEach(function (element){
        var race = {};
        race.NomeGara=element.NomeGara.S;
        race.ID=element.ID.S;
        race.DataGara=element.DataGara.S;
        res.push(race);
    });

    //Risposta
    const response = {
        statusCode: 200,
        body: JSON.stringify(ListaGare),
        headers: {
            "Content-Type":"application/json"
        }
    };
    return response;
}