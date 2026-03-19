import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:taskflow/features/auth/presentation/providers/auth_provider.dart';
import 'package:taskflow/features/tasks/data/datasources/task_remote_datasource.dart';
import 'package:taskflow/features/tasks/data/models/task_model.dart';
import 'package:taskflow/features/tasks/data/repositories/task_repository.dart';

final taskRepositoryProvider = Provider<TaskRepository>((ref) {
  final datasource = TaskRemoteDatasource(ref.watch(apiClientProvider));
  return TaskRepository(datasource);
});

class TaskFilters {
  final String? status;
  final String? priority;
  final String? search;
  final int page;

  const TaskFilters({
    this.status,
    this.priority,
    this.search,
    this.page = 1,
  });

  TaskFilters copyWith({
    String? status,
    String? priority,
    String? search,
    int? page,
    bool clearStatus = false,
    bool clearPriority = false,
    bool clearSearch = false,
  }) =>
      TaskFilters(
        status: clearStatus ? null : (status ?? this.status),
        priority: clearPriority ? null : (priority ?? this.priority),
        search: clearSearch ? null : (search ?? this.search),
        page: page ?? this.page,
      );
}

class TaskState {
  final List<TaskModel> tasks;
  final PaginationMeta? pagination;
  final bool isLoading;
  final bool isRefreshing;
  final String? error;
  final TaskFilters filters;

  const TaskState({
    this.tasks = const [],
    this.pagination,
    this.isLoading = false,
    this.isRefreshing = false,
    this.error,
    this.filters = const TaskFilters(),
  });

  TaskState copyWith({
    List<TaskModel>? tasks,
    PaginationMeta? pagination,
    bool? isLoading,
    bool? isRefreshing,
    String? error,
    TaskFilters? filters,
  }) =>
      TaskState(
        tasks: tasks ?? this.tasks,
        pagination: pagination ?? this.pagination,
        isLoading: isLoading ?? this.isLoading,
        isRefreshing: isRefreshing ?? this.isRefreshing,
        error: error,
        filters: filters ?? this.filters,
      );
}

class TaskNotifier extends StateNotifier<TaskState> {
  final TaskRepository _repo;

  TaskNotifier(this._repo) : super(const TaskState());

  Future<void> loadTasks({bool refresh = false}) async {
    if (refresh) {
      state = state.copyWith(isRefreshing: true, error: null);
    } else {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final result = await _repo.getTasks(
        page: state.filters.page,
        status: state.filters.status,
        priority: state.filters.priority,
        search: state.filters.search,
      );

      state = state.copyWith(
        tasks: result['tasks'] as List<TaskModel>,
        pagination: result['pagination'] as PaginationMeta,
        isLoading: false,
        isRefreshing: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isRefreshing: false,
        error: _parseError(e),
      );
    }
  }

  Future<void> createTask({
    required String title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) async {
    await _repo.createTask(
      title: title,
      description: description,
      status: status,
      priority: priority,
      dueDate: dueDate,
    );
    await loadTasks(refresh: true);
  }

  Future<void> updateTask({
    required String id,
    String? title,
    String? description,
    String? status,
    String? priority,
    String? dueDate,
  }) async {
    final task = await _repo.updateTask(
      id: id,
      title: title,
      description: description,
      status: status,
      priority: priority,
      dueDate: dueDate,
    );
    state = state.copyWith(
      tasks: state.tasks.map((t) => t.id == id ? task : t).toList(),
    );
  }

  Future<void> deleteTask(String id) async {
    await _repo.deleteTask(id);
    state = state.copyWith(
      tasks: state.tasks.where((t) => t.id != id).toList(),
    );
  }

  Future<void> toggleTask(String id) async {
    final task = await _repo.toggleTask(id);
    state = state.copyWith(
      tasks: state.tasks.map((t) => t.id == id ? task : t).toList(),
    );
  }

  void applyFilters(TaskFilters filters) {
    state = state.copyWith(filters: filters);
    loadTasks();
  }

  void goToPage(int page) {
    state = state.copyWith(filters: state.filters.copyWith(page: page));
    loadTasks();
  }

  String _parseError(dynamic e) {
    try {
      final data = (e as dynamic).response?.data;
      return data?['message'] as String? ?? 'Something went wrong';
    } catch (_) {
      return 'Something went wrong';
    }
  }
}

final taskProvider = StateNotifierProvider<TaskNotifier, TaskState>((ref) {
  return TaskNotifier(ref.watch(taskRepositoryProvider));
});
