import 'package:flutter/material.dart';
import '../models/CalorieLog.dart';
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
  bool editMode = false;
  String? logId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final args = ModalRoute.of(context)?.settings.arguments;

    if (args is CalorieLog) {
      editMode = true;
      logId = args.id;

      mealCtrl.text = args.meal;
      caloriesCtrl.text = args.calories.toString();
      proteinCtrl.text = args.protein.toString();
      carbsCtrl.text = args.carbs.toString();
      fatsCtrl.text = args.fats.toString();
      dateCtrl.text = args.date;
    } else {
      final now = DateTime.now();
      dateCtrl.text =
          "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
    }
  }

  Future<void> save() async {
    setState(() => loading = true);

    final meal = mealCtrl.text.trim();
    final calories = int.tryParse(caloriesCtrl.text) ?? 0;
    final protein = int.tryParse(proteinCtrl.text) ?? 0;
    final carbs = int.tryParse(carbsCtrl.text) ?? 0;
    final fats = int.tryParse(fatsCtrl.text) ?? 0;
    final date = dateCtrl.text.trim();

    if (editMode) {
      await CalorieService.updateLog(
        id: logId!,
        meal: meal,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats,
        date: date,
      );
    } else {
      await CalorieService.addLog(
        meal: meal,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats,
        date: date,
      );
    }

    setState(() => loading = false);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Text(
          editMode ? "Edit Meal" : "Add Meal",
          style: const TextStyle(color: Colors.white),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            buildField(mealCtrl, "Meal"),
            buildField(caloriesCtrl, "Calories", number: true),
            buildField(proteinCtrl, "Protein (g)", number: true),
            buildField(carbsCtrl, "Carbs (g)", number: true),
            buildField(fatsCtrl, "Fats (g)", number: true),

            TextField(
              controller: dateCtrl,
              decoration: const InputDecoration(
                labelText: "Date (YYYY-MM-DD)",
                floatingLabelBehavior: FloatingLabelBehavior.always,
                contentPadding: EdgeInsets.symmetric(vertical: 18, horizontal: 12),
              ),
            ),

            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: loading ? null : save,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: loading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : Text(
                      editMode ? "Update Meal" : "Save Meal",
                      style: const TextStyle(color: Colors.white, fontSize: 17),
                    ),
            )
          ],
        ),
      ),
    );
  }

  Widget buildField(TextEditingController ctrl, String label,
      {bool number = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextField(
        controller: ctrl,
        keyboardType: number ? TextInputType.number : TextInputType.text,
        decoration: InputDecoration(
          labelText: label,
          floatingLabelBehavior: FloatingLabelBehavior.always,
          contentPadding:
              const EdgeInsets.symmetric(vertical: 18, horizontal: 12),
        ),
      ),
    );
  }
}
