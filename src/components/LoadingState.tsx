import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fruitEmojis = [
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🥑",
  "🍆",
  "🥔",
];

const loadingMessages = [
  "Picking fresh fruits... 🌱",
  "Juggling fruits... 🤹‍♂️",
  "Checking fruit ripeness... 🔍",
  "Polishing the jar... ✨",
  "Gathering exotic fruits... 🏝️",
  "Consulting fruit experts... 🤓",
  "Doing fruit magic... 🪄",
  "Summoning the fruit gods... 🙏",
  "Preparing your fruit feast... 🎉",
  "Making fruit salad... 🥗",
  "Hunting for the perfect fruits... 🎯",
  "Teaching fruits to dance... 💃",
  "Convincing fruits to jump in... 🦘",
  "Fruit loading ceremony in progress... 🎭",
];

export function LoadingState() {
  const [currentEmojis, setCurrentEmojis] = useState<string[]>(
    Array(4)
      .fill(null)
      .map(() => fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)])
  );
  const [message, setMessage] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

  useEffect(() => {
    // Rotate loading messages randomly
    const messageInterval = setInterval(() => {
      setMessage(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 2000);

    // Rotate emojis
    const emojiInterval = setInterval(() => {
      setCurrentEmojis(
        Array(4)
          .fill(null)
          .map(
            () => fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)]
          )
      );
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(emojiInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {currentEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl"
              style={{
                transformOrigin: "center center",
                left: "50%",
                top: "50%",
                transform: `
                  rotate(${index * 90}deg) 
                  translateY(-40px) 
                  translateX(-50%)
                `,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.25,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.p
        className="mt-8 text-xl font-medium text-gray-600 text-center max-w-sm"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        {message}
      </motion.p>
    </div>
  );
}
