import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:taskflow/core/constants/app_theme.dart';
import 'package:taskflow/features/tasks/data/models/task_model.dart';

class TaskCard extends StatelessWidget {
  final TaskModel task;
  final VoidCallback onToggle;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const TaskCard({
    super.key,
    required this.task,
    required this.onToggle,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final statusConfig = _statusConfig(task.status);
    final priorityConfig = _priorityConfig(task.priority);
    final isCompleted = task.status == 'COMPLETED';
    final isOverdue = task.dueDate != null &&
        !isCompleted &&
        DateTime.tryParse(task.dueDate!)?.isBefore(DateTime.now()) == true;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Toggle checkbox
                GestureDetector(
                  onTap: onToggle,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCompleted ? AppTheme.success : Colors.transparent,
                      border: Border.all(
                        color: isCompleted
                            ? AppTheme.success
                            : AppTheme.border,
                        width: 2,
                      ),
                    ),
                    child: isCompleted
                        ? const Icon(Icons.check_rounded,
                            color: Colors.white, size: 13)
                        : null,
                  ),
                ),
                const SizedBox(width: 12),

                // Title + description
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              decoration: isCompleted
                                  ? TextDecoration.lineThrough
                                  : null,
                              color: isCompleted
                                  ? AppTheme.textSecondary
                                  : AppTheme.textPrimary,
                            ),
                      ),
                      if (task.description != null &&
                          task.description!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          task.description!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppTheme.textSecondary),
                        ),
                      ],
                    ],
                  ),
                ),

                // Actions menu
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'edit') onEdit();
                    if (value == 'delete') onDelete();
                  },
                  icon: const Icon(Icons.more_vert_rounded,
                      color: AppTheme.textSecondary, size: 20),
                  itemBuilder: (_) => [
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(children: [
                        Icon(Icons.edit_outlined, size: 16),
                        SizedBox(width: 8),
                        Text('Edit'),
                      ]),
                    ),
                    PopupMenuItem(
                      value: 'delete',
                      child: Row(children: [
                        Icon(Icons.delete_outline,
                            size: 16, color: AppTheme.error),
                        const SizedBox(width: 8),
                        Text('Delete',
                            style: TextStyle(color: AppTheme.error)),
                      ]),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Badges row
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                // Status badge
                _Badge(
                  label: statusConfig['label'] as String,
                  color: statusConfig['color'] as Color,
                  bg: statusConfig['bg'] as Color,
                ),

                // Priority badge
                _Badge(
                  label: priorityConfig['label'] as String,
                  color: priorityConfig['color'] as Color,
                  bg: priorityConfig['bg'] as Color,
                  icon: Icons.flag_outlined,
                ),

                // Due date
                if (task.dueDate != null)
                  _Badge(
                    label: _formatDate(task.dueDate!),
                    color: isOverdue ? AppTheme.error : AppTheme.textSecondary,
                    bg: isOverdue
                        ? const Color(0xFFFEF2F2)
                        : const Color(0xFFF9FAFB),
                    icon: isOverdue
                        ? Icons.access_time_rounded
                        : Icons.calendar_today_outlined,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    final date = DateTime.tryParse(dateStr);
    if (date == null) return '';
    final now = DateTime.now();
    if (DateUtils.isSameDay(date, now)) return 'Today';
    if (DateUtils.isSameDay(date, now.add(const Duration(days: 1)))) {
      return 'Tomorrow';
    }
    return DateFormat('MMM d, yyyy').format(date);
  }

  Map<String, dynamic> _statusConfig(String status) {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          'label': 'In Progress',
          'color': AppTheme.inProgressColor,
          'bg': AppTheme.inProgressBg,
        };
      case 'COMPLETED':
        return {
          'label': 'Completed',
          'color': AppTheme.completedColor,
          'bg': AppTheme.completedBg,
        };
      default:
        return {
          'label': 'Pending',
          'color': AppTheme.pendingColor,
          'bg': AppTheme.pendingBg,
        };
    }
  }

  Map<String, dynamic> _priorityConfig(String priority) {
    switch (priority) {
      case 'HIGH':
        return {
          'label': 'High',
          'color': AppTheme.highColor,
          'bg': AppTheme.highBg,
        };
      case 'LOW':
        return {
          'label': 'Low',
          'color': AppTheme.lowColor,
          'bg': AppTheme.lowBg,
        };
      default:
        return {
          'label': 'Medium',
          'color': AppTheme.mediumColor,
          'bg': AppTheme.mediumBg,
        };
    }
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color color;
  final Color bg;
  final IconData? icon;

  const _Badge({
    required this.label,
    required this.color,
    required this.bg,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 11, color: color),
            const SizedBox(width: 4),
          ],
          Text(label,
              style: TextStyle(
                  fontSize: 11, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
