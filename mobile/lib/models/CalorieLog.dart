class CalorieLog {
  final String id;
  final String meal;
  final int calories;
  final int protein;
  final int carbs;
  final int fats;
  final String date;

  CalorieLog({
    required this.id,
    required this.meal,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fats,
    required this.date,
  });

  factory CalorieLog.fromJson(Map<String, dynamic> json) {
    return CalorieLog(
      id: json["_id"] ?? "",
      meal: json["meal"] ?? "",
      calories: (json["calories"] ?? 0).toInt(),
      protein: (json["protein"] ?? 0).toInt(),
      carbs: (json["carbs"] ?? 0).toInt(),
      fats: (json["fats"] ?? 0).toInt(),
      date: json["date"] ?? "",
    );
  }
}