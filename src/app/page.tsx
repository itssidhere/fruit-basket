"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "./components/Layout";
import { GroupBySelect } from "./components/GroupBySelect";
import { Fruit, GroupByOption, JarFruit } from "./types/types";
import { FruitList } from "./components/FruitList";
import { Jar } from "./components/Jar";

import { CommandPalette } from "./components/CommandPalette";
import { LoadingState } from "./components/LoadingState";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { ThemeControls } from "./components/ThemeControls";
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
    },
  },
});

// Define prop and state types for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-8 bg-red-50 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-red-600 mb-4">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [initialHistory, setInitialHistory] = useState<JarFruit[][]>([[]]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [history, setHistory] = useState<JarFruit[][]>(initialHistory);
  const [historyIndex, setHistoryIndex] = useState(initialIndex);
  const [playAddSound] = useSound("/sounds/pop.wav", { volume: 0.5 });
  const [playRemoveSound] = useSound("/sounds/whoosh.wav", { volume: 0.5 });

  function getInitialState() {
    try {
      let savedHistory;
      let savedIndex;

      if (!savedHistory || !savedIndex) {
        return { history: [[]], index: 0 };
      }

      const parsedHistory = JSON.parse(savedHistory);
      const parsedIndex = parseInt(savedIndex);

      // Validate the parsed data
      if (
        !Array.isArray(parsedHistory) ||
        !parsedHistory.every(Array.isArray) ||
        typeof parsedIndex !== "number" ||
        parsedIndex < 0 ||
        parsedIndex >= parsedHistory.length
      ) {
        console.warn("Invalid saved state detected, resetting to default");
        return { history: [[]], index: 0 };
      }

      return {
        history: parsedHistory,
        index: parsedIndex,
      };
    } catch (error) {
      console.error("Error loading saved state:", error);
      return { history: [[]], index: 0 };
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const { history: initialHistory, index: initialIndex } = getInitialState();
    setInitialHistory(initialHistory);
    setInitialIndex(initialIndex);
  }, []);

  // Save to localStorage whenever history or historyIndex changes
  useEffect(() => {
    localStorage.setItem("jarHistory", JSON.stringify(history));
    localStorage.setItem("historyIndex", historyIndex.toString());
  }, [history, historyIndex]);

  // Current jar fruits are derived from history and historyIndex
  const jarFruits = history[historyIndex];

  const addToHistory = useCallback(
    (newJarFruits: JarFruit[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newJarFruits]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleAddToJar = useCallback(
    (fruit: Fruit) => {
      const newJarFruits = [
        ...jarFruits,
        { ...fruit, jarId: `${fruit.id}-${Date.now()}` },
      ];
      addToHistory(newJarFruits);
      playAddSound();
    },
    [jarFruits, addToHistory, playAddSound]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      playRemoveSound(); // Add sound effect for undo
    }
  }, [historyIndex, playRemoveSound]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      playAddSound(); // Add sound effect for redo
    }
  }, [historyIndex, history.length, playAddSound]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [undo, redo]);

  return (
    <ErrorBoundary>
      {isMounted && (
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" />
            <ThemeControls />

            <CommandPalette onAddToJar={handleAddToJar} />
            <FruitApp
              jarFruits={jarFruits}
              addToHistory={addToHistory}
              onAddToJar={handleAddToJar}
            />
          </QueryClientProvider>
        </ThemeProvider>
      )}
    </ErrorBoundary>
  );
}

interface FruitAppProps {
  jarFruits: JarFruit[];
  addToHistory: (newJarFruits: JarFruit[]) => void;
  onAddToJar: (fruit: Fruit) => void;
}

function FruitApp({ jarFruits, addToHistory, onAddToJar }: FruitAppProps) {
  const { themeColors } = useTheme();
  const [groupBy, setGroupBy] = useState<GroupByOption>("None");
  const [playRemoveSound] = useSound("/sounds/whoosh.wav", { volume: 0.5 });

  const fetchFruits = async () => {
    const response = await fetch("/api/fetch-fruits");
    return response.json();
  };
  // Query
  const {
    data: fruits,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const addAllFruitsInGroup = useCallback(
    (fruitsToAdd: Fruit[]) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      const newJarFruits = fruitsToAdd.map((fruit, index) => ({
        ...fruit,
        jarId: `${fruit.id}-${Date.now()}-${index}`,
      }));

      addToHistory([...jarFruits, ...newJarFruits]);
      toast.success(`Adding ${newJarFruits.length} fruits to jar! 🍯`, {
        duration: 2000,
      });
    },
    [jarFruits, addToHistory]
  );

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error loading fruits</div>;
  if (!fruits) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${themeColors.background} ${themeColors.text} relative`}
    >
      <Layout
        leftContent={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <GroupBySelect value={groupBy} onChange={setGroupBy} />
            </div>
            <FruitList
              fruits={fruits}
              groupBy={groupBy}
              onAddToJar={onAddToJar}
              onAddAllFruitsInGroup={addAllFruitsInGroup}
            />
          </div>
        }
        rightContent={
          <Jar
            fruits={jarFruits}
            onRemoveFromJar={(index) => {
              const newJarFruits = jarFruits.filter((_, i) => i !== index);
              addToHistory(newJarFruits);
              playRemoveSound();
            }}
            onRemoveAll={() => {
              addToHistory([]);
              playRemoveSound();
            }}
          />
        }
      />

      {/* Keyboard Shortcuts Helper */}
      <div className="fixed bottom-6 right-6 hidden md:flex flex-col items-end space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${themeColors.surface} border ${themeColors.border} 
                     rounded-lg shadow-lg p-4 backdrop-blur-sm`}
        >
          <div className="text-sm font-medium mb-2">Keyboard Shortcuts</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <kbd
                className={`px-2 py-1 ${themeColors.cardBg} rounded text-xs`}
              >
                ⌘/Ctrl + K
              </kbd>
              <span className={`text-sm ${themeColors.secondaryText}`}>
                Search
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <kbd
                className={`px-2 py-1 ${themeColors.cardBg} rounded text-xs`}
              >
                ⌘/Ctrl + Z
              </kbd>
              <span className={`text-sm ${themeColors.secondaryText}`}>
                Undo
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <kbd
                className={`px-2 py-1 ${themeColors.cardBg} rounded text-xs`}
              >
                ⌘/Ctrl + Y
              </kbd>
              <span className={`text-sm ${themeColors.secondaryText}`}>
                Redo
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
