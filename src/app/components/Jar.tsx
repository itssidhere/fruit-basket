import { JarFruit } from "../types/types";
import { useGesture } from "react-use-gesture";
import { animated, useSpring, useTransition } from "react-spring";
import { fruitEmojis } from "../constants/fruitEmojis";
import { PieChart } from "react-minimal-pie-chart";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import useSound from "use-sound";
import { calculateTotalNutrition } from "../utils/calculations";

interface JarProps {
  fruits: JarFruit[];
  onRemoveFromJar: (index: number) => void;
  onRemoveAll: () => void;
}

export function Jar({ fruits = [], onRemoveFromJar, onRemoveAll }: JarProps) {
  const { themeColors } = useTheme();
  const [playRemoveSound] = useSound("/sounds/whoosh.mp3", { volume: 0.5 });
  const [isJarSummaryVisible, setIsJarSummaryVisible] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsJarSummaryVisible(!isMobile);
  }, []);

  // Group fruits by name and count occurrences
  const groupedFruits = fruits.reduce<
    Record<string, { count: number; fruit: JarFruit }>
  >((acc, fruit) => {
    if (!acc[fruit.name]) {
      acc[fruit.name] = { count: 0, fruit };
    }
    acc[fruit.name].count++;
    return acc;
  }, {});

  // Convert to array for transitions
  const fruitEntries = Object.entries(groupedFruits);

  const transitions = useTransition(fruitEntries, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 80 },
    leave: { opacity: 0, height: 0 },
    keys: (item) => item[0],
  });

  const handleRemoveAll = useCallback(() => {
    onRemoveAll();
    playRemoveSound();
  }, [onRemoveAll, playRemoveSound]);

  const [{ scale, rotateY }, api] = useSpring(() => ({
    scale: 1,
    rotateY: 0,
    config: { tension: 300, friction: 20 },
  }));

  const bind = useGesture({
    onHover: ({ hovering }) => {
      api.start({
        scale: hovering ? 1.02 : 1,
        rotateY: hovering ? 5 : 0,
      });
    },
  });

  // Memoize callback functions
  const handleRemove = useCallback(
    (index: number) => {
      onRemoveFromJar(index);
      playRemoveSound();
    },
    [onRemoveFromJar, playRemoveSound]
  );

  // Memoize expensive calculations
  const memoizedNutrition = useMemo(
    () => calculateTotalNutrition(fruits),
    [fruits]
  );

  // Calculate fruit distribution for pie chart
  const fruitDistribution = Object.entries(
    fruits.reduce((acc, fruit) => {
      acc[fruit.name] = (acc[fruit.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count], index) => ({
    title: name,
    value: count,
    color: `hsl(${(index * 360) / fruits.length}, 70%, 60%)`,
  }));

  const [isPieChartVisible, setIsPieChartVisible] = useState(false);

  return (
    <animated.div
      {...bind()}
      style={{
        scale,
        rotateY,
        position: "relative",
        zIndex: 1,
        transform: "perspective(1000px)",
      }}
      className={`relative rounded-2xl overflow-hidden flex flex-col h-full
                 backdrop-blur-lg ${themeColors.surface} border ${themeColors.border}
                 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${themeColors.primary} opacity-5 z-0`}
      />
      <div className="relative z-1 flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-xl font-bold ${themeColors.text}`}>
              Fruit Jar
            </h2>
            {fruits.length > 0 && (
              <span
                className={`px-2 py-0.5 text-sm rounded-full 
                           bg-gradient-to-r ${themeColors.primary} 
                           ${themeColors.buttonText} font-medium`}
              >
                {fruits.length} {fruits.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          {fruits.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className={`px-3 py-1.5 text-red-500 hover:text-red-700 
                       hover:bg-red-50 rounded-lg transition-colors
                       focus:outline-none focus:ring-2 focus:ring-red-200`}
            >
              Remove All
            </button>
          )}
        </div>

        {fruits.length === 0 ? (
          <p className={themeColors.secondaryText}>
            The jar is feeling lonely! Drag some fruits over or click the +
            button to add them. 🍯✨
          </p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-2 custom-scrollbar">
              {transitions((style, [fruitName, fruitGroup]) => (
                <animated.div
                  style={style}
                  className="overflow-hidden group pt-1 pb-1"
                >
                  <div
                    className={`flex items-center justify-between p-3 border rounded-lg 
                             ${themeColors.cardBg} backdrop-blur-sm shadow-sm 
                             ${themeColors.cardHoverBg}
                             transition-all duration-300 ease-out
                             transform hover:-translate-y-0.5
                             group-hover:border-indigo-200`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className="text-2xl transform transition-transform duration-300 
                                      group-hover:scale-110 group-hover:rotate-12"
                      >
                        {fruitEmojis[fruitName] || fruitEmojis.default}
                      </span>
                      <div className="flex items-center">
                        <span className={themeColors.text}>{fruitName}</span>
                        {fruitGroup.count > 1 && (
                          <span
                            className={`ml-2 px-2 py-0.5 ${themeColors.buttonBg} ${themeColors.buttonText} rounded-full text-sm`}
                          >
                            ×{fruitGroup.count}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemove(
                          fruits.findIndex((f) => f.name === fruitName)
                        )
                      }
                      className="px-3 py-1.5 text-red-500 hover:text-red-700 
                               hover:bg-red-50 rounded-lg transition-colors
                               focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </animated.div>
              ))}
            </div>

            {/* Pie Chart */}
            <div
              className={`flex-shrink-0 ${themeColors.cardBg} rounded-lg border ${themeColors.border}
                            overflow-y-auto custom-scrollbar mb-2
                            transition-all duration-300 backdrop-blur-md
                            ${themeColors.cardHoverBg}`}
            >
              <button
                onClick={() => setIsPieChartVisible(!isPieChartVisible)}
                className={`w-full p-4 flex items-center justify-between 
                           ${themeColors.surfaceHover} transition-colors group`}
              >
                <h3
                  className={`text-sm font-semibold ${themeColors.text}
                               group-hover:text-indigo-600 transition-colors`}
                >
                  Fruit Distribution
                </h3>
                <motion.span
                  animate={{ rotate: isPieChartVisible ? 180 : 0 }}
                  className="text-indigo-500 opacity-50 group-hover:opacity-100"
                >
                  ▼
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: isPieChartVisible ? "auto" : 0,
                  opacity: isPieChartVisible ? 1 : 0,
                }}
                className="overflow-y-auto custom-scrollbar"
                style={{ maxHeight: isPieChartVisible ? "300px" : 0 }}
              >
                <div className="px-4 pb-4">
                  <div className="h-48 w-full">
                    <PieChart
                      data={fruitDistribution}
                      lineWidth={40}
                      paddingAngle={2}
                      label={({ dataEntry }) =>
                        dataEntry.value > fruits.length * 0.1
                          ? dataEntry.title
                          : ""
                      }
                      labelStyle={{
                        fontSize: "5px",
                        fontFamily: "sans-serif",
                        fill: "#fff",
                        fontWeight: "bold",
                      }}
                      labelPosition={75}
                      animate
                      animationDuration={500}
                      radius={42}
                    />
                  </div>

                  {/* Legend */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {fruitDistribution.map((fruit) => (
                      <div
                        key={fruit.title}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: fruit.color }}
                        />
                        <span
                          className={`text-xs ${themeColors.secondaryText}`}
                        >
                          {fruit.title} ({fruit.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Fixed summary at bottom */}
            <div
              className={`flex-shrink-0 ${themeColors.cardBg} rounded-lg border ${themeColors.border}`}
            >
              <button
                onClick={() => setIsJarSummaryVisible(!isJarSummaryVisible)}
                className={`w-full p-4 flex items-center justify-between 
                           ${themeColors.surfaceHover} transition-colors group`}
              >
                <h3 className={`text-sm font-semibold ${themeColors.text}`}>
                  Jar Summary
                </h3>
                <motion.span
                  animate={{ rotate: isJarSummaryVisible ? 180 : 0 }}
                  className="text-indigo-500 opacity-50 group-hover:opacity-100 md:hidden"
                >
                  ▼
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: isJarSummaryVisible ? "auto" : 0,
                  opacity: isJarSummaryVisible ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-4 p-4"
                >
                  {[
                    {
                      icon: "🔥",
                      value: memoizedNutrition.calories,
                      label: "calories",
                    },
                    {
                      icon: "🍯",
                      value: memoizedNutrition.sugar,
                      label: "sugar",
                      unit: "g",
                    },
                    {
                      icon: "🥑",
                      value: memoizedNutrition.fat,
                      label: "fat",
                      unit: "g",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-center p-3 ${themeColors.cardBg}
                               rounded-xl border ${themeColors.border} backdrop-blur-sm
                               transition-all duration-300`}
                    >
                      <div
                        className="text-2xl mb-1 transform hover:scale-110 
                                    transition-transform duration-300"
                      >
                        {item.icon}
                      </div>
                      <div
                        className={`text-sm font-medium ${themeColors.text}`}
                      >
                        {item.value.toFixed(1)}
                        {item.unit || ""}
                      </div>
                      <div
                        className={`text-xs ${themeColors.secondaryText} font-light`}
                      >
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </animated.div>
  );
}
