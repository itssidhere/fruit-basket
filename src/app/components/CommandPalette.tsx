import { Dialog, Combobox } from "@headlessui/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fruitEmojis } from "../constants/fruitEmojis";
import { useTheme } from "../contexts/ThemeContext";
import { Fruit } from "../types/types";

interface Command {
  id: string;
  name: string;
  emoji: string;
  description: string;
  fruit: Fruit;
}

interface CommandPaletteProps {
  onAddToJar: (fruit: Fruit) => void;
}

export function CommandPalette({ onAddToJar }: CommandPaletteProps) {
  const { themeColors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const fetchFruits = async () => {
    const response = await fetch("/api/fetch-fruits");
    return response.json();
  };

  // Fetch fruits data
  const { data: fruits } = useQuery({
    queryKey: ["fruits"],
    queryFn: fetchFruits,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getCommands = (fruits: Fruit[] = []): Command[] => {
    return fruits.map((fruit) => ({
      id: String(fruit.id),
      name: fruit.name,
      emoji: fruitEmojis[fruit.name] || fruitEmojis.default,
      description: `${fruit.nutritions.calories} calories, ${fruit.nutritions.sugar}g sugar`,
      fruit: fruit,
    }));
  };

  const filteredCommands =
    query === ""
      ? []
      : getCommands(fruits).filter((command) =>
          command.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={setIsOpen}
          className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[25vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <Dialog.Panel
            className={`relative mx-auto max-w-xl rounded-xl ${themeColors.surface} shadow-2xl`}
          >
            <Combobox
              onChange={(command: Command) => {
                onAddToJar(command.fruit);
                setIsOpen(false);
              }}
            >
              <div className={`border-b ${themeColors.border} relative`}>
                <Combobox.Input
                  className={`w-full border-0 ${themeColors.surface} px-4 py-3 
                           ${themeColors.text} placeholder:${themeColors.secondaryText} 
                           focus:outline-none focus:ring-0`}
                  placeholder="Search fruits..."
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 
                             ${themeColors.secondaryText} hover:${themeColors.text} 
                             rounded-full transition-colors`}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <Combobox.Options className="max-h-96 overflow-y-auto py-4 custom-scrollbar">
                {filteredCommands.map((command) => (
                  <Combobox.Option
                    key={command.id}
                    value={command}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 ${
                        active ? themeColors.surfaceHover : ""
                      }`
                    }
                  >
                    {({ active }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{command.emoji}</span>
                          <div>
                            <div className={themeColors.text}>
                              {command.name}
                            </div>
                            <div
                              className={`text-sm ${
                                active
                                  ? themeColors.text
                                  : themeColors.secondaryText
                              }`}
                            >
                              {command.description}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToJar(command.fruit);
                            setIsOpen(false);
                          }}
                          className={`ml-4 bg-gradient-to-r ${themeColors.primary} 
                                   ${themeColors.buttonText} p-2 rounded-full`}
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
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
