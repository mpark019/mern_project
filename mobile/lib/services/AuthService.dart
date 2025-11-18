import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = "http://10.0.2.2:5050";

  static Future<void> sendPasswordReset(String email) async {
    final url = Uri.parse("$baseUrl/auth/request-reset");

    await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email}),
    );
  }
}