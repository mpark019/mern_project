import 'package:flutter/material.dart';
import '../routes/routes.dart';

class GlobalData {
  static String token = "";
  static String userId = "";
  static Map<String, dynamic>? user;

  static void logout(BuildContext context) {
    token = "";
    userId = "";
    user = null;

    Navigator.pushNamedAndRemoveUntil(
      context,
      AppRoutes.login,
      (route) => false,
    );
  }
}
