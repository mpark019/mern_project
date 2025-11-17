import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:mobile/utils/GlobalData.dart';
import 'dart:convert';

class FoodScanService {
  static const String baseUrl = "http://10.0.2.2:5050";

  static Future<Map<String, dynamic>> scanFood(File imageFile) async {
    final url = Uri.parse("$baseUrl/food/scan");

    final request = http.MultipartRequest("POST", url)
      ..headers["Authorization"] = "Bearer ${GlobalData.token}"
      ..files.add(await http.MultipartFile.fromPath("image", imageFile.path));

    final response = await request.send();
    final resBody = await response.stream.bytesToString();

    if (response.statusCode != 200) {
      return {"error": "Scan failed: ${response.statusCode}"};
    }

    return jsonDecode(resBody);
  }
}
