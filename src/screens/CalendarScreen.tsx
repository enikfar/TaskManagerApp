import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import KeyboardDismissView from '../components/KeyboardDismissView';
import TaskDetailsModal from '../components/TaskDetailsModal';
import TaskCreationModal from '../components/TaskCreationModal';

const CalendarScreen = () => {
  const theme = useTheme();
  const { tasks, getTasksByDate, updateTask } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // State for modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    tasks.forEach(task => {
      marked[task.dueDate] = {
        marked: true,
        dotColor: theme.colors.primary,
      };
    });
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary,
    };
    return marked;
  };

  const handleTaskPress = (task: any) => {
    setSelectedTask(task);
    setDetailsModalVisible(true);
  };

  const handleEditTask = () => {
    setDetailsModalVisible(false);
    setEditModalVisible(true);
  };

  const handleUpdateTask = (taskId: string, updatedTask: any) => {
    updateTask(taskId, updatedTask);
    setEditModalVisible(false);
  };

  const themeConfig = {
    backgroundColor: '#1a1a1a',
    calendarBackground: '#1a1a1a',
    textSectionTitleColor: '#ffffff',
    selectedDayBackgroundColor: theme.colors.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: theme.colors.primary,
    dayTextColor: '#ffffff',
    textDisabledColor: '#666666',
    dotColor: theme.colors.primary,
    selectedDotColor: '#ffffff',
    arrowColor: theme.colors.primary,
    monthTextColor: '#ffffff',
    indicatorColor: theme.colors.primary,
  };

  const tasksForSelectedDate = getTasksByDate(selectedDate);

  return (
    <KeyboardDismissView style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={getMarkedDates()}
          theme={themeConfig}
          style={styles.calendar}
        />
      </View>
      <ScrollView style={styles.taskList}>
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map(task => (
            <TouchableOpacity key={task.id} onPress={() => handleTaskPress(task)}>
              <Card style={styles.taskCard}>
                <Card.Content>
                  <Text style={styles.taskTitle}>{task.name}</Text>
                  <Text style={styles.taskTime}>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</Text>
                  {task.priority && (
                    <View style={[styles.priorityIndicator, {
                      backgroundColor: 
                        task.priority === 'high' ? '#FF4444' : 
                        task.priority === 'medium' ? '#F59E0B' : '#10B981'
                    }]} />
                  )}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTasksText}>No tasks for this date</Text>
        )}
      </ScrollView>

      {/* Task Details Modal */}
      <TaskDetailsModal
        visible={detailsModalVisible}
        onDismiss={() => setDetailsModalVisible(false)}
        onEditTask={handleEditTask}
        task={selectedTask}
      />

      {/* Task Edit Modal */}
      <TaskCreationModal
        visible={editModalVisible}
        onDismiss={() => setEditModalVisible(false)}
        onAddTask={() => {}}
        onEditTask={handleUpdateTask}
        initialTask={selectedTask}
        isEditing={true}
      />
    </KeyboardDismissView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  calendarContainer: {
    padding: 16,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
  },
  taskList: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  taskTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: '#888888',
  },
  noTasksText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: '100%',
  },
});

export default CalendarScreen;
