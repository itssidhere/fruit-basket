import { useSpring, animated } from "react-spring";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface LayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export const Layout = memo(function Layout({
  leftContent,
  rightContent,
}: LayoutProps) {
  const { themeColors } = useTheme();
  const [animationParent] = useAutoAnimate({
    duration: 200,
    easing: "ease-in-out",
  });

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background}`}>
      <animated.div style={fadeIn} className="container mx-auto p-4 md:p-8">
        <div
          ref={animationParent}
          className="flex flex-col lg:flex-row gap-4 md:gap-8 h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]"
        >
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            layoutId="leftContent"
            className="flex-1 lg:flex-[2] rounded-2xl z-10 relative h-[45vh] lg:h-full"
          >
            <div
              className={`absolute inset-0 ${themeColors.surface} backdrop-blur-xl
                         border ${themeColors.border}
                         shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                         hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
                         transition-all duration-300
                         rounded-2xl`}
            />
            <div className="relative z-20 p-2 h-full overflow-y-auto custom-scrollbar">
              {leftContent}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            layoutId="rightContent"
            className="flex-1 rounded-2xl z-0 relative h-[45vh] lg:h-full"
          >
            <div
              className={`absolute inset-0 ${themeColors.surface} backdrop-blur-xl
                         border ${themeColors.border}
                         shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                         hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]
                         transition-all duration-300
                         rounded-2xl`}
            />
            <div className="relative z-20 p-2 h-full overflow-y-auto custom-scrollbar">
              {rightContent}
            </div>
          </motion.div>
        </div>
      </animated.div>
    </div>
  );
});
