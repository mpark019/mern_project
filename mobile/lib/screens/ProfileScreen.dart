import 'package:flutter/material.dart';
import '../services/APIService.dart';
import '../utils/GlobalData.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool loading = true;
  String error = "";
  final usernameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadMe();
  }

  Future<void> _loadMe() async {
    final res = await APIService.fetchCurrentUser();
    if (!mounted) return;

    if (res.containsKey("error")) {
      setState(() {
        loading = false;
        error = res["error"];
      });
    } else {
      final user = res["user"] ?? {};
      usernameCtrl.text = user["username"] ?? "";
      emailCtrl.text = user["email"] ?? "";
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> _save() async {
    setState(() {
      loading = true;
      error = "";
    });

    final res = await APIService.updateUser(GlobalData.userId, {
      "username": usernameCtrl.text.trim(),
      "email": emailCtrl.text.trim(),
    });

    if (!mounted) return;

    if (res.containsKey("error")) {
      setState(() {
        loading = false;
        error = res["error"];
      });
    } else {
      setState(() {
        loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profile updated")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profile")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  if (error.isNotEmpty)
                    Text(error, style: const TextStyle(color: Colors.red)),
                  TextField(
                    controller: usernameCtrl,
                    decoration: const InputDecoration(labelText: "Username"),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: emailCtrl,
                    decoration: const InputDecoration(labelText: "Email"),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _save,
                    child: const Text("Save"),
                  ),
                ],
              ),
            ),
    );
  }
}
