# 🍎 Fruit Explorer App

A modern, interactive React application for exploring and managing fruits, built with TypeScript and modern web technologies. This project demonstrates best practices in React development, state management, and user interface design.



## 🌟 Features

### Core Functionality
- **Dynamic Fruit List**: Browse fruits with detailed nutritional information
- **Flexible Grouping**: Group fruits by Family, Order, or Genus
- **Search**: Quick search for specific fruits
- **Interactive Jar**: Add and remove fruits with real-time calorie tracking
- **Dual View Options**: Toggle between Table and List views
- **Bulk Actions**: Add entire groups of fruits at once
- **Drag & Drop**: Intuitively drag fruits directly into your jar

### Technical Highlights
- **State Management**: Efficient state handling with React Query
- **Type Safety**: Full TypeScript implementation
- **Error Boundaries**: Graceful error handling throughout the application
- **Local Storage**: Persistent jar state across sessions
- **Undo/Redo**: Full history management for jar modifications

### User Experience
- **Command Palette**: Quick fruit search with ⌘/Ctrl + K
- **Keyboard Shortcuts**: 
  - ⌘/Ctrl + Z: Undo
  - ⌘/Ctrl + Y: Redo
- **Animations**: Smooth transitions using Framer Motion
- **Sound Effects**: Audio feedback for user actions
- **Toast Notifications**: User-friendly action confirmations
- **Theme Support**: Light and dark mode with customizable themes

## 🛠 Technology Stack

- **Core**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: 
  - TanStack Query (React Query) for server state
  - React Context for theme management
  - Local state with useState and useReducer
- **Styling**: 
  - Tailwind CSS
  - Emotion for styled components
- **Animation**: 
  - Framer Motion
  - Auto-animate
- **Data Fetching**: Axios
- **UI Components**:
  - Headless UI
  - React Hot Toast
- **Testing**: Jest and React Testing Library
- **Other Libraries**:
  - use-sound for audio effects
  - canvas-confetti for celebrations
  - recharts for data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/itssidhere/fruit-basket.git
cd fruit-basket
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build the production version:

```bash
npm run build
```

5. Run the tests:

```bash
npm run test
```

### 🏗 Project Structure

```
src/
  api/
  components/
  contexts/
  mocks/
  types/
```


## 💻 Usage

### Basic Navigation
1. **Browse Fruits**: Scroll through the left panel to view available fruits
2. **Group Fruits**: Use the "Group by" dropdown to organize fruits by Family, Order, or Genus
3. **Add to Jar**: Click the "+" button next to any fruit to add it to your jar
4. **View Jar Contents**: Check the right panel to see your collected fruits and total calories

### Advanced Features
1. **Quick Search**:
   - Press ⌘/Ctrl + K to open the command palette
   - Type to search for specific fruits
   - Use arrow keys to navigate results
   - Press Enter to add selected fruit to jar

2. **History Management**:
   - Undo: ⌘/Ctrl + Z
   - Redo: ⌘/Ctrl + Y
   - All actions in the jar are tracked and reversible

3. **Bulk Actions**:
   - When fruits are grouped, use the group header's "+" button to add all fruits in that group
   - Clear jar contents with the "Clear All" button

4. **Theme Switching**:
   - Toggle between light and dark modes
   - Theme preference is saved across sessions





