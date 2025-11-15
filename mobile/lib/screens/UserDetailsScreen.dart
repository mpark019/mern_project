import 'package:flutter/material.dart';
import '../services/APIService.dart';

class UserDetailsScreen extends StatefulWidget {
  const UserDetailsScreen({super.key});

  @override
  State<UserDetailsScreen> createState() => _UserDetailsScreenState();
}

class _UserDetailsScreenState extends State<UserDetailsScreen> {
  bool loading = true;
  String error = "";
  Map<String, dynamic>? user;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final userId = ModalRoute.of(context)!.settings.arguments as String;
    _loadUser(userId);
  }

  Future<void> _loadUser(String id) async {
    final res = await APIService.fetchUserById(id);
    if (!mounted) return;

    if (res.containsKey("error")) {
      setState(() {
        loading = false;
        error = res["error"];
      });
    } else {
      setState(() {
        loading = false;
        user = res["user"];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userId = ModalRoute.of(context)!.settings.arguments as String;

    return Scaffold(
      appBar: AppBar(title: const Text("User Details")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text(error))
              : Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?["username"] ?? "User",
                        style: const TextStyle(
                            fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(user?["email"] ?? ""),
                      const Spacer(),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                        ),
                        onPressed: () async {
                          final res = await APIService.deleteUser(userId);
                          if (!mounted) return;
                          Navigator.pop(context, res);
                        },
                        child: const Text("Delete User"),
                      ),
                    ],
                  ),
                ),
    );
  }
}
