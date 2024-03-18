import 'dart:convert';
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:oriresults/Route/classResultsRoute.dart';
import 'package:oriresults/Route/classStartRoute.dart';
import 'package:oriresults/Widget/menuButtonStyle.dart';

const apiUrl = 'https://cghd6kwn0k.execute-api.us-east-1.amazonaws.com';

Future<List<String>> fetchClasses(String raceid, String? startOrResult) async {
  //Come nella schermata precedente si crea una funzione di fetch per il caricamento
  //questa volta delle categorie di una certa gara identificata con il suo id

  final response = await http.get(Uri.parse(
      '$apiUrl/list_classes?ID=$raceid&startOrResult=$startOrResult'));

  if (response.statusCode == 200) {
    return List<String>.from(jsonDecode(response.body));
  } else {
    //Se non ottengo 200 allora lancio un' eccezione
    throw Exception('Caricamento fallito');
  }
}

class ClassesRoute extends StatefulWidget {
  final String raceid;
  final String? startOrResult;
  const ClassesRoute(this.raceid, this.startOrResult, {Key? key})
      : super(key: key);

  @override
  ClassesRouteState createState() => ClassesRouteState();
}

class ClassesRouteState extends State<ClassesRoute> {
  late Future<List<String>> futureClasses;
  final GlobalKey<RefreshIndicatorState> _refreshIndicatorKey =
      GlobalKey<RefreshIndicatorState>();

  @override
  void initState() {
    super.initState();
    futureClasses = fetchClasses(widget.raceid, widget.startOrResult);
  }

  Future<void> _refresh() async {
    setState(() {
      futureClasses = fetchClasses(widget.raceid, widget.startOrResult);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Classes'),
        backgroundColor: Color.fromARGB(255, 97, 206, 100),
        centerTitle: true,
      ),
      body: Container(
          decoration: BoxDecoration(
              image: DecorationImage(
                  image: AssetImage("assets/sfondo.jpg"), fit: BoxFit.cover)),
          child: Center(
              child: FutureBuilder<List<String>>(
                  future: futureClasses,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      List<String> classes = snapshot.data!;
                      return RefreshIndicator(
                          key: _refreshIndicatorKey,
                          color: Colors.white,
                          backgroundColor: Colors.lightGreen,
                          strokeWidth: 4.0,
                          onRefresh: _refresh,
                          child: ListView.builder(
                              itemCount: classes.length,
                              padding: EdgeInsets.fromLTRB(
                                  MediaQuery.of(context).size.width * 0.02,
                                  MediaQuery.of(context).size.height * 0.01,
                                  MediaQuery.of(context).size.width * 0.02,
                                  MediaQuery.of(context).size.height * 0.01),
                              itemBuilder: ((context, index) => ElevatedButton(
                                    style: menuButtonStyle(),
                                    onPressed: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) => ClassRoute(
                                                  widget.raceid,
                                                  classes[index])));
                                    },
                                    child: Text(classes[index]),
                                  ))));
                    } else if (snapshot.hasError) {
                      return Text('${snapshot.data}');
                    }

                    return const CircularProgressIndicator(
                      color: Colors.lightGreen,
                    );
                  }))),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Show refresh indicator programmatically on button tap.
          _refreshIndicatorKey.currentState?.show();
        },
        backgroundColor: Colors.lightGreen,
        child: const Icon(Icons.refresh_rounded),
      ),
    );
  }

  ClassRoute(String raceid, String classSel) {
    if (widget.startOrResult == 'Result') {
      return ClassResultsRoute(raceid, classSel);
    } else {
      return ClassStartRoute(raceid, classSel);
    }
  }
}
