import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';
import '../models/CalorieLog.dart';

class CalorieService {
  static const String baseUrl = "http://10.0.2.2:5050";

  static Map<String, String> _headers() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${GlobalData.token}"
    };
  }

  // Add meal
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

  // Get logs for a selected date
  static Future<Map<String, dynamic>> getLogsByDate(String date) async {
    final url = Uri.parse("$baseUrl/calories/date/$date");

    final res = await http.get(url, headers: _headers());
    if (res.statusCode != 200) return {"error": "Failed to load logs"};

    final decoded = jsonDecode(res.body);

    final mealsJson = decoded["meals"] as List;
    final meals = mealsJson
        .map((e) => CalorieLog.fromJson(e as Map<String, dynamic>))
        .toList();

    return {
      "meals": meals,
      "totalCalories": decoded["totalCalories"] ?? 0,
      "totalProtein": decoded["totalProtein"] ?? 0,
      "totalCarbs": decoded["totalCarbs"] ?? 0,
      "totalFats": decoded["totalFats"] ?? 0,
    };
  }

  // Delete log
  static Future<void> deleteLog(String id) async {
    final url = Uri.parse("$baseUrl/calories/$id");
    await http.delete(url, headers: _headers());
  }

  // Update log
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

  // Get all logs
  static Future<List<CalorieLog>> getLogs() async {
    final url = Uri.parse("$baseUrl/calories");
    final res = await http.get(url, headers: _headers());
    final data = jsonDecode(res.body);

    final list = data["meals"] as List;
    return list.map((e) => CalorieLog.fromJson(e)).toList();
  }
}