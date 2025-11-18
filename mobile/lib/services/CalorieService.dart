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

  // ADD LOG (with time)
  static Future<Map<String, dynamic>> addLog({
    required String meal,
    required int calories,
    required int protein,
    required int carbs,
    required int fats,
    required String date,
  }) async {

    // Convert YYYY-MM-DD → YYYY-MM-DD HH:mm:ss
    String fixedDate = date;
    if (date.length == 10) {
      final now = DateTime.now();
      final time = "${now.hour.toString().padLeft(2,'0')}:${now.minute.toString().padLeft(2,'0')}:${now.second.toString().padLeft(2,'0')}";
      fixedDate = "$date $time";
    }

    final url = Uri.parse("$baseUrl/calories");

    final body = {
      "meal": meal,
      "calories": calories,
      "protein": protein,
      "carbs": carbs,
      "fats": fats,
      "date": fixedDate,
    };

    final res =
        await http.post(url, headers: _headers(), body: jsonEncode(body));

    return jsonDecode(res.body);
  }

  static Future<Map<String, dynamic>> getLogsByDate(String date) async {
    final cleaned = date.split(" ")[0];
    final url = Uri.parse("$baseUrl/calories/date/$cleaned");

    final res = await http.get(url, headers: _headers());
    if (res.statusCode != 200) return {"error": true};

    final decoded = jsonDecode(res.body);

    final meals = (decoded["meals"] as List)
        .map((e) => CalorieLog.fromJson(e))
        .toList();

    return {
      "meals": meals,
      "totalCalories": decoded["totalCalories"] ?? 0,
      "totalProtein": decoded["totalProtein"] ?? 0,
      "totalCarbs": decoded["totalCarbs"] ?? 0,
      "totalFats": decoded["totalFats"] ?? 0,
    };
  }

  static Future<void> deleteLog(String id) async {
    final url = Uri.parse("$baseUrl/calories/$id");
    await http.delete(url, headers: _headers());
  }

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
    final fixedDate = date.split(" ")[0];

    final body = {
      "meal": meal,
      "calories": calories,
      "protein": protein,
      "carbs": carbs,
      "fats": fats,
      "date": fixedDate,
    };

    await http.patch(url, headers: _headers(), body: jsonEncode(body));
  }
}