import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/FoodScanService.dart';

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

  Future pickGallery() async {
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    setState(() => image = File(picked.path));
    processImage();
  }

  Future pickCamera() async {
    final picked = await picker.pickImage(source: ImageSource.camera);
    if (picked == null) return;
    setState(() => image = File(picked.path));
    processImage();
  }

  Future processImage() async {
    setState(() => loading = true);

    final result = await FoodScanService.scanAndSave(image!);

    setState(() {
      scanResult = result;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text("Scan Food"), backgroundColor: Colors.black),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            ElevatedButton.icon(
              icon: Icon(Icons.photo),
              label: Text("Gallery"),
              onPressed: pickGallery,
            ),
            SizedBox(height: 10),
            ElevatedButton.icon(
              icon: Icon(Icons.camera_alt),
              label: Text("Camera"),
              onPressed: pickCamera,
            ),
            SizedBox(height: 20),

            if (image != null) Image.file(image!, height: 200),

            if (loading)
              CircularProgressIndicator(color: Colors.orange),

            if (scanResult != null && scanResult!["error"] == null) ...[
              SizedBox(height: 20),
              Text("Saved to Log ✔",
                  style: TextStyle(color: Colors.green, fontSize: 18)),
            ],

            if (scanResult != null && scanResult!["error"] != null)
              Text(scanResult!["error"],
                  style: TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }
}