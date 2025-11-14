import 'package:flutter/material.dart';
import '../utils/GlobalData.dart';

class CardsScreen extends StatelessWidget {
  const CardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Cards"),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Text(
          "Welcome, ${GlobalData.firstName} ${GlobalData.lastName}!",
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
