import { Fruit, GroupByOption, JarFruit } from "../types/types";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { toast } from "react-hot-toast";
import { fruitEmojis } from "../constants/fruitEmojis";
import { useTheme } from "../contexts/ThemeContext";
import confetti from "canvas-confetti";

// Animation constants
const DRAG_SCALE = 1.1;
const DEFAULT_SCALE = 1;
const SPRING_TENSION = 300;
const SPRING_FRICTION = 20;
const DRAG_THRESHOLD = 100;
const DRAG_VERTICAL_THRESHOLD = -100;

// UI constants
const DRAGGING_Z_INDEX = 9999;
const DEFAULT_Z_INDEX = 1;
const DRAGGING_WIDTH = "300px";
const TOAST_DURATION = 1500;

const EXPAND_ANIMATION_DURATION = 0.3;
const HOVER_SCALE = 1.05;
const TAP_SCALE = 0.95;

export const FruitCard = ({
  fruit,
  onAddToJar,
}: {
  fruit: Fruit;
  onAddToJar: (fruit: JarFruit) => void;
}) => {
  const { themeColors } = useTheme();
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: DEFAULT_SCALE,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const addFruitToJar = () => {
    onAddToJar({ ...fruit, jarId: `${fruit.id}-${Date.now()}` });
    toast.success("Fruit added to jar! 🍯", { duration: TOAST_DURATION });
  };

  const bind = useDrag(({ down, movement: [mx, my], tap, event, first }) => {
    // Add check for button click
    if (
      event?.target instanceof Element &&
      (event.target.closest("button") || event.target.tagName === "BUTTON")
    ) {
      return;
    }

    event?.stopPropagation();

    if (first && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setStartPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });
    }

    setIsDragging(down);

    if (tap) {
      return;
    }

    api.start({
      x: down ? mx : 0,
      y: down ? my : 0,
      scale: down ? DRAG_SCALE : DEFAULT_SCALE,
      immediate: down,
      config: { tension: SPRING_TENSION, friction: SPRING_FRICTION },
    });

    if (
      !down &&
      (Math.abs(mx) > DRAG_THRESHOLD || my < DRAG_VERTICAL_THRESHOLD)
    ) {
      addFruitToJar();
      api.start({ x: 0, y: 0, scale: DEFAULT_SCALE });
    }
  });

  return (
    <div
      ref={cardRef}
      className="relative"
      style={{
        zIndex: isDragging ? DRAGGING_Z_INDEX : DEFAULT_Z_INDEX,
        position: isDragging ? "fixed" : "relative",
        pointerEvents: isDragging ? "none" : "auto",
        width: isDragging ? DRAGGING_WIDTH : "auto",
        left: isDragging ? `${startPosition.x}px` : "auto",
        top: isDragging ? `${startPosition.y}px` : "auto",
      }}
    >
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          scale,
          touchAction: "none",
        }}
        className={`${themeColors.surface} rounded-2xl p-6 shadow-lg hover:shadow-xl
                   transition-shadow duration-300 cursor-grab active:cursor-grabbing
                   border ${themeColors.border}`}
      >
        <div className="flex flex-col items-center space-y-3">
          <span className="text-4xl">
            {fruitEmojis[fruit.name] || fruitEmojis.default}
          </span>
          <h3 className={`text-lg font-semibold ${themeColors.text}`}>
            {fruit.name}
          </h3>
          <div
            className={`flex flex-col items-center text-sm ${themeColors.secondaryText} space-y-1`}
          >
            <div className="flex items-center space-x-2">
              <span>🔥</span>
              <span>{fruit.nutritions.calories} cal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🍯</span>
              <span>{fruit.nutritions.sugar}g sugar</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🥑</span>
              <span>{fruit.nutritions.fat}g fat</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: HOVER_SCALE }}
            whileTap={{ scale: TAP_SCALE }}
            onClick={(e) => {
              e.stopPropagation();
              addFruitToJar();
            }}
            className={`mt-4 bg-gradient-to-r ${themeColors.primary} 
                       ${themeColors.buttonText} p-2 rounded-full shadow-md hover:shadow-lg
                       transition-all duration-200`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.button>
        </div>
      </animated.div>
    </div>
  );
};

interface FruitListProps {
  fruits: Fruit[];
  groupBy: GroupByOption;
  onAddToJar: (fruit: JarFruit) => void;
  onAddAllFruitsInGroup: (fruits: Fruit[]) => void;
}

export function FruitList({
  fruits,
  groupBy,
  onAddToJar,
  onAddAllFruitsInGroup,
}: FruitListProps) {
  const { themeColors } = useTheme();
  const [viewMode, setViewMode] = useState<"card" | "list" | "table">("card");
  const groupedFruits = groupFruits(fruits, groupBy);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const addAllFruitsInGroup = (fruits: Fruit[]) => {
    onAddAllFruitsInGroup(fruits);

    console.log("Adding all fruits in group", fruits);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const renderFruitItem = (fruit: Fruit) => {
    switch (viewMode) {
      case "list":
        return (
          <div
            key={fruit.id}
            className={`flex items-center justify-between p-3 ${themeColors.surface} rounded-lg`}
          >
            <span className={themeColors.text}>
              {fruit.name} ({fruit.nutritions.calories} calories)
            </span>
            <motion.button
              whileHover={{ scale: HOVER_SCALE }}
              whileTap={{ scale: TAP_SCALE }}
              onClick={() =>
                onAddToJar({ ...fruit, jarId: `${fruit.id}-${Date.now()}` })
              }
              className={`bg-gradient-to-r ${themeColors.primary} ${themeColors.buttonText} p-2 rounded-full`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </motion.button>
          </div>
        );

      case "table":
        return (
          <tr key={fruit.id} className={`border-b ${themeColors.border}`}>
            <td className={`p-3 ${themeColors.text}`}>{fruit.name}</td>
            <td className={`p-3 ${themeColors.text}`}>{fruit.family}</td>
            <td className={`p-3 ${themeColors.text}`}>{fruit.order}</td>
            <td className={`p-3 ${themeColors.text}`}>{fruit.genus}</td>
            <td className={`p-3 ${themeColors.text}`}>
              {fruit.nutritions.calories}
            </td>
            <td className="p-3">
              <motion.button
                whileHover={{ scale: HOVER_SCALE }}
                whileTap={{ scale: TAP_SCALE }}
                onClick={() =>
                  onAddToJar({ ...fruit, jarId: `${fruit.id}-${Date.now()}` })
                }
                className={`bg-gradient-to-r ${themeColors.primary} ${themeColors.buttonText} p-2 rounded-full`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </motion.button>
            </td>
          </tr>
        );

      default:
        return (
          <FruitCard key={fruit.id} fruit={fruit} onAddToJar={onAddToJar} />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-4">
        {["card", "list", "table"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as typeof viewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === mode
                ? `bg-gradient-to-r ${themeColors.primary} ${themeColors.buttonText}`
                : `${themeColors.surface} ${themeColors.text}`
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {Object.entries(groupedFruits).map(([group, groupFruits]) => (
        <motion.div
          key={group}
          className={`${themeColors.surface} border ${themeColors.border} rounded-2xl shadow-sm`}
        >
          <div className="flex items-center justify-between p-5">
            <button
              onClick={() => toggleGroup(group)}
              className={`flex-1 flex items-center space-x-3 font-semibold ${themeColors.text} ${themeColors.surfaceHover} transition-colors duration-200`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{group}</span>
                <span
                  className={`text-sm ${themeColors.secondaryText} font-normal`}
                >
                  ({(groupFruits as Fruit[]).length} items)
                </span>
              </div>
              <motion.span
                animate={{ rotate: expandedGroups[group] ? 180 : 0 }}
                transition={{ duration: EXPAND_ANIMATION_DURATION }}
                className={themeColors.secondaryText}
              >
                ▼
              </motion.span>
            </button>

            <motion.button
              whileHover={{ scale: HOVER_SCALE }}
              whileTap={{ scale: TAP_SCALE }}
              onClick={(e) => {
                e.stopPropagation();
                addAllFruitsInGroup(groupFruits as Fruit[]);
              }}
              className={`ml-4 bg-gradient-to-r ${themeColors.primary} 
                         ${themeColors.buttonText} px-4 py-2 rounded-lg font-medium 
                         shadow-sm hover:shadow-md transition-all duration-200
                         flex items-center space-x-2`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add All</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {expandedGroups[group] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: EXPAND_ANIMATION_DURATION }}
                className="overflow-hidden"
              >
                {viewMode === "table" ? (
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className={themeColors.surface}>
                          <th className="p-3 text-left">Name</th>
                          <th className="p-3 text-left">Family</th>
                          <th className="p-3 text-left">Order</th>
                          <th className="p-3 text-left">Genus</th>
                          <th className="p-3 text-left">Calories</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(groupFruits as Fruit[]).map((fruit) =>
                          renderFruitItem(fruit)
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 p-4 ${
                      viewMode === "card"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }`}
                  >
                    {(groupFruits as Fruit[]).map((fruit) =>
                      renderFruitItem(fruit)
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function groupFruits(
  fruits: Fruit[],
  groupBy: GroupByOption
): Record<string, Fruit[]> {
  if (groupBy === "None") {
    return { "All Fruits": fruits };
  }

  return fruits.reduce((groups, fruit) => {
    const key = fruit[groupBy.toLowerCase() as keyof Fruit] as string;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(fruit);
    return groups;
  }, {} as Record<string, Fruit[]>);
}
