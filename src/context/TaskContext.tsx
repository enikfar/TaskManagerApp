import React, { createContext, useContext, useReducer } from 'react';
import { Task, TaskStatus, TaskPriority } from '../hooks/useTasks';

interface TaskState {
  tasks: Task[];
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Omit<Task, 'id'>> } }
  | { type: 'DELETE_TASK'; payload: string };

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByDate: (date: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        dueDate: action.payload.dueDate.split('T')[0],
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { 
                ...task, 
                ...action.payload.updates,
                dueDate: action.payload.updates.dueDate 
                  ? action.payload.updates.dueDate.split('T')[0]
                  : task.dueDate
              }
            : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    default:
      return state;
  }
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

  const addTask = (task: Omit<Task, 'id'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const getTaskById = (id: string) => {
    return state.tasks.find(task => task.id === id);
  };

  const getTasksByDate = (date: string) => {
    return state.tasks.filter(task => task.dueDate === date);
  };

  const value = {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByDate,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 