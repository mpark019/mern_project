import 'dart:convert';
import 'package:http/http.dart' as http;

class APIService {
  static const String baseURL = "http://10.0.2.2:5050/users";

  // ---------------- LOGIN ----------------
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse("$baseURL/login");

    try {
      final res = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        return {
          "success": true,
          "token": data["token"],
          "user": {
            "id": data["_id"],
            "username": data["username"],
            "email": data["email"],
          }
        };
      } else {
        return {"error": data["message"] ?? "Login failed"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // ---------------- REGISTER ----------------
  static Future<Map<String, dynamic>> register(
      String username, String email, String password) async {
    final url = Uri.parse("$baseURL/");

    try {
      final res = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 201) {
        return {
          "success": true,
          "token": data["token"],
          "user": {
            "id": data["_id"],
            "username": data["username"],
            "email": data["email"],
          }
        };
      } else {
        return {"error": data["message"] ?? "Registration failed"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }
}
