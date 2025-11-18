import 'package:flutter/material.dart';
import '../utils/GlobalData.dart';
import '../routes/routes.dart';
import '../services/CalorieService.dart';
import '../models/CalorieLog.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int totalCalories = 0;
  int totalProtein = 0;
  int totalCarbs = 0;
  int totalFats = 0;

  List<CalorieLog> meals = [];
  bool loading = true;

  DateTime selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    loadLogs();
  }

  String formatDate(DateTime d) {
    return "${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";
  }

  Future<void> loadLogs() async {
    setState(() => loading = true);

    final res = await CalorieService.getLogsByDate(formatDate(selectedDate));

    if (res.containsKey("error")) {
      setState(() {
        meals = [];
        totalCalories = 0;
        totalProtein = 0;
        totalCarbs = 0;
        totalFats = 0;
        loading = false;
      });
      return;
    }

    setState(() {
      meals = res["meals"];
      totalCalories = res["totalCalories"];
      totalProtein = res["totalProtein"];
      totalCarbs = res["totalCarbs"];
      totalFats = res["totalFats"];
      loading = false;
    });
  }

  Future pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );

    if (picked != null) {
      setState(() => selectedDate = picked);
      loadLogs();
    }
  }

  @override
  Widget build(BuildContext context) {
    final dailyGoal = GlobalData.user?["calorieGoal"] ?? 2000;

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text(
          "YummyYummy",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_month, color: Colors.orange),
            onPressed: pickDate,
          ),
          IconButton(
            icon: const Icon(Icons.camera_alt, color: Colors.orange),
            onPressed: () => Navigator.pushNamed(context, "/scan"),
          ),
          TextButton(
            onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
            child: const Text("Profile", style: TextStyle(color: Colors.white)),
          ),
          TextButton(
            onPressed: () => GlobalData.logout(context),
            child: const Text("Sign Out", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.orange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Add Meal", style: TextStyle(color: Colors.white)),
        onPressed: () {
          Navigator.pushNamed(context, AppRoutes.addCalorie)
              .then((_) => loadLogs());
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,

      body: loading
          ? const Center(
              child: CircularProgressIndicator(color: Colors.orange))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Date text
                  Text(
                    "${selectedDate.month}/${selectedDate.day}/${selectedDate.year}",
                    style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w500),
                  ),

                  const SizedBox(height: 4),
                  const Text(
                    "Daily Intake",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold),
                  ),

                  const SizedBox(height: 16),
                  _intakeCard(dailyGoal),
                  const SizedBox(height: 28),

                  const Text(
                    "Meals",
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  meals.isEmpty
                      ? const Center(
                          child: Padding(
                            padding: EdgeInsets.only(top: 40),
                            child: Text("No meals logged",
                                style: TextStyle(color: Colors.white70)),
                          ),
                        )
                      : ListView.builder(
                          itemCount: meals.length,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemBuilder: (_, i) => _mealCard(meals[i]),
                        ),
                ],
              ),
            ),
    );
  }

  Widget _intakeCard(int goal) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 12,
            children: [
              _macro("Protein", totalProtein),
              _macro("Carbs", totalCarbs),
              _macro("Fats", totalFats),
            ],
          ),
          const SizedBox(height: 16),
          Text("CALORIES",
              style: TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 6),
          Text(
            "$totalCalories / $goal cal",
            style: const TextStyle(
                color: Colors.orange,
                fontSize: 18,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: (totalCalories / goal).clamp(0.0, 1.0),
            backgroundColor: Colors.white12,
            color: Colors.orange,
            minHeight: 6,
          )
        ],
      ),
    );
  }

  Widget _macro(String label, int amount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white12,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        "$label: ${amount}g",
        style: const TextStyle(color: Colors.white, fontSize: 14),
      ),
    );
  }

  Widget _mealCard(CalorieLog item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.06),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(item.meal,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text("${item.calories} cal",
              style: const TextStyle(color: Colors.orange)),
          const SizedBox(height: 8),

          Row(
            children: [
              _macro("P", item.protein),
              const SizedBox(width: 6),
              _macro("C", item.carbs),
              const SizedBox(width: 6),
              _macro("F", item.fats),
            ],
          ),

          const SizedBox(height: 12),
          Row(
            children: [
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.blueGrey.shade700,
                ),
                onPressed: () {
                  Navigator.pushNamed(context, AppRoutes.addCalorie,
                          arguments: item)
                      .then((_) => loadLogs());
                },
                child:
                    const Text("Edit", style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(width: 10),
              TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.red.shade700,
                ),
                onPressed: () async {
                  await CalorieService.deleteLog(item.id);
                  loadLogs();
                },
                child: const Text("Delete",
                    style: TextStyle(color: Colors.white)),
              ),
            ],
          )
        ],
      ),
    );
  }
}