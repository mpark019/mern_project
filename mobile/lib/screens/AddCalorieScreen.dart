import 'package:flutter/material.dart';
import '../services/CalorieService.dart';

class AddCalorieScreen extends StatefulWidget {
  const AddCalorieScreen({super.key});

  @override
  State<AddCalorieScreen> createState() => _AddCalorieScreenState();
}

class _AddCalorieScreenState extends State<AddCalorieScreen> {
  final mealCtrl = TextEditingController();
  final caloriesCtrl = TextEditingController();
  final proteinCtrl = TextEditingController();
  final carbsCtrl = TextEditingController();
  final fatsCtrl = TextEditingController();
  final dateCtrl = TextEditingController();

  bool loading = false;
  String errorMsg = "";

  void save() async {
    setState(() {
      loading = true;
      errorMsg = "";
    });

    final res = await CalorieService.addLog(
      meal: mealCtrl.text,
      calories: int.parse(caloriesCtrl.text),
      protein: int.parse(proteinCtrl.text),
      carbs: int.parse(carbsCtrl.text),
      fats: int.parse(fatsCtrl.text),
      date: dateCtrl.text,
    );

    setState(() => loading = false);

    if (res.containsKey("error")) {
      setState(() => errorMsg = res["error"]);
    } else {
      Navigator.pop(context); // Go back to list
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add Calorie Log")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            TextField(
              controller: mealCtrl,
              decoration: const InputDecoration(labelText: "Meal"),
            ),
            TextField(
              controller: caloriesCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Calories"),
            ),
            TextField(
              controller: proteinCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Protein (g)"),
            ),
            TextField(
              controller: carbsCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Carbs (g)"),
            ),
            TextField(
              controller: fatsCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Fats (g)"),
            ),
            TextField(
              controller: dateCtrl,
              decoration: const InputDecoration(labelText: "Date (YYYY-MM-DD)"),
            ),
            const SizedBox(height: 20),
            if (errorMsg.isNotEmpty)
              Text(errorMsg, style: const TextStyle(color: Colors.red)),
            ElevatedButton(
              onPressed: loading ? null : save,
              child: loading
                  ? const CircularProgressIndicator()
                  : const Text("Save"),
            ),
          ],
        ),
      ),
    );
  }
}
