import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';
import '../models/CalorieLog.dart';

class CalorieService {
  static const String baseURL = "http://10.0.2.2:5050/calories";

  // Add a new calorie log
  static Future<Map<String, dynamic>> addLog({
    required String meal,
    required int calories,
    required int protein,
    required int carbs,
    required int fats,
    required String date,
  }) async {
    final url = Uri.parse(baseURL);

    final res = await http.post(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${GlobalData.token}",
      },
      body: jsonEncode({
        "meal": meal,
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fats": fats,
        "date": date,
      }),
    );

    final data = jsonDecode(res.body);

    if (res.statusCode == 201) {
      return {"success": true};
    }

    return {"error": data["message"] ?? "Failed to add log"};
  }

  // Get logs for a specific date
  static Future<Map<String, dynamic>> getLogsByDate(String date) async {
    final url = Uri.parse("$baseURL/date/$date");

    final res = await http.get(
      url,
      headers: {"Authorization": "Bearer ${GlobalData.token}"},
    );

    final data = jsonDecode(res.body);

    if (res.statusCode == 200) {
      final meals = (data["meals"] as List)
          .map((e) => CalorieLog.fromJson(e))
          .toList();

      return {
        "meals": meals,
        "totalCalories": data["totalCalories"],
        "totalProtein": data["totalProtein"],
        "totalCarbs": data["totalCarbs"],
        "totalFats": data["totalFats"],
      };
    }

    return {"error": data["message"] ?? "Failed to load logs"};
  }
}
