import 'package:flutter/material.dart';
import '../utils/GlobalData.dart';
import '../routes/routes.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final username = GlobalData.user?["username"] ?? "User";
    final email = GlobalData.user?["email"] ?? "";

    return Scaffold(
      appBar: AppBar(
        title: const Text("Home"),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Welcome, $username",
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              if (email.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(email, style: const TextStyle(color: Colors.grey)),
              ],
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, AppRoutes.cards),
                child: const Text("View Users (Cards)"),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
                child: const Text("View / Edit Profile"),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pushNamed(context, AppRoutes.calories),
                child: const Text("Calorie Tracker"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
