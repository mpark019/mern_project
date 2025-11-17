import 'package:flutter/material.dart';
import '../services/CalorieService.dart';
import '../models/CalorieLog.dart';

class CalorieListScreen extends StatefulWidget {
  const CalorieListScreen({super.key});

  @override
  State<CalorieListScreen> createState() => _CalorieListScreenState();
}

class _CalorieListScreenState extends State<CalorieListScreen> {
  List<CalorieLog> logs = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadLogs();
  }

  Future<void> loadLogs() async {
    final today = DateTime.now().toIso8601String().split("T")[0];
    final res = await CalorieService.getLogsByDate(today);

    if (!mounted) return;

    if (res.containsKey("error")) {
      setState(() {
        loading = false;
        logs = [];
      });
    } else {
      setState(() {
        loading = false;
        logs = res["meals"];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Today's Meals")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: logs.length,
              itemBuilder: (_, i) {
                final item = logs[i];
                return ListTile(
                  title: Text(item.meal),
                  subtitle: Text("Calories: ${item.calories}"),
                );
              },
            ),
    );
  }
}
