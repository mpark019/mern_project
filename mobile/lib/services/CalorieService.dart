import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';
import '../models/CalorieLog.dart';

class CalorieService {
  static const String baseUrl = "http://10.0.2.2:5050";

  static Map<String, String> _headers() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${GlobalData.token}",
    };
  }

  // Create new log
  static Future<Map<String, dynamic>> addLog({
    required String meal,
    required int calories,
    required int protein,
    required int carbs,
    required int fats,
    required String date,
  }) async {
    final url = Uri.parse("$baseUrl/calories");

    final body = {
      "meal": meal,
      "calories": calories,
      "protein": protein,
      "carbs": carbs,
      "fats": fats,
      "date": date,
    };

    final res =
        await http.post(url, headers: _headers(), body: jsonEncode(body));

    return jsonDecode(res.body);
  }

  // Get logs by specific date
  static Future<Map<String, dynamic>> getLogsByDate(String date) async {
    final url = Uri.parse("$baseUrl/calories/date/$date");

    final res = await http.get(url, headers: _headers());
    final data = jsonDecode(res.body);

    // If backend returned an error
    if (data is Map && data.containsKey("error")) {
      return {"error": data["error"]};
    }

    // Ensure meals are mapped to model objects
    final mealsJson = data["meals"] ?? [];

    final meals = (mealsJson as List)
        .map((e) => CalorieLog.fromJson(e))
        .toList();

    return {
      "meals": meals,
      "totalCalories": data["totalCalories"] ?? 0,
      "totalProtein": data["totalProtein"] ?? 0,
      "totalCarbs": data["totalCarbs"] ?? 0,
      "totalFats": data["totalFats"] ?? 0,
    };
  }

  // Delete one log
  static Future<void> deleteLog(String id) async {
    final url = Uri.parse("$baseUrl/calories/$id");
    await http.delete(url, headers: _headers());
  }

  // Update existing log
  static Future<void> updateLog({
    required String id,
    required String meal,
    required int calories,
    required int protein,
    required int carbs,
    required int fats,
    required String date,
  }) async {
    final url = Uri.parse("$baseUrl/calories/$id");

    final body = {
      "meal": meal,
      "calories": calories,
      "protein": protein,
      "carbs": carbs,
      "fats": fats,
      "date": date,
    };

    await http.patch(url, headers: _headers(), body: jsonEncode(body));
  }

  // Get all logs (optional for list screen)
  static Future<List<CalorieLog>> getLogs() async {
    final url = Uri.parse("$baseUrl/calories");
    final res = await http.get(url, headers: _headers());

    final data = jsonDecode(res.body);
    final list = data["meals"] as List;

    return list.map((e) => CalorieLog.fromJson(e)).toList();
  }
}
