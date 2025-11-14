import 'package:flutter/material.dart';
import '../screens/LoginScreen.dart';
import '../screens/RegisterScreen.dart';
import '../screens/HomeScreen.dart';

class AppRoutes {
  static const login = "/login";
  static const register = "/register";
  static const home = "/home";

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    home: (context) => const HomeScreen(),
  };
}
