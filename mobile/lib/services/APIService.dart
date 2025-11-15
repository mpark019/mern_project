import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../utils/GlobalData.dart';

class APIService {

  static String _baseHost =
      kIsWeb ? "http://localhost:5050" : "http://10.0.2.2:5050";

  static String baseURL = "$_baseHost/users";


  static Future<Map<String, dynamic>> login(
      String email, String password) async {
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
        // backend returns: { _id, username, email, token }
        GlobalData.token = data["token"] ?? "";
        GlobalData.userId = data["_id"] ?? "";
        GlobalData.user = {
          "username": data["username"],
          "email": data["email"],
        };

        return {
          "success": true,
          "token": GlobalData.token,
          "user": GlobalData.user,
        };
      } else {
        return {"error": data["message"] ?? "Login failed"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  static Future<Map<String, dynamic>> register(
      String username, String email, String password) async {
    final url = Uri.parse(baseURL);

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
        // registration succeeded – caller can redirect to login
        return {"success": true};
      } else {
        return {"error": data["message"] ?? "Registration failed"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }


  static Map<String, String> _authHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${GlobalData.token}",
    };
  }



  // GET /users/me
  static Future<Map<String, dynamic>> fetchCurrentUser() async {
    final url = Uri.parse("$baseURL/me");

    try {
      final res = await http.get(url, headers: _authHeaders());
      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        GlobalData.user = data;
        GlobalData.userId = data["_id"] ?? GlobalData.userId;
        return {"success": true, "user": data};
      } else {
        return {"error": data["message"] ?? "Failed to fetch profile"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // GET /users
  static Future<Map<String, dynamic>> fetchAllUsers() async {
    final url = Uri.parse(baseURL);

    try {
      final res = await http.get(url, headers: _authHeaders());
      final data = jsonDecode(res.body);

      if (res.statusCode == 200 && data is List) {
        return {"success": true, "users": data};
      } else {
        return {"error": "Failed to fetch users"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // GET /users/:id
  static Future<Map<String, dynamic>> fetchUserById(String id) async {
    final url = Uri.parse("$baseURL/$id");

    try {
      final res = await http.get(url, headers: _authHeaders());
      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        return {"success": true, "user": data};
      } else {
        return {"error": data["message"] ?? "Failed to fetch user"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // PATCH /users/:id
  static Future<Map<String, dynamic>> updateUser(
      String id, Map<String, dynamic> update) async {
    final url = Uri.parse("$baseURL/$id");

    try {
      final res = await http.patch(
        url,
        headers: _authHeaders(),
        body: jsonEncode(update),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        if (id == GlobalData.userId) {
          GlobalData.user = data;
        }
        return {"success": true, "user": data};
      } else {
        return {"error": data["message"] ?? "Failed to update user"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }

  // DELETE /users/:id
  static Future<Map<String, dynamic>> deleteUser(String id) async {
    final url = Uri.parse("$baseURL/$id");

    try {
      final res = await http.delete(url, headers: _authHeaders());
      final data = jsonDecode(res.body);

      if (res.statusCode == 200) {
        return {"success": true, "message": data["message"]};
      } else {
        return {"error": data["message"] ?? "Failed to delete user"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }
}
