import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { GroupByOption } from "../types/types";
import { useTheme } from "../contexts/ThemeContext";

interface GroupBySelectProps {
  value: GroupByOption;
  onChange: (value: GroupByOption) => void;
}

const options: { value: GroupByOption; icon: string; description: string }[] = [
  {
    value: "None",
    icon: "🔄",
    description: "Show all fruits without grouping",
  },
  {
    value: "Family",
    icon: "👨‍👩‍👧‍👦",
    description: "Group fruits by their botanical family",
  },
  { value: "Order", icon: "📊", description: "Organize by taxonomic order" },
  { value: "Genus", icon: "🧬", description: "Group by genus classification" },
];

export const GroupBySelect: React.FC<GroupBySelectProps> = ({
  value,
  onChange,
}) => {
  const { themeColors } = useTheme();
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-72 mb-6">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button
              className={`relative w-full cursor-pointer rounded-xl 
                         ${themeColors.surface} backdrop-blur-sm py-3 pl-4 pr-10 
                         text-left ${themeColors.text}
                         border ${themeColors.border} hover:border-indigo-200
                         shadow-sm hover:shadow-md
                         transition-all duration-200
                         focus:outline-none focus-visible:border-indigo-500 
                         focus-visible:ring-2 focus-visible:ring-white/75 
                         focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300`}
            >
              <motion.span
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-xl">{selectedOption?.icon}</span>
                <span
                  className={`block truncate font-medium ${themeColors.text}`}
                >
                  {selectedOption?.value}
                </span>
              </motion.span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <motion.svg
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-5 w-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={`absolute z-50 mt-2 max-h-60 w-full overflow-auto 
                           rounded-xl ${themeColors.surface} backdrop-blur-lg py-2
                           border ${themeColors.border}
                           shadow-lg ring-1 ring-black ring-opacity-5 
                           focus:outline-none text-base`}
              >
                {options.map((option, index) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active, selected }) =>
                      `relative cursor-pointer select-none py-3 pl-4 pr-10 
                       transition-all duration-200
                       ${active ? themeColors.surfaceHover : ""}
                       ${
                         selected
                           ? `${themeColors.surface} border-l-4 ${themeColors.primary}`
                           : ""
                       }`
                    }
                  >
                    {({ active, selected }) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{option.icon}</span>
                          <span
                            className={`block truncate ${
                              selected
                                ? `font-semibold ${themeColors.text}`
                                : `font-medium ${themeColors.text}`
                            }`}
                          >
                            {option.value}
                          </span>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`absolute right-2 flex items-center ${themeColors.text}`}
                            >
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            active
                              ? themeColors.text
                              : themeColors.secondaryText
                          }`}
                        >
                          {option.description}
                        </span>
                      </motion.div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};
