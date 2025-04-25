import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import { 
  Dialog, 
  TextInput,
  Menu,
  Chip,
  Surface,
  Portal
} from 'react-native-paper';
import { TaskStatus, TaskPriority } from '../hooks/useTasks';
import { format } from 'date-fns';
import { Calendar, DateData } from 'react-native-calendars';

interface TaskCreationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddTask: (task: {
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => void;
  onEditTask?: (taskId: string, updatedTask: {
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => void;
  initialTask?: {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  };
  isEditing?: boolean;
}

interface NameInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

class NameInput extends PureComponent<NameInputProps> {
  state = {
    localValue: this.props.value
  };

  componentDidUpdate(prevProps: NameInputProps) {
    // Only update local state if the prop value has changed externally
    if (prevProps.value !== this.props.value && this.props.value !== this.state.localValue) {
      this.setState({ localValue: this.props.value });
    }
  }

  handleChangeText = (text: string) => {
    console.log('Name input changed:', text);
    this.setState({ localValue: text }, () => {
      // Only notify parent when we're done typing (debounce)
      this.notifyParentAfterDelay(text);
    });
  };

  // Use debounce to reduce number of parent updates
  notifyParentTimeout: NodeJS.Timeout | null = null;
  notifyParentAfterDelay(text: string) {
    if (this.notifyParentTimeout) {
      clearTimeout(this.notifyParentTimeout);
    }
    this.notifyParentTimeout = setTimeout(() => {
      this.props.onChangeText(text);
    }, 300); // 300ms debounce
  }

  render() {
    console.log('NameInput rendered');
    return (
      <TextInput
        mode="outlined"
        label="Task Name"
        value={this.state.localValue}
        onChangeText={this.handleChangeText}
        style={styles.input}
      />
    );
  }
}

interface DescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

class DescriptionInput extends PureComponent<DescriptionInputProps> {
  state = {
    localValue: this.props.value
  };

  componentDidUpdate(prevProps: DescriptionInputProps) {
    // Only update local state if the prop value has changed externally
    if (prevProps.value !== this.props.value && this.props.value !== this.state.localValue) {
      this.setState({ localValue: this.props.value });
    }
  }

  handleChangeText = (text: string) => {
    console.log('Description input changed:', text);
    this.setState({ localValue: text }, () => {
      // Only notify parent when we're done typing (debounce)
      this.notifyParentAfterDelay(text);
    });
  };

  // Use debounce to reduce number of parent updates
  notifyParentTimeout: NodeJS.Timeout | null = null;
  notifyParentAfterDelay(text: string) {
    if (this.notifyParentTimeout) {
      clearTimeout(this.notifyParentTimeout);
    }
    this.notifyParentTimeout = setTimeout(() => {
      this.props.onChangeText(text);
    }, 300); // 300ms debounce
  }

  render() {
    console.log('DescriptionInput rendered');
    return (
      <TextInput
        mode="outlined"
        label="Description"
        value={this.state.localValue}
        onChangeText={this.handleChangeText}
        style={styles.descriptionInput}
        placeholder="Enter a brief description..."
        multiline
        numberOfLines={2}
      />
    );
  }
}

interface StatusSelectorProps {
  status: TaskStatus;
  showMenu: boolean;
  onStatusChange: (status: TaskStatus) => void;
  onShowMenuChange: (show: boolean) => void;
}

class StatusSelector extends PureComponent<StatusSelectorProps> {
  getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING: return 'checkbox-blank-circle-outline';
      case TaskStatus.IN_PROGRESS: return 'progress-clock';
      case TaskStatus.COMPLETED: return 'checkbox-marked-circle';
      default: return 'checkbox-blank-circle-outline';
    }
  };

  render() {
    console.log('StatusSelector rendered');
    return (
      <Menu
        visible={this.props.showMenu}
        onDismiss={() => {
          console.log('Status menu dismissed');
          this.props.onShowMenuChange(false);
        }}
        anchor={
          <Chip
            onPress={() => {
              console.log('Status chip pressed');
              Keyboard.dismiss();
              this.props.onShowMenuChange(true);
            }}
            style={styles.selectorChip}
            icon={this.getStatusIcon(this.props.status)}
          >
            {this.props.status}
          </Chip>
        }
      >
        {Object.values(TaskStatus).map((statusValue) => (
          <Menu.Item
            key={statusValue}
            onPress={() => {
              console.log('Status selected:', statusValue);
              this.props.onStatusChange(statusValue);
              this.props.onShowMenuChange(false);
            }}
            title={statusValue}
          />
        ))}
      </Menu>
    );
  }
}

interface PrioritySelectorProps {
  priority: TaskPriority;
  showMenu: boolean;
  onPriorityChange: (priority: TaskPriority) => void;
  onShowMenuChange: (show: boolean) => void;
  themeColors: {
    error: string;
    outline: string;
  };
}

class PrioritySelector extends PureComponent<PrioritySelectorProps> {
  getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH: return this.props.themeColors.error;
      case TaskPriority.MEDIUM: return '#F59E0B';
      case TaskPriority.LOW: return '#10B981';
      default: return this.props.themeColors.outline;
    }
  };

  render() {
    console.log('PrioritySelector rendered');
    return (
      <Menu
        visible={this.props.showMenu}
        onDismiss={() => {
          console.log('Priority menu dismissed');
          this.props.onShowMenuChange(false);
        }}
        anchor={
          <Chip
            onPress={() => {
              console.log('Priority chip pressed');
              Keyboard.dismiss();
              this.props.onShowMenuChange(true);
            }}
            style={styles.selectorChip}
            icon="circle"
            selectedColor={this.getPriorityColor(this.props.priority)}
          >
            {this.props.priority}
          </Chip>
        }
      >
        {Object.values(TaskPriority).map((priorityValue) => (
          <Menu.Item
            key={priorityValue}
            onPress={() => {
              console.log('Priority selected:', priorityValue);
              this.props.onPriorityChange(priorityValue);
              this.props.onShowMenuChange(false);
            }}
            title={priorityValue}
          />
        ))}
      </Menu>
    );
  }
}

interface DateSelectorProps {
  dueDate: Date;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onDateSelect: (date: string) => void;
  themeColors: {
    primary: string;
  };
}

class DateSelector extends PureComponent<DateSelectorProps> {
  render() {
    console.log('DateSelector rendered');
    return (
      <>
        <TouchableOpacity onPress={() => {
          console.log('Calendar button pressed');
          Keyboard.dismiss();
          this.props.onToggleCalendar();
        }}>
          <Chip
            style={styles.selectorChip}
            icon="calendar"
          >
            {format(this.props.dueDate, 'MMM d, yyyy')}
          </Chip>
        </TouchableOpacity>
        
        {this.props.showCalendar && (
          <Surface style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day: DateData) => {
                this.props.onDateSelect(day.dateString);
              }}
              current={format(this.props.dueDate, 'yyyy-MM-dd')}
              markedDates={{
                [format(this.props.dueDate, 'yyyy-MM-dd')]: {
                  selected: true,
                  selectedColor: this.props.themeColors.primary,
                }
              }}
              theme={{
                backgroundColor: '#1a1a1a',
                calendarBackground: '#1a1a1a',
                textSectionTitleColor: '#ffffff',
                selectedDayBackgroundColor: this.props.themeColors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: this.props.themeColors.primary,
                dayTextColor: '#ffffff',
                textDisabledColor: '#666666',
                dotColor: this.props.themeColors.primary,
                selectedDotColor: '#ffffff',
                arrowColor: this.props.themeColors.primary,
                monthTextColor: '#ffffff',
                indicatorColor: this.props.themeColors.primary,
              }}
              style={styles.calendar}
            />
          </Surface>
        )}
      </>
    );
  }
}

interface TaskCreationModalState {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  showStatusMenu: boolean;
  showPriorityMenu: boolean;
  showCalendar: boolean;
}

class TaskCreationModal extends Component<TaskCreationModalProps, TaskCreationModalState> {
  themeColors = {
    primary: '#007bff',
    error: '#FF4444',
    outline: '#777777',
  };

  constructor(props: TaskCreationModalProps) {
    super(props);
    this.state = {
      name: props.initialTask?.name || '',
      description: props.initialTask?.description || '',
      status: props.initialTask?.status || TaskStatus.PENDING,
      priority: props.initialTask?.priority || TaskPriority.MEDIUM,
      dueDate: props.initialTask ? new Date(props.initialTask.dueDate) : new Date(),
      showStatusMenu: false,
      showPriorityMenu: false,
      showCalendar: false,
    };
  }

  componentDidUpdate(prevProps: TaskCreationModalProps) {
    // When modal becomes visible and it wasn't visible before, initialize the state with task data
    if (this.props.visible && !prevProps.visible) {
      if (this.props.isEditing && this.props.initialTask) {
        this.setState({
          name: this.props.initialTask.name || '',
          description: this.props.initialTask.description || '',
          status: this.props.initialTask.status || TaskStatus.PENDING,
          priority: this.props.initialTask.priority || TaskPriority.MEDIUM,
          dueDate: new Date(this.props.initialTask.dueDate),
        });
      } else if (!this.props.isEditing) {
        // Reset form when opening in create mode
        this.setState({
          name: '',
          description: '',
          status: TaskStatus.PENDING,
          priority: TaskPriority.MEDIUM,
          dueDate: new Date(),
        });
      }
    }
  }

  handleNameChange = (text: string) => {
    // This now only gets called after typing has paused (debounced)
    console.log('Parent received name change:', text);
    this.setState({ name: text });
  };

  handleDescriptionChange = (text: string) => {
    // This now only gets called after typing has paused (debounced)
    console.log('Parent received description change:', text);
    this.setState({ description: text });
  };

  handleStatusChange = (status: TaskStatus) => {
    console.log('Status changed:', status);
    this.setState({ status });
  };

  handlePriorityChange = (priority: TaskPriority) => {
    console.log('Priority changed:', priority);
    this.setState({ priority });
  };

  handleToggleCalendar = () => {
    console.log('toggleCalendar called');
    this.setState(prevState => ({ showCalendar: !prevState.showCalendar }));
  };

  handleDateSelect = (dateString: string) => {
    console.log('handleDateSelect called with:', dateString);
    this.setState({
      dueDate: new Date(dateString),
      showCalendar: false,
    });
  };

  handleKeyboardDismiss = () => {
    console.log('Keyboard dismissed');
    Keyboard.dismiss();
  };

  handleAddTask = () => {
    console.log('Add Task button pressed');
    Keyboard.dismiss();
    if (this.state.name.trim()) {
      if (this.props.isEditing) {
        this.props.onEditTask?.(this.props.initialTask!.id, {
          name: this.state.name.trim(),
          description: this.state.description.trim(),
          status: this.state.status,
          priority: this.state.priority,
          dueDate: this.state.dueDate.toISOString().split('T')[0],
        });
      } else {
        this.props.onAddTask({
          name: this.state.name.trim(),
          description: this.state.description.trim(),
          status: this.state.status,
          priority: this.state.priority,
          dueDate: this.state.dueDate.toISOString().split('T')[0],
        });
      }
      this.setState({
        name: '',
        description: '',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
      });
      this.props.onDismiss();
    }
  };

  handleCancel = () => {
    console.log('Cancel button pressed');
    Keyboard.dismiss();
    // Reset all form fields when canceling
    this.setState({
      name: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(),
      showStatusMenu: false,
      showPriorityMenu: false,
      showCalendar: false,
    });
    this.props.onDismiss();
  };

  render() {
    console.log('TaskCreationModal rendered');
    const modalTitle = this.props.isEditing ? 'Edit Task' : 'New Task';

    return (
      <Portal>
        <Dialog 
          visible={this.props.visible} 
          onDismiss={() => {
            console.log('Dialog dismiss triggered');
            Keyboard.dismiss();
            this.props.onDismiss();
          }}
          style={styles.dialog}
        >
          <TouchableWithoutFeedback onPress={this.handleKeyboardDismiss}>
            <View>
              <Dialog.Title>{modalTitle}</Dialog.Title>
              <Dialog.Content style={styles.dialogContent}>
                <NameInput
                  value={this.state.name}
                  onChangeText={this.handleNameChange}
                />
                
                <DescriptionInput
                  value={this.state.description}
                  onChangeText={this.handleDescriptionChange}
                />

                <View style={styles.selectorsContainer}>
                  <StatusSelector
                    status={this.state.status}
                    showMenu={this.state.showStatusMenu}
                    onStatusChange={this.handleStatusChange}
                    onShowMenuChange={(show) => this.setState({ showStatusMenu: show })}
                  />

                  <PrioritySelector
                    priority={this.state.priority}
                    showMenu={this.state.showPriorityMenu}
                    onPriorityChange={this.handlePriorityChange}
                    onShowMenuChange={(show) => this.setState({ showPriorityMenu: show })}
                    themeColors={this.themeColors}
                  />

                  <DateSelector
                    dueDate={this.state.dueDate}
                    showCalendar={this.state.showCalendar}
                    onToggleCalendar={this.handleToggleCalendar}
                    onDateSelect={this.handleDateSelect}
                    themeColors={this.themeColors}
                  />
                </View>
              </Dialog.Content>
              
              <View style={styles.dialogActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={this.handleCancel}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.addButton]}
                  onPress={this.handleAddTask}
                >
                  <Text style={styles.buttonText}>
                    {this.props.isEditing ? 'Update' : 'Add Task'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    margin: 20,
    maxHeight: '90%',
  },
  dialogContent: {
    paddingBottom: 8,
  },
  dialogActions: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    marginBottom: 8,
  },
  descriptionInput: {
    marginBottom: 8,
    maxHeight: 80,
  },
  selectorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectorChip: {
    backgroundColor: '#2a2a2a',
  },
  calendarContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 8,
  },
  actionButton: {
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#333333',
  },
  addButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TaskCreationModal; 