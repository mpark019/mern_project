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

  void loadLogs() async {
    final data = await CalorieService.getLogs();

    setState(() {
      logs = data.map<CalorieLog>((json) => CalorieLog.fromJson(json)).toList();
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Calorie Logs")),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, "/calories/add"),
        child: const Icon(Icons.add),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: logs.length,
              itemBuilder: (context, index) {
                final log = logs[index];
                return ListTile(
                  title: Text(log.meal),
                  subtitle: Text("${log.calories} calories"),
                );
              },
            ),
    );
  }
}
