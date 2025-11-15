import 'package:flutter/material.dart';
import '../services/APIService.dart';
import '../routes/routes.dart';

class CardsScreen extends StatefulWidget {
  const CardsScreen({super.key});

  @override
  State<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  bool loading = true;
  String error = "";
  List users = [];

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    final res = await APIService.fetchAllUsers();
    if (!mounted) return;

    if (res.containsKey("error")) {
      setState(() {
        loading = false;
        error = res["error"];
      });
    } else {
      setState(() {
        loading = false;
        users = res["users"] ?? [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Users")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text(error))
              : ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, index) {
                    final user = users[index];
                    return Card(
                      margin:
                          const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        title: Text(user["username"] ?? "Unnamed"),
                        subtitle: Text(user["email"] ?? ""),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.userDetails,
                            arguments: user["_id"],
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
