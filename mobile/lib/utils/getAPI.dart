import 'dart:convert';
import 'package:http/http.dart' as http;

class API {
  static const String baseURL = "http://10.0.2.2:5050/users";

  static Future<Map<String, dynamic>> postAPI(
      String endpoint, Map<String, dynamic> bodyData) async {
    final url = Uri.parse("$baseURL/$endpoint");

    try {
      final res = await http.post(url,
          headers: {"Content-Type": "application/json"},
          body: jsonEncode(bodyData));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      } else {
        return {"error": "Server Error: ${res.statusCode}"};
      }
    } catch (e) {
      return {"error": e.toString()};
    }
  }
}
