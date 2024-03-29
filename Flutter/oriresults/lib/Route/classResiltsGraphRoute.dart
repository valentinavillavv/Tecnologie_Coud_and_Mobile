import 'dart:convert';
import 'dart:async';
//import 'dart:html';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:oriresults/Widget/resultBox.dart';

const apiUrl = 'https://cghd6kwn0k.execute-api.us-east-1.amazonaws.com';

Future<List<Map<String, dynamic>>> fetchResults(
    String raceid, String className) async {
  final response =
      await http.get(Uri.parse('$apiUrl/results?ID=$raceid&class=$className'));

  if (response.statusCode == 200) {
    return List<Map<String, dynamic>>.from(jsonDecode(response.body));
  } else {
    throw Exception('Caricamento fallito');
  }

}class classResultsGraphRoute extends StatefulWidget {
  final String raceid;
  final String raceName;
  const classResultsGraphRoute(this.raceid, this.raceName, {Key? key}):super(key:key);

  @override
  State<StatefulWidget> createState() => classResultsGraphRouteState();
}

class classResultsGraphRouteState extends State<classResultsGraphRoute> {
  late Future<List<Map<String, dynamic>>> futureResult;

  @override
  void initState() {
    super.initState();
    futureResult = fetchResults(widget.raceid, widget.raceName);
  }

  @override
  Widget build(BuildContext context) {
  
     return Scaffold(
      appBar: AppBar(
        title: Text('grafico'),
        backgroundColor: Color.fromARGB(255, 97, 206, 100),
      ),
     body:Container(
      height: 320,
      margin: EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.all(Radius.circular(18)),
        gradient: LinearGradient(
          colors: const [
            Color(0xff2c274c),
            Color(0xff46426c),
          ],
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
        ),
      ),
    
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          const SizedBox(
            height: 25,
          ),
          const Text(
            ' ',
            style: TextStyle(
              color: Color(0xff827daa),
              fontSize: 16,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(
            height: 4,
          ),
          const Text(
            'grafico primi tre',
            style: TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(
            height: 25,
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0, left: 6.0),
              child:FutureBuilder<List<Map<String, dynamic>>>(future: futureResult, builder:(context,snapshot) {return LineChart(sampleData1()); }),
            ),
          ),
          const SizedBox(
            height: 10,
          ),
         
        ],
      ),   
     ), 
      floatingActionButton:FloatingActionButton(
          onPressed: () {
            Navigator.pop(context);// Navigate back to first route when tapped.
          },
          child: const Text('Go back!'),
        ),
     );
  }

  LineChartData sampleData1() {
    return LineChartData(
      lineTouchData: LineTouchData(
        touchTooltipData: LineTouchTooltipData(
          tooltipBgColor: Colors.white,
        ),
        // touchCallback: (LineTouchResponse touchResponse) {},
        handleBuiltInTouches: true,
      ),
      gridData: FlGridData(
        show: false,
      ),
      /*titlesData: FlTitlesData(
        bottomTitles: SideTitles(
          showTitles: true,
          reservedSize: 22,
          textStyle: const TextStyle(
            color: Color(0xff72719b),
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
          margin: 10,
          showTitles: (value) {
            switch (value.toInt()) {
              case 2:
                return 'SEPT';
              case 7:
                return 'OCT';
              case 12:
                return 'DEC';
            }
            return '';
          },
        ),
        leftTitles: SideTitles(
          showTitles: true,
          textStyle: const TextStyle(
            color: Color(0xff75729e),
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
          getTitles: (value) {
            switch (value.toInt()) {
              case 1:
                return '1m';
              case 2:
                return '2m';
              case 3:
                return '3m';
              case 4:
                return '5m';
            }
            return '';
          },
          margin: 8,
          reservedSize: 30,
        ),
      ),
      */
      borderData: FlBorderData(
        show: true,
        border: const Border(
          bottom: BorderSide(
            color: Colors.yellow,
            width: 2          ),
          left: BorderSide(
            color: Colors.yellow,
          ),
          right: BorderSide(
            color: Colors.transparent,
          ),
          top: BorderSide(
            color: Colors.transparent,
          ),
        ),
      ),
      minX: 0,
      maxX: ,
      maxY: 4,
      minY: 0,
      lineBarsData: linesBarData1(),
    );
  }

  List<LineChartBarData> linesBarData1() {
    final LineChartBarData lineChartBarData1 = LineChartBarData(
      // all the spots of the line chart.
      spots: [
        FlSpot(1, 2.8),
        FlSpot(3, 1.9),
        FlSpot(6, 3),
        FlSpot(10, 1.3),
        FlSpot(13, 2.5),
      ],
      // curved or straight line.
      isCurved: true,
      // Color of the rod.
      color: Color.fromRGBO(39, 182, 252, 1),
      barWidth: 6,
      // Data of dot.
      dotData: FlDotData(
        show: false,
      ),
      // To highlight the data below the line curve.
      belowBarData: BarAreaData(
        show: false,
      ),
    );

    final LineChartBarData lineChartBarData2 = LineChartBarData(
      spots: [
        FlSpot(1, 1),
        FlSpot(3, 1.5),
        FlSpot(5, 1.4),
        FlSpot(7, 3.4),
        FlSpot(10, 2),
        FlSpot(12, 2.2),
        FlSpot(13, 1.8),
      ],
      isCurved: true,
      color: const Color(0xff4af699),
      barWidth: 6,
      dotData: FlDotData(
        show: false,
      ),
      belowBarData: BarAreaData(
        show: false,
      ),
    );

    final LineChartBarData lineChartBarData3 = LineChartBarData(
      spots: [
        FlSpot(1, 1),
        FlSpot(3, 2.8),
        FlSpot(7, 1.2),
        FlSpot(10, 2.8),
        FlSpot(12, 2.6),
        FlSpot(13, 3.9),
      ],
      isCurved: true,
      color:const Color(0xffaa4cfc),
      barWidth: 5,
      dotData: FlDotData(
        show: false,
      ),
      belowBarData: BarAreaData(
        show: true,
        //colors:Color(0xffaa4cfc).withOpacity(0.3),
      ),
    );

    return [
      lineChartBarData1,
      lineChartBarData2,
      lineChartBarData3,
    ];
  }
}