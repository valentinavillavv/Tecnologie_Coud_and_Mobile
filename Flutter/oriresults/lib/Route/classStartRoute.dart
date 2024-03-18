import 'dart:convert';
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:oriresults/Widget/resultBox.dart';

const apiUrl = 'https://cghd6kwn0k.execute-api.us-east-1.amazonaws.com';

Future<List<Map<String, dynamic>>> fetchStart(
    String raceid, String className) async {
  final response = await http
      .get(Uri.parse('$apiUrl/start_list?ID=$raceid&class=$className'));

  if (response.statusCode == 200) {
    return List<Map<String, dynamic>>.from(jsonDecode(response.body));
  } else {
    throw Exception('Caricamento fallito');
  }
}

class ClassStartRoute extends StatefulWidget {
  final String raceid;
  final String className;
  const ClassStartRoute(this.raceid, this.className, {Key? key})
      : super(key: key);

  @override
  ClassStartRouteState createState() => ClassStartRouteState();
}

class ClassStartRouteState extends State<ClassStartRoute> {
  late Future<List<Map<String, dynamic>>> futureStart;

  late List<Map<String, dynamic>> startList;

  @override
  void initState() {
    super.initState();
    futureStart = fetchStart(widget.raceid, widget.className);
  }

  Future<void> _refresh() async {
    List<Map<String, dynamic>> oldData = startList;
    setState(() {
      futureStart = fetchStart(widget.raceid, widget.className);
      futureStart.then((newData) => {
            newData.forEach((element) {
              var found = false;
              oldData.forEach((oldElement) {
                if (element["Person"][0]["Id"][0] ==
                    oldElement["Person"][0]["Id"][0]) {
                  found = true;
                }
              });
              if (found) {
                element["isNew"] = false;
              } else {
                element["isNew"] = true;
              }
            })
          });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Start ${widget.className}'),
        backgroundColor: Color.fromARGB(255, 97, 206, 100),
      ),
      body: Container(
          decoration: BoxDecoration(
              image: DecorationImage(
                  image: AssetImage("assets/sfondo.jpg"), fit: BoxFit.cover)),
          child: Center(
            child: FutureBuilder<List<Map<String, dynamic>>>(
              future: futureStart,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  startList = snapshot.data!;
                  return RefreshIndicator(
                      onRefresh: _refresh,
                      child: ListView.builder(
                          itemCount: startList.length,
                          itemBuilder: ((context, index) {
                            String stringStart = //Calcolo finish-start
                                "${startList[index]["Start"][0]["StartTime"][0]}";
                            stringStart = stringStart.split("T")[1];
                            stringStart = stringStart.split("+")[0];
                            return ResultBox(
                                '${startList[index]["Person"][0]["Name"][0]["Family"][0]} ${startList[index]["Person"][0]["Name"][0]["Given"][0]}',
                                '${startList[index]["Organisation"]?[0]["Name"][0]}',
                                "",
                                stringStart,
                                index % 2,
                                isNuovo(startList[index]));
                          })));
                } else if (snapshot.hasError) {
                  return Text('${snapshot.error}');
                }
                return const CircularProgressIndicator(
                    color: Colors.lightGreen);
              },
            ),
          )),
      floatingActionButton: FloatingActionButton(
          onPressed: () {
            _refresh;
          },
          backgroundColor: Colors.lightGreen,
          child: const Icon(Icons.refresh)),
    );
  }

  bool isNuovo(Map<String, dynamic> result) {
    if (result["isNew"] != null) {
      if (result["isNew"]) {
        return (true);
      }
    }
    return (false);
  }
}
