# TaskManagerApp

A modern task management application built with React Native and Expo, featuring a clean and intuitive interface for managing tasks across different views.

[View on GitHub](https://github.com/enikfar/TaskManagerApp)

## Features

- **Task Management**
  - Create, edit, and delete tasks
  - Set task priority (High, Medium, Low)
  - Track task status (Pending, In Progress, Completed)
  - Add due dates and descriptions
  - Search and filter tasks

- **Multiple Views**
  - List View: Comprehensive task list with filtering and sorting
  - Calendar View: Visual representation of tasks by date
  - Task details popup when tapping tasks in calendar view

- **User Experience**
  - Smooth animations and transitions
  - Intuitive task status updates
  - Priority indicators with color coding
  - Responsive design for various screen sizes

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/enikfar/TaskManagerApp.git
cd TaskManagerApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run the app:
- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
TaskManagerApp/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── screens/        # Main application screens
│   └── types/          # TypeScript type definitions
├── App.tsx             # Main application component
└── package.json        # Project dependencies
```

## Third-Party Libraries

- **React Native Paper**: UI component library providing Material Design components
- **date-fns**: Date manipulation and formatting utilities
- **React Navigation**: Navigation and routing solution
- **Expo**: Development platform for React Native applications
- **React Native Calendar**: Calendar component for task scheduling

## Usage Instructions

1. **Creating a Task**
   - Tap the "+" button in the bottom right corner
   - Fill in task details (name, description, priority, due date)
   - Tap "Add Task" to save

2. **Editing a Task**
   - In List View: Tap the pencil icon on any task
   - In Calendar View: Tap a task to view details, then tap "Edit"
   - Modify task details and tap "Update" to save changes

3. **Managing Task Status**
   - Tap the status icon on any task to cycle through statuses
   - Statuses: Pending → In Progress → Completed

4. **Searching and Filtering**
   - Use the search bar to find tasks by name or description
   - Use the filter buttons to show tasks by status

5. **Calendar View**
   - Tap on dates to view tasks for that day
   - Tap on tasks to view full details
   - Color-coded priority indicators show task importance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community for the amazing framework
- Expo team for the development platform
- All contributors and maintainers of the third-party libraries used 