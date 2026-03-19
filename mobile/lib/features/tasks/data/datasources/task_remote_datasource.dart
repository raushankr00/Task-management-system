import 'package:taskflow/core/network/api_client.dart';
import 'package:taskflow/features/tasks/data/models/task_model.dart';

class TaskRemoteDatasource {
  final ApiClient _apiClient;

  TaskRemoteDatasource(this._apiClient);

  Future<Map<String, dynamic>> getTasks({
    int page = 1,
    int limit = 10,
    String? status,
    String? priority,
    String? search,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
      if (status != null && status.isNotEmpty) 'status': status,
      if (priority != null && priority.isNotEmpty) 'priority': priority,
      if (search != null && search.isNotEmpty) 'search': search,
    };

    final response = await _apiClient.dio.get('/tasks', queryParameters: params);
    final data = response.data['data'] as Map<String, dynamic>;

    final tasks = (data['data'] as List)
        .map((e) => TaskModel.fromJson(e as Map<String, dynamic>))
        .toList();

    final pagination = PaginationMeta.fromJson(
        data['pagination'] as Map<String, dynamic>);

    return {'tasks': tasks, 'pagination': pagination};
  }

  Future<TaskModel> createTask({
    required String title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) async {
    final response = await _apiClient.dio.post('/tasks', data: {
      'title': title,
      if (description != null && description.isNotEmpty)
        'description': description,
      if (status != null) 'status': status,
      if (priority != null) 'priority': priority,
      if (dueDate != null) 'dueDate': dueDate,
    });
    return TaskModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<TaskModel> updateTask({
    required String id,
    String? title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) async {
    final response = await _apiClient.dio.patch('/tasks/$id', data: {
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (status != null) 'status': status,
      if (priority != null) 'priority': priority,
      if (dueDate != null) 'dueDate': dueDate,
    });
    return TaskModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }

  Future<void> deleteTask(String id) async {
    await _apiClient.dio.delete('/tasks/$id');
  }

  Future<TaskModel> toggleTask(String id) async {
    final response = await _apiClient.dio.patch('/tasks/$id/toggle');
    return TaskModel.fromJson(response.data['data'] as Map<String, dynamic>);
  }
}
