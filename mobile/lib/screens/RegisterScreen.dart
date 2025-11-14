import 'package:flutter/material.dart';
import '../services/APIService.dart';
import '../utils/GlobalData.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController usernameCtrl = TextEditingController();
  final TextEditingController emailCtrl = TextEditingController();
  final TextEditingController passwordCtrl = TextEditingController();

  bool loading = false;
  String errorMsg = "";

  void registerUser() async {
    setState(() {
      loading = true;
      errorMsg = "";
    });

    final response = await APIService.register(
      usernameCtrl.text.trim(),
      emailCtrl.text.trim(),
      passwordCtrl.text.trim(),
    );

    setState(() => loading = false);

    if (response.containsKey("error")) {
      setState(() => errorMsg = response["error"]);
      return;
    }

    // Save globally
    GlobalData.token = response["token"];
    GlobalData.user = response["user"];

    // Navigate to login or home
    Navigator.pushNamed(context, "/login");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Register")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: usernameCtrl,
              decoration: const InputDecoration(labelText: "Username"),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(labelText: "Email"),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: passwordCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Password"),
            ),
            const SizedBox(height: 20),

            if (errorMsg.isNotEmpty)
              Text(errorMsg, style: const TextStyle(color: Colors.red)),

            const SizedBox(height: 10),

            ElevatedButton(
              onPressed: loading ? null : registerUser,
              child: loading
                  ? const CircularProgressIndicator()
                  : const Text("Create Account"),
            ),
          ],
        ),
      ),
    );
  }
}
