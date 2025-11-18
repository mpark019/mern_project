import 'package:flutter/material.dart';
import '../utils/GlobalData.dart';
import '../services/UserService.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final goalCtrl = TextEditingController();
  final oldPassCtrl = TextEditingController();
  final newPassCtrl = TextEditingController();

  bool savingGoal = false;
  bool savingPass = false;

  @override
  void initState() {
    super.initState();
    goalCtrl.text = "${GlobalData.user?["calorieGoal"] ?? 2000}";
  }

  /// Safely get the user id from GlobalData
  String? _getUserId() {
    return GlobalData.user?["_id"] ?? GlobalData.user?["id"];
  }

  // -----------------------------
  // UPDATE DAILY CALORIE GOAL
  // -----------------------------
  Future<void> updateGoal() async {
    final id = _getUserId();
    if (id == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("User id not found in GlobalData")),
      );
      return;
    }

    final parsedGoal = int.tryParse(goalCtrl.text);
    if (parsedGoal == null || parsedGoal <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Enter a valid calorie goal")),
      );
      return;
    }

    setState(() => savingGoal = true);

    try {
      final res = await UserService.updateUser(id, {
        "calorieGoal": parsedGoal,
      });

      // Update in-memory user
      GlobalData.user = {
        ...?GlobalData.user,
        ...res, // backend user response contains calorieGoal
      };

      setState(() => savingGoal = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Calorie goal updated")),
      );
    } catch (e) {
      setState(() => savingGoal = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to update goal: $e")),
      );
    }
  }

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
  Future<void> updatePassword() async {
    final id = _getUserId();
    if (id == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("User id not found in GlobalData")),
      );
      return;
    }

    if (oldPassCtrl.text.isEmpty || newPassCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Fill out all password fields")),
      );
      return;
    }

    setState(() => savingPass = true);

    final body = {
      "currentPassword": oldPassCtrl.text,
      "newPassword": newPassCtrl.text,
    };

    try {
      final res = await UserService.changePassword(id, body);

      setState(() => savingPass = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res["message"] ?? "Password updated")),
      );
    } catch (e) {
      setState(() => savingPass = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to change password: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final username = GlobalData.user?["username"] ?? "";
    final email = GlobalData.user?["email"] ?? "";

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text("Profile", style: TextStyle(color: Colors.white)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // USER INFO CARD
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _infoRow("Username", username),
                  const SizedBox(height: 10),
                  _infoRow("Email", email),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // DAILY CALORIE GOAL
            const Text(
              "Daily Calorie Goal",
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: goalCtrl,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Calories",
                labelStyle: TextStyle(color: Colors.white70),
                enabledBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                focusedBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: savingGoal ? null : updateGoal,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
              child: savingGoal
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Save Goal", style: TextStyle(color: Colors.white)),
            ),

            const SizedBox(height: 30),

            // CHANGE PASSWORD
            const Text(
              "Change Password",
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
            const SizedBox(height: 10),

            TextField(
              controller: oldPassCtrl,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "Current Password",
                labelStyle: TextStyle(color: Colors.white70),
                enabledBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                focusedBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
              ),
            ),
            const SizedBox(height: 10),

            TextField(
              controller: newPassCtrl,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: "New Password",
                labelStyle: TextStyle(color: Colors.white70),
                enabledBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                focusedBorder:
                    UnderlineInputBorder(borderSide: BorderSide(color: Colors.orange)),
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: savingPass ? null : updatePassword,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blueGrey),
              child: savingPass
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text("Change Password", style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18)),
      ],
    );
  }
}