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

  // ADD MEAL
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

  // GET BY DATE
  static Future<Map<String, dynamic>> getLogsByDate(String date) async {
    final url = Uri.parse("$baseUrl/calories/date/$date");

    final res = await http.get(url, headers: _headers());
    final data = jsonDecode(res.body);

    // Ensure backend responded with a list
    final list = (data is List) ? data : [];

    final meals = list.map((e) => CalorieLog.fromJson(e)).toList();

    return {
        "meals": meals,
          "totalCalories": list.fold<int>(
              0, (sum, e) => (sum + ((e["calories"] ?? 0) as num)).toInt()),
          "totalProtein": list.fold<int>(
              0, (sum, e) => (sum + ((e["protein"] ?? 0) as num)).toInt()),
          "totalCarbs": list.fold<int>(
              0, (sum, e) => (sum + ((e["carbs"] ?? 0) as num)).toInt()),
          "totalFats": list.fold<int>(
              0, (sum, e) => (sum + ((e["fats"] ?? 0) as num)).toInt()),
          };
  }

  // DELETE
  static Future<void> deleteLog(String id) async {
    final url = Uri.parse("$baseUrl/calories/$id");
    await http.delete(url, headers: _headers());
  }

  // UPDATE
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

  // GET ALL LOGS (optional)
  static Future<List<CalorieLog>> getLogs() async {
    final url = Uri.parse("$baseUrl/calories");
    final res = await http.get(url, headers: _headers());

    final data = jsonDecode(res.body);
    final list = data["meals"] as List;

    return list.map((e) => CalorieLog.fromJson(e)).toList();
  }
}