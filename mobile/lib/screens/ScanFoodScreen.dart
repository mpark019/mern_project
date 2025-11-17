import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/FoodScanService.dart';
import '../services/CalorieService.dart';

class ScanFoodScreen extends StatefulWidget {
  const ScanFoodScreen({super.key});

  @override
  State<ScanFoodScreen> createState() => _ScanFoodScreenState();
}


class _ScanFoodScreenState extends State<ScanFoodScreen> {
  File? image;
  bool loading = false;
  Map<String, dynamic>? scanResult;

  final picker = ImagePicker();

  Future pickCamera() async {
    final picked = await picker.pickImage(source: ImageSource.camera);
    if (picked == null) return;

    setState(() => image = File(picked.path));
    scanImage();
  }

  Future scanImage() async {
    if (image == null) return;

    setState(() => loading = true);

    final res = await FoodScanService.scanFood(image!);

    setState(() {
      scanResult = res;
      loading = false;
    });
  }

  Future addToLog() async {
    if (scanResult == null) return;

    await CalorieService.addLog(
      meal: scanResult!["name"] ?? "Food Item",
      calories: scanResult!["calories"] ?? 0,
      protein: scanResult!["protein"] ?? 0,
      carbs: scanResult!["carbs"] ?? 0,
      fats: scanResult!["fats"] ?? 0,
      date: DateTime.now().toString().split("T")[0],
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0E0E0E),
      appBar: AppBar(title: const Text("Scan Food")),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              ElevatedButton.icon(
                onPressed: pickCamera,
                icon: const Icon(Icons.camera_alt),
                label: const Text("Take Photo"),
              ),
              const SizedBox(height: 20),
              if (image != null)
                Image.file(image!, height: 200),

              if (loading) const CircularProgressIndicator(),
              if (scanResult != null && !loading) ...[
                Text("Detected: ${scanResult!['name']}",
                    style: const TextStyle(color: Colors.white, fontSize: 20)),
                const SizedBox(height: 10),
                Text("Calories: ${scanResult!['calories']}"),
                Text("Protein: ${scanResult!['protein']}"),
                Text("Carbs: ${scanResult!['carbs']}"),
                Text("Fats: ${scanResult!['fats']}"),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: addToLog,
                  child: const Text("Add to Log"),
                ),
              ]
            ],
          ),
        ),
      ),
    );
  }
}
