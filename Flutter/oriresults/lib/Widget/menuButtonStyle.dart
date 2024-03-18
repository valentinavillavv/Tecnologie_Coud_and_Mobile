import 'package:flutter/material.dart';

ButtonStyle menuButtonStyle() {
  return ButtonStyle(
      padding: MaterialStateProperty.all(EdgeInsets.fromLTRB(20, 25, 20, 25)),
      backgroundColor:
          MaterialStateProperty.all(Color.fromARGB(213, 216, 216, 216)),
      foregroundColor: MaterialStateProperty.all(Colors.black),
      shape: MaterialStateProperty.all(RoundedRectangleBorder(
          side: BorderSide(color: Color.fromARGB(255, 122, 122, 122), width: 2),
          borderRadius: BorderRadius.circular(10))),
      elevation: MaterialStateProperty.all(10));
}
