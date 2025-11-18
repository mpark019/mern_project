import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';
import 'CalorieService.dart';

class FoodScanService {
  static const String baseUrl = "http://10.0.2.2:5050";

  // Scan image and automatically save result as a meal log
  static Future<Map<String, dynamic>> scanAndSave(File imageFile) async {
    final url = Uri.parse("$baseUrl/food-scan");

    // Convert image to base64
    final bytes = await imageFile.readAsBytes();
    final base64Image = "data:image/jpeg;base64,${base64Encode(bytes)}";

    final res = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${GlobalData.token}",
      },
      body: jsonEncode({
        "imageBase64": base64Image,
      }),
    );

    if (res.statusCode != 200) {
      return {"error": "Scan failed: ${res.statusCode}"};
    }

    final data = jsonDecode(res.body);

    final foods = data["foods"] as List;
    final mealName = foods.map((f) => f["name"]).join(", ");

    final calories = (data["totalCalories"] ?? 0).toInt();
    final protein = (data["totalProtein"] ?? 0).toInt();
    final carbs = (data["totalCarbs"] ?? 0).toInt();
    final fats = (data["totalFats"] ?? 0).toInt();

    // Build date as "YYYY-MM-DD HH:mm:ss"
    final now = DateTime.now();
    final today =
        "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')} "
        "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}";

    final saveRes = await CalorieService.addLog(
      meal: mealName,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fats: fats,
      date: today,
    );

    return {
      "foods": foods,
      "meal": mealName,
      "calories": calories,
      "protein": protein,
      "carbs": carbs,
      "fats": fats,
      "added": saveRes,
    };
  }
}