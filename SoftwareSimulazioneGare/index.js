const fs = require('fs')//Import FileSystem (input/output da file locali)
const xml2js = require('xml2js')//Import Parser
const moment = require ('moment')//Import moment (Gestione date)

const parser = new xml2js.Parser();

const inputFile = process.argv[2]//nome del file passato all'invocazione codice
const minPassati = process.argv[3]//minuti trascorsi da inizio gara passato all'invocazione codice


SimulaXML(inputFile,minPassati);

async function SimulaXML (file,minutes) {
    const file_xml = fs.readFileSync(file, 'utf8');//Lettura file 

    //Parse xml->JSON
    const file_string = await parser.parseStringPromise(file_xml).then(function (result) {
        return JSON.stringify(result);
    });
    const file_json = JSON.parse(file_string);

    //Estrazione inizio evento
    startTime = file_json.ResultList.Event[0].StartTime[0].Time
    startDate = file_json.ResultList.Event[0].StartTime[0].Date
    const start_string = startDate + " " + startTime;
    const start = moment(start_string)//Inizio evento come data

    const now = start.add(minutes, 'm');//data di inizio + minuti passati

    var output_json = file_json;//File di output

    //Modifica del file di output
    output_json.ResultList.ClassResult.forEach(function (categoria) {//Per ogni categoria
        var i;
        for (i = categoria.PersonResult.length - 1; i >= 0; i -= 1) {//Ogni concorrente
            if (!categoria.PersonResult[i].Result[0].FinishTime) {//Se non c'è il valore di arrivo
                continue;
            }

            var finish = moment("" + categoria.PersonResult[i].Result[0].FinishTime)//Data dell'arrivo del partecipante

            if (finish.isAfter(now)) {//Se l'arrivo è dopo il momento selezionato in input
                delete categoria.PersonResult[i].Result[0].FinishTime;
                delete categoria.PersonResult[i].Result[0].Time;
                delete categoria.PersonResult[i].Result[0].TimeBehind;
                delete categoria.PersonResult[i].Result[0].Position;
                delete categoria.PersonResult[i].Result[0].Status;

                var j = 0;
                categoria.PersonResult[i].Result[0].SplitTime.forEach(function (split) {
                    j++;
                    if (!split.Time) {
                        
                    }
                    else if (moment("" + categoria.PersonResult[i].Result[0].StartTime).add(split.Time, 's').isAfter(now)) {
                        categoria.PersonResult[i].Result[0].SplitTime.splice(j-1, categoria.PersonResult[i].Result[0].SplitTime.length - j+1);

                    }
                })
            }
        }
    })

    //Parse da JSON a XML
    var builder = new xml2js.Builder();
    var xml_output = builder.buildObject(output_json);

    //Stampa file output
    fs.writeFile('output.xml', xml_output, function (err) {
        if (err) throw err;
        console.log('File creato con successo :D');
    });

}

