import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:taskflow/core/constants/app_theme.dart';
import 'package:taskflow/features/auth/presentation/providers/auth_provider.dart';
import 'package:taskflow/features/tasks/data/models/task_model.dart';
import 'package:taskflow/features/tasks/presentation/providers/task_provider.dart';
import 'package:taskflow/features/tasks/presentation/widgets/task_card.dart';
import 'package:taskflow/features/tasks/presentation/widgets/task_form_sheet.dart';

class DashboardPage extends ConsumerStatefulWidget {
  const DashboardPage({super.key});

  @override
  ConsumerState<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends ConsumerState<DashboardPage> {
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(taskProvider.notifier).loadTasks();
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _showTaskForm([TaskModel? task]) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => TaskFormSheet(
        task: task,
        onSubmit: ({
          required String title,
          String? description,
          String? status,
          String? priority,
          String? dueDate,
        }) async {
          final notifier = ref.read(taskProvider.notifier);
          if (task == null) {
            await notifier.createTask(
              title: title,
              description: description,
              status: status,
              priority: priority,
              dueDate: dueDate,
            );
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text('Task created!'),
                backgroundColor: AppTheme.success,
              ));
            }
          } else {
            await notifier.updateTask(
              id: task.id,
              title: title,
              description: description,
              status: status,
              priority: priority,
              dueDate: dueDate,
            );
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text('Task updated!'),
                backgroundColor: AppTheme.success,
              ));
            }
          }
        },
      ),
    );
  }

  void _confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Delete Task'),
        content: const Text('Are you sure you want to delete this task?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await ref.read(taskProvider.notifier).deleteTask(id);
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Task deleted'),
                ));
              }
            },
            style: TextButton.styleFrom(foregroundColor: AppTheme.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(taskProvider);
    final user = ref.watch(authProvider).user;
    final filters = state.filters;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('TaskFlow'),
        actions: [
          IconButton(
            onPressed: () async {
              await ref.read(authProvider.notifier).logout();
              if (mounted) context.go('/login');
            },
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign out',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showTaskForm(),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('New Task',
            style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(taskProvider.notifier).loadTasks(refresh: true),
        color: AppTheme.primary,
        child: CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hi, ${user?.name.split(' ').first ?? 'there'} 👋',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.textSecondary,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text('My Tasks',
                        style: Theme.of(context).textTheme.displayMedium),
                    const SizedBox(height: 16),

                    // Stats row
                    if (state.pagination != null)
                      _StatsRow(tasks: state.tasks),
                    const SizedBox(height: 16),

                    // Search
                    TextField(
                      controller: _searchCtrl,
                      onChanged: (v) {
                        ref.read(taskProvider.notifier).applyFilters(
                              filters.copyWith(
                                  search: v.isEmpty ? null : v,
                                  clearSearch: v.isEmpty),
                            );
                      },
                      decoration: InputDecoration(
                        hintText: 'Search tasks...',
                        prefixIcon: const Icon(Icons.search_rounded,
                            color: AppTheme.textSecondary, size: 20),
                        suffixIcon: _searchCtrl.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.close_rounded,
                                    size: 18, color: AppTheme.textSecondary),
                                onPressed: () {
                                  _searchCtrl.clear();
                                  ref.read(taskProvider.notifier).applyFilters(
                                        filters.copyWith(clearSearch: true),
                                      );
                                },
                              )
                            : null,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Filter chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _FilterChip(
                            label: 'All',
                            selected: filters.status == null &&
                                filters.priority == null,
                            onTap: () => ref
                                .read(taskProvider.notifier)
                                .applyFilters(filters.copyWith(
                                    clearStatus: true, clearPriority: true)),
                          ),
                          const SizedBox(width: 8),
                          _FilterChip(
                            label: 'Pending',
                            selected: filters.status == 'PENDING',
                            color: AppTheme.pendingColor,
                            onTap: () => ref
                                .read(taskProvider.notifier)
                                .applyFilters(
                                    filters.copyWith(status: 'PENDING')),
                          ),
                          const SizedBox(width: 8),
                          _FilterChip(
                            label: 'In Progress',
                            selected: filters.status == 'IN_PROGRESS',
                            color: AppTheme.inProgressColor,
                            onTap: () => ref
                                .read(taskProvider.notifier)
                                .applyFilters(
                                    filters.copyWith(status: 'IN_PROGRESS')),
                          ),
                          const SizedBox(width: 8),
                          _FilterChip(
                            label: 'Completed',
                            selected: filters.status == 'COMPLETED',
                            color: AppTheme.completedColor,
                            onTap: () => ref
                                .read(taskProvider.notifier)
                                .applyFilters(
                                    filters.copyWith(status: 'COMPLETED')),
                          ),
                          const SizedBox(width: 8),
                          _FilterChip(
                            label: '🔴 High',
                            selected: filters.priority == 'HIGH',
                            onTap: () => ref
                                .read(taskProvider.notifier)
                                .applyFilters(
                                    filters.copyWith(priority: 'HIGH')),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),

            // Task list
            if (state.isLoading)
              const SliverFillRemaining(
                child: Center(
                    child: CircularProgressIndicator(color: AppTheme.primary)),
              )
            else if (state.error != null)
              SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline,
                          size: 48, color: AppTheme.error),
                      const SizedBox(height: 12),
                      Text(state.error!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () =>
                            ref.read(taskProvider.notifier).loadTasks(),
                        style: ElevatedButton.styleFrom(
                            minimumSize: const Size(120, 44)),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              )
            else if (state.tasks.isEmpty)
              SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryLight,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.check_box_rounded,
                            color: AppTheme.primary, size: 36),
                      ),
                      const SizedBox(height: 16),
                      Text('No tasks yet',
                          style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      Text('Tap + to create your first task',
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppTheme.textSecondary)),
                    ],
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final task = state.tasks[index];
                      return TaskCard(
                        task: task,
                        onToggle: () async {
                          await ref
                              .read(taskProvider.notifier)
                              .toggleTask(task.id);
                        },
                        onEdit: () => _showTaskForm(task),
                        onDelete: () => _confirmDelete(task.id),
                      );
                    },
                    childCount: state.tasks.length,
                  ),
                ),
              ),

            // Pagination
            if (state.pagination != null && state.pagination!.totalPages > 1)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        onPressed: state.pagination!.hasPrev
                            ? () => ref
                                .read(taskProvider.notifier)
                                .goToPage(state.pagination!.page - 1)
                            : null,
                        icon: const Icon(Icons.chevron_left_rounded),
                      ),
                      Text(
                          'Page ${state.pagination!.page} of ${state.pagination!.totalPages}',
                          style: Theme.of(context).textTheme.bodySmall),
                      IconButton(
                        onPressed: state.pagination!.hasNext
                            ? () => ref
                                .read(taskProvider.notifier)
                                .goToPage(state.pagination!.page + 1)
                            : null,
                        icon: const Icon(Icons.chevron_right_rounded),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final List<TaskModel> tasks;
  const _StatsRow({required this.tasks});

  @override
  Widget build(BuildContext context) {
    final pending = tasks.where((t) => t.status == 'PENDING').length;
    final inProgress = tasks.where((t) => t.status == 'IN_PROGRESS').length;
    final completed = tasks.where((t) => t.status == 'COMPLETED').length;

    return Row(
      children: [
        _StatCard(label: 'Pending', value: pending, color: AppTheme.pendingColor),
        const SizedBox(width: 8),
        _StatCard(label: 'In Progress', value: inProgress, color: AppTheme.inProgressColor),
        const SizedBox(width: 8),
        _StatCard(label: 'Done', value: completed, color: AppTheme.completedColor),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final int value;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.border),
        ),
        child: Column(
          children: [
            Text(value.toString(),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(color: color)),
            const SizedBox(height: 2),
            Text(label,
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final Color? color;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? (color ?? AppTheme.primary) : AppTheme.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: selected ? (color ?? AppTheme.primary) : AppTheme.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: selected ? Colors.white : AppTheme.textSecondary,
          ),
        ),
      ),
    );
  }
}
