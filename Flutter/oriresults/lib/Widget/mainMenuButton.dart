import 'package:flutter/material.dart';
import 'package:oriresults/Route/classesRoute.dart';

class MainMenuButton extends StatelessWidget {
  final String tl;
  final String isNew;
  final String bl;
  final String raceid;
  const MainMenuButton(this.tl, this.bl, this.isNew, this.raceid, {Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Table(
        defaultVerticalAlignment: TableCellVerticalAlignment.middle,
        columnWidths: {
          0: FlexColumnWidth(MediaQuery.of(context).size.width * 0.49),
          1: FlexColumnWidth(MediaQuery.of(context).size.width * 0.07),
          2: FlexColumnWidth(MediaQuery.of(context).size.width * 0.30),
        },
        children: <TableRow>[
          TableRow(children: [
            Column(
              children: [
                Row(
                  children: [
                    Expanded(
                        child: Text(
                      '$tl\n',
                      overflow: TextOverflow.ellipsis,
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                    ))
                  ],
                ),
                Row(
                  children: [
                    Expanded(
                        child: Text(
                      bl,
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      style: TextStyle(fontSize: 15),
                    ))
                  ],
                )
              ],
            ),
            Column(
              children: [
                Text(
                  isNew,
                  style: TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                )
              ],
            ),
            Column(
              children: [
                DropdownButton<String>(
                  items: <String>[
                    "Start",
                    "Result",
                  ].map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      child: Text(value),
                      value: value,
                    );
                  }).toList(),
                  onChanged: (String? sel) => {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ClassesRoute(raceid, sel)),
                    )
                  },
                  iconSize: 0.1,
                  alignment: Alignment.center,
                  hint: const Icon(Icons.arrow_downward),
                  dropdownColor: Colors.lightGreen,
                  borderRadius: BorderRadius.circular(20),
                )
              ],
            )
          ])
        ]);
  }
}
