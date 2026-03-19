import 'package:taskflow/features/tasks/data/datasources/task_remote_datasource.dart';
import 'package:taskflow/features/tasks/data/models/task_model.dart';

class TaskRepository {
  final TaskRemoteDatasource _datasource;

  TaskRepository(this._datasource);

  Future<Map<String, dynamic>> getTasks({
    int page = 1,
    int limit = 10,
    String? status,
    String? priority,
    String? search,
  }) =>
      _datasource.getTasks(
          page: page,
          limit: limit,
          status: status,
          priority: priority,
          search: search);

  Future<TaskModel> createTask({
    required String title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) =>
      _datasource.createTask(
          title: title,
          description: description,
          status: status,
          priority: priority,
          dueDate: dueDate);

  Future<TaskModel> updateTask({
    required String id,
    String? title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) =>
      _datasource.updateTask(
          id: id,
          title: title,
          description: description,
          status: status,
          priority: priority,
          dueDate: dueDate);

  Future<void> deleteTask(String id) => _datasource.deleteTask(id);

  Future<TaskModel> toggleTask(String id) => _datasource.toggleTask(id);
}
