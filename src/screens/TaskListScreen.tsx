import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Animated, LayoutAnimation, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { 
  List, 
  Text, 
  IconButton, 
  useTheme, 
  Portal, 
  Dialog, 
  Button, 
  TextInput,
  Menu,
  Chip,
  Surface,
  Divider,
  FAB,
  Searchbar,
  SegmentedButtons
} from 'react-native-paper';
import { Task, TaskStatus, TaskPriority } from '../hooks/useTasks';
import { format, parseISO } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import TaskCreationModal from '../components/TaskCreationModal';
import KeyboardDismissView from '../components/KeyboardDismissView';

const TaskListScreen = () => {
  const theme = useTheme();
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'all'>('all');

  const handleAddTask = (task: {
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => {
    addTask(task);
    setShowCreationModal(false);
  };

  const handleUpdateTask = (taskId: string, updatedTask: {
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => {
    updateTask(taskId, updatedTask);
    setShowCreationModal(false);
    setIsEditing(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (task: Task) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newStatus: TaskStatus;
    switch (task.status) {
      case TaskStatus.PENDING:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.COMPLETED;
        break;
      case TaskStatus.COMPLETED:
        newStatus = TaskStatus.PENDING;
        break;
      default:
        newStatus = TaskStatus.PENDING;
    }
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = (taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteTask(taskId);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setShowCreationModal(true);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'checkbox-blank-circle-outline';
      case TaskStatus.IN_PROGRESS:
        return 'progress-clock';
      case TaskStatus.COMPLETED:
        return 'checkbox-marked-circle';
      default:
        return 'checkbox-blank-circle-outline';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return theme.colors.error;
      case TaskPriority.MEDIUM:
        return '#F59E0B';
      case TaskPriority.LOW:
        return '#10B981';
      default:
        return theme.colors.outline;
    }
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchQuery === '' || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, selectedFilter]);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status === TaskStatus.COMPLETED && b.status !== TaskStatus.COMPLETED) return 1;
    if (a.status !== TaskStatus.COMPLETED && b.status === TaskStatus.COMPLETED) return -1;
    const priorityOrder = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleModalDismiss = () => {
    setShowCreationModal(false);
    setIsEditing(false);
    setSelectedTask(null);
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedTask(null);
    setShowCreationModal(true);
  };

  return (
    <KeyboardDismissView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={(value) => setSelectedFilter(value as TaskStatus | 'all')}
          buttons={[
            { value: 'all', label: 'All' },
            { value: TaskStatus.PENDING, label: 'Pending' },
            { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
            { value: TaskStatus.COMPLETED, label: 'Completed' },
          ]}
          style={styles.filterButtons}
        />
      </View>

      <ScrollView style={styles.taskList}>
        <List.Section>
          {sortedTasks.map((task) => (
            <Animated.View key={task.id}>
              <List.Item
                title={task.name}
                description={
                  <View>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    <Text style={styles.taskDueDate}>
                      Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                    </Text>
                  </View>
                }
                left={props => (
                  <View style={styles.leftContent}>
                    <IconButton
                      {...props}
                      icon={getStatusIcon(task.status)}
                      iconColor={theme.colors.primary}
                      onPress={() => handleStatusChange(task)}
                    />
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                  </View>
                )}
                right={props => (
                  <View style={styles.rightContent}>
                    <IconButton
                      {...props}
                      icon="pencil"
                      iconColor={theme.colors.primary}
                      onPress={() => handleEdit(task)}
                    />
                    <IconButton
                      {...props}
                      icon="delete"
                      iconColor={theme.colors.error}
                      onPress={() => handleDelete(task.id)}
                    />
                  </View>
                )}
                style={[
                  styles.taskItem,
                  task.status === TaskStatus.COMPLETED && styles.completedTask
                ]}
                titleStyle={task.status === TaskStatus.COMPLETED ? styles.completedText : undefined}
              />
            </Animated.View>
          ))}
        </List.Section>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleOpenCreateModal}
      />

      <TaskCreationModal
        visible={showCreationModal}
        onDismiss={handleModalDismiss}
        onAddTask={handleAddTask}
        onEditTask={handleUpdateTask}
        initialTask={selectedTask}
        isEditing={isEditing}
      />
    </KeyboardDismissView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchBar: {
    backgroundColor: '#334155',
    marginBottom: 12,
  },
  filterButtons: {
    marginBottom: 8,
  },
  taskList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  taskItem: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  completedTask: {
    opacity: 0.7,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#666666',
  },
  editInput: {
    marginBottom: 8,
  },
});

export default TaskListScreen;
