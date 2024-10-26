import { motion } from "framer-motion";
import { themes, useTheme } from "../contexts/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme, themeColors } = useTheme();

  return (
    <motion.div
      className={`${themeColors.surface} backdrop-blur-lg rounded-full p-2 shadow-lg
                  border ${themeColors.border}`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex space-x-2">
        {(Object.keys(themes) as Array<keyof typeof themes>).map(
          (themeName) => (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                themes[themeName].primary
              } transition-all duration-200 ${
                theme === themeName
                  ? "ring-2 ring-offset-2 ring-indigo-400 scale-110"
                  : "hover:scale-105"
              }`}
            />
          )
        )}
      </div>
    </motion.div>
  );
}
