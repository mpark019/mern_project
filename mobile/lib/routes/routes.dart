import 'package:flutter/material.dart';
import '../screens/LoginScreen.dart';
import '../screens/RegisterScreen.dart';
import '../screens/HomeScreen.dart';
import '../screens/CardsScreen.dart';
import '../screens/ProfileScreen.dart';
import '../screens/UserDetailsScreen.dart';

class AppRoutes {
  static const login = "/login";
  static const register = "/register";
  static const home = "/home";
  static const cards = "/cards";
  static const profile = "/profile";
  static const userDetails = "/user-details";

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    home: (context) => const HomeScreen(),
    cards: (context) => const CardsScreen(),
    profile: (context) => const ProfileScreen(),
    userDetails: (context) => const UserDetailsScreen(),
  };
}
