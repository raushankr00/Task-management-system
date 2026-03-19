class TaskModel {
  final String id;
  final String title;
  final String? description;
  final String status;
  final String priority;
  final String? dueDate;
  final String createdAt;
  final String updatedAt;
  final String userId;

  TaskModel({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.createdAt,
    required this.updatedAt,
    required this.userId,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) => TaskModel(
        id: json['id'] as String,
        title: json['title'] as String,
        description: json['description'] as String?,
        status: json['status'] as String,
        priority: json['priority'] as String,
        dueDate: json['dueDate'] as String?,
        createdAt: json['createdAt'] as String,
        updatedAt: json['updatedAt'] as String,
        userId: json['userId'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'status': status,
        'priority': priority,
        'dueDate': dueDate,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
        'userId': userId,
      };

  TaskModel copyWith({
    String? title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) =>
      TaskModel(
        id: id,
        title: title ?? this.title,
        description: description ?? this.description,
        status: status ?? this.status,
        priority: priority ?? this.priority,
        dueDate: dueDate ?? this.dueDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
        userId: userId,
      );
}

class PaginationMeta {
  final int total;
  final int page;
  final int limit;
  final int totalPages;
  final bool hasNext;
  final bool hasPrev;

  PaginationMeta({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
    required this.hasNext,
    required this.hasPrev,
  });

  factory PaginationMeta.fromJson(Map<String, dynamic> json) => PaginationMeta(
        total: json['total'] as int,
        page: json['page'] as int,
        limit: json['limit'] as int,
        totalPages: json['totalPages'] as int,
        hasNext: json['hasNext'] as bool,
        hasPrev: json['hasPrev'] as bool,
      );
}
