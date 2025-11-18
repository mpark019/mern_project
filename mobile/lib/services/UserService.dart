import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';

class UserService {
  static const String baseUrl = "http://10.0.2.2:5050/api/users";

  static Map<String, String> _headers() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${GlobalData.token}",
    };
  }

  // Update calorie goal or username/email
  static Future<Map<String, dynamic>> updateUser(String id, Map<String, dynamic> body) async {
    final url = Uri.parse("$baseUrl/$id");
    final res = await http.patch(url, headers: _headers(), body: jsonEncode(body));
    return jsonDecode(res.body);
  }

  // Change password
  static Future<Map<String, dynamic>> changePassword(String id, Map<String, dynamic> body) async {
    final url = Uri.parse("$baseUrl/$id/password");
    final res = await http.patch(url, headers: _headers(), body: jsonEncode(body));
    return jsonDecode(res.body);
  }

  // Fetch current user profile
  static Future<Map<String, dynamic>> getMe() async {
    final url = Uri.parse("$baseUrl/me");
    final res = await http.get(url, headers: _headers());
    return jsonDecode(res.body);
  }
}