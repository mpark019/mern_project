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

  List<CalorieLog> todayMeals = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadTodayLogs();
  }

  Future<void> loadTodayLogs() async {
    final today = DateTime.now();
    final formatted =
        "${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}";

    final res = await CalorieService.getLogsByDate(formatted);

    setState(() {
      loading = false;

      if (res.containsKey("error")) {
        todayMeals = [];
        totalCalories = 0;
        totalProtein = 0;
        totalCarbs = 0;
        totalFats = 0;
        return;
      }

      todayMeals = res["meals"];
      totalCalories = res["totalCalories"];
      totalProtein = res["totalProtein"];
      totalCarbs = res["totalCarbs"];
      totalFats = res["totalFats"];
    });
  }

  @override
  Widget build(BuildContext context) {
    final username = GlobalData.user?["username"] ?? "User";
    final email = GlobalData.user?["email"] ?? "";

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
            icon: const Icon(Icons.camera_alt, color: Colors.orange),
            onPressed: () {
              Navigator.pushNamed(context, "/scan");
            },
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

      body: loading
          ? const Center(child: CircularProgressIndicator(color: Colors.orange))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _formatToday(),
                    style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Today's Intake",
                    style: TextStyle(
                        color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),

                  _intakeCard(),
                  const SizedBox(height: 28),

                  const Text(
                    "Today's Log",
                    style: TextStyle(
                        color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  todayMeals.isEmpty
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 40),
                            child: Text(
                              "No meals logged for today",
                              style: TextStyle(color: Colors.white70),
                            ),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: todayMeals.length,
                          itemBuilder: (_, i) {
                            final item = todayMeals[i];
                            return _mealCard(item);
                          },
                        ),
                ],
              ),
            ),

      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.orange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Add Meal",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () {
          Navigator.pushNamed(context, AppRoutes.addCalorie)
              .then((_) => loadTodayLogs());
        },
      ),

      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _intakeCard() {
    return Container(
      padding: const EdgeInsets.all(20),
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
              _macroPill("Protein", totalProtein),
              _macroPill("Carbs", totalCarbs),
              _macroPill("Fats", totalFats),
            ],
          ),
          const SizedBox(height: 16),
          Text("CALORIES",
              style: TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 6),
          Text(
            "$totalCalories / 2000 cal",
            style: const TextStyle(
                color: Colors.orange, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: (totalCalories / 2000).clamp(0.0, 1.0),
            backgroundColor: Colors.white12,
            color: Colors.orange,
            minHeight: 6,
          ),
        ],
      ),
    );
  }

  Widget _macroPill(String label, int amount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.05),
      borderRadius: BorderRadius.circular(14),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          item.meal,
          style: const TextStyle(
              color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),

        Text("${item.calories} cal",
            style: const TextStyle(color: Colors.orange)),
        const SizedBox(height: 8),

        Row(
          children: [
            _macroPill("P", item.protein),
            const SizedBox(width: 6),
            _macroPill("C", item.carbs),
            const SizedBox(width: 6),
            _macroPill("F", item.fats),
          ],
        ),

        const SizedBox(height: 12),

        Row(
          children: [
            // EDIT BUTTON
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.blueGrey.shade700,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(6)),
              ),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.addCalorie,
                  arguments: item, // pass meal to edit
                ).then((_) => loadTodayLogs());
              },
              child: const Text("Edit", style: TextStyle(color: Colors.white)),
            ),

            const SizedBox(width: 10),

            // DELETE BUTTON
            TextButton(
              style: TextButton.styleFrom(
                backgroundColor: Colors.red.shade700,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(6)),
              ),
              onPressed: () async {
                await CalorieService.deleteLog(item.id);
                loadTodayLogs();
              },
              child: const Text("Delete", style: TextStyle(color: Colors.white)),
            ),
          ],
        )
      ],
    ),
  );
}


  String _formatToday() {
    final now = DateTime.now();
    return "${now.month}/${now.day}/${now.year}";
  }
}
