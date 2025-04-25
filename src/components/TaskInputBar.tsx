import React, { useState, useCallback, memo, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { 
  TextInput, 
  Button, 
  Menu, 
  useTheme,
  TouchableRipple
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// Enums
enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

interface TaskInputBarProps {
  onAddTask: (task: {
    name: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
  }) => void;
}

// Priority Selector Component
const PrioritySelector = memo(({ priority, setPriority, handleDismissKeyboard, getPriorityColor }: any) => {
  console.log('PrioritySelector rendered');
  return (
    <View style={styles.priorityContainer}>
      {Object.values(TaskPriority).map((priorityValue) => (
        <TouchableRipple
          key={priorityValue}
          onPress={() => {
            console.log('Priority dot pressed:', priorityValue);
            handleDismissKeyboard();
            setPriority(priorityValue);
          }}
          style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(priorityValue) },
            priority === priorityValue && styles.selectedPriority
          ]}
        >
          <View style={styles.priorityDotInner} />
        </TouchableRipple>
      ))}
    </View>
  );
});

// Main Component
const TaskInputBar: React.FC<TaskInputBarProps> = memo(({ onAddTask }) => {
  console.log('TaskInputBar rendered');
  
  const theme = useTheme();
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Track state changes
  useEffect(() => {
    console.log('TaskName changed:', taskName);
  }, [taskName]);

  useEffect(() => {
    console.log('Status changed:', status);
  }, [status]);

  useEffect(() => {
    console.log('Priority changed:', priority);
  }, [priority]);

  useEffect(() => {
    console.log('DueDate changed:', dueDate);
  }, [dueDate]);

  useEffect(() => {
    console.log('ShowStatusMenu changed:', showStatusMenu);
  }, [showStatusMenu]);

  useEffect(() => {
    console.log('ShowDatePicker changed:', showDatePicker);
  }, [showDatePicker]);

  const inputTheme = useMemo(() => {
    console.log('InputTheme recalculated');
    return {
      colors: { primary: theme.colors.primary }
    };
  }, [theme.colors.primary]);

  const getPriorityColor = useCallback((priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return '#FF4444';
      case TaskPriority.MEDIUM: return '#FFBB33';
      case TaskPriority.LOW: return '#00C851';
      default: return '#FFFFFF';
    }
  }, []);

  const handleAddTask = useCallback(() => {
    console.log('handleAddTask called');
    if (taskName.trim()) {
      onAddTask({ name: taskName, status, priority, dueDate });
      setTaskName('');
      setStatus(TaskStatus.TODO);
      setPriority(TaskPriority.MEDIUM);
      setDueDate(new Date());
    }
  }, [taskName, status, priority, dueDate, onAddTask]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    console.log('Keyboard dismissed');
    Keyboard.dismiss();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          mode="outlined"
          label="Task Name"
          value={taskName}
          onChangeText={(text) => {
            console.log('TaskName input changed:', text);
            setTaskName(text);
          }}
          style={styles.input}
          theme={inputTheme}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.controlsContainer}>
          <Menu
            visible={showStatusMenu}
            onDismiss={() => {
              console.log('Status menu dismissed');
              setShowStatusMenu(false);
            }}
            anchor={
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('Status button pressed');
                  handleDismissKeyboard();
                  setShowStatusMenu(true);
                }}
                style={styles.statusButton}
              >
                {status}
              </Button>
            }
          >
            {Object.values(TaskStatus).map((statusValue) => (
              <Menu.Item
                key={statusValue}
                onPress={() => {
                  console.log('Status selected:', statusValue);
                  setStatus(statusValue);
                  setShowStatusMenu(false);
                }}
                title={statusValue}
              />
            ))}
          </Menu>

          <PrioritySelector 
            priority={priority}
            setPriority={setPriority}
            handleDismissKeyboard={handleDismissKeyboard}
            getPriorityColor={getPriorityColor}
          />

          <Button
            mode="outlined"
            onPress={() => {
              console.log('Date button pressed');
              handleDismissKeyboard();
              setShowDatePicker(true);
            }}
            style={styles.dateButton}
          >
            {formatDate(dueDate)}
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            console.log('Add Task button pressed');
            handleAddTask();
          }}
          style={styles.addButton}
          disabled={!taskName.trim()}
        >
          Add Task
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              console.log('Date changed:', date);
              setShowDatePicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 4,
    position: 'relative',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'nowrap',
  },
  statusButton: {
    flex: 1,
    marginRight: 8,
    minWidth: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 1,
  },
  priorityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  dateButton: {
    flex: 1,
    minWidth: 100,
  },
  addButton: {
    marginTop: 8,
  },
  priorityDotInner: {
    width: '100%',
    height: '100%',
  },
});

export default TaskInputBar;
