import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Surface } from 'react-native-paper';
import { TaskStatus, TaskPriority } from '../hooks/useTasks';
import { format } from 'date-fns';

interface TaskDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onEditTask: () => void;
  task: {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  } | null;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  onDismiss,
  onEditTask,
  task
}) => {
  if (!task) return null;

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return '#FF4444';
      case TaskPriority.MEDIUM: return '#F59E0B';
      case TaskPriority.LOW: return '#10B981';
      default: return '#777777';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING: return '#F59E0B';
      case TaskStatus.IN_PROGRESS: return '#0D6EFD';
      case TaskStatus.COMPLETED: return '#10B981';
      default: return '#777777';
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={styles.dialog}
      >
        <View style={styles.container}>
          <Dialog.Title style={styles.title}>{task.name}</Dialog.Title>
          
          <View style={styles.metadataContainer}>
            <Surface style={[styles.badge, { backgroundColor: getStatusColor(task.status) }]}>
              <Text style={styles.badgeText}>{task.status}</Text>
            </Surface>
            
            <Surface style={[styles.badge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <Text style={styles.badgeText}>{task.priority} Priority</Text>
            </Surface>
            
            <Surface style={styles.dueDateBadge}>
              <Text style={styles.dueDateText}>
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </Text>
            </Surface>
          </View>
          
          <Dialog.Content>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>
                {task.description || 'No description provided.'}
              </Text>
            </View>
          </Dialog.Content>
          
          <Dialog.Actions style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={onDismiss}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={onEditTask}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    margin: 20,
  },
  container: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  badge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dueDateBadge: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dueDateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  button: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#333',
  },
  editButton: {
    backgroundColor: '#0D6EFD',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default TaskDetailsModal; 