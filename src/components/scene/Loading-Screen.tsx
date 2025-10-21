import { Html, useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
    const { progress } = useProgress();
    
    
  return (
    <AnimatePresence>
      <Html
        center
        className="relative grid h-screen w-screen place-items-center bg-[#0b0b0b] overflow-hidden"
      >
        <motion.main
          key="loading-screen"
          className="relative grid h-screen w-screen place-items-center bg-[#0b0b0b] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.2, ease: "easeInOut" },
          }}
        >
          {/* 🩶 Ambient motion glow (subtle movement) */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-green-400/10 blur-[200px]"
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* 💫 Loading bar container */}
          <motion.div
            className="relative z-10 w-64 h-1 rounded-full bg-[#1a1a1a]/80 overflow-hidden backdrop-blur-sm"
            style={{
              boxShadow: `
              inset 0 1px 2px #ffffff50,
              0 2px 4px #00000030,
              0 4px 8px #00000015
            `,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* 🌈 Animated progress fill */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* ✨ Shimmer effect */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-25%", "100%"],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* 🔦 Ambient overlay gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
        </motion.main>
      </Html>
    </AnimatePresence>
  );
}
