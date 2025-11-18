import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';

class UserService {
  static const String baseUrl = "http://10.0.2.2:5050";

  static Future<void> updateCalorieGoal(int goal) async {
    final url = Uri.parse("$baseUrl/users/goal");

    await http.patch(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${GlobalData.token}",
      },
      body: jsonEncode({"goal": goal}),
    );
  }
}