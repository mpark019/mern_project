import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';

class CalorieService {
  static const String baseUrl = "http://10.0.2.2:5050/calories";

  // FIX: Use named parameters
  static Future<Map<String, dynamic>> addLog({
    required String meal,
    required int calories,
    required int protein,
    required int carbs,
    required int fats,
    required String date,
  }) async {
    final token = GlobalData.token;

    try {
      final res = await http.post(
        Uri.parse(baseUrl),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
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

      if (res.statusCode != 201) {
        return {"error": data["message"] ?? "Failed to add log"};
      }

      return data;
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // GET all logs
  static Future<List<dynamic>> getLogs() async {
    final token = GlobalData.token;

    try {
      final res = await http.get(
        Uri.parse(baseUrl),
        headers: {
          "Authorization": "Bearer $token",
        },
      );

      final data = jsonDecode(res.body);
      return data["meals"] ?? [];
    } catch (e) {
      return [];
    }
  }
}
