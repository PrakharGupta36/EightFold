"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// 🪩 Shared neumorphic style utility
const baseButton =
  "relative flex items-center justify-center rounded-full px-8 py-[22px] w-56 text-white text-[12.5px] font-medium tracking-wide " +
  "transition-all duration-300 select-none outline-none focus:outline-none " +
  // 🎨 Background + Gradient Border
  "bg-gradient-to-br from-[#9af222]/30 via-[#2f2f2f] to-[#1a1a1a] border-[1.5px] border-transparent " +
  "bg-origin-border [background-clip:padding-box,border-box] " +
  // 💡 Neumorphic Shadows
  "shadow-[inset_2px_2px_4px_#000,inset_-2px_-2px_4px_#222,0_2px_6px_#000] " +
  "hover:shadow-[inset_1px_1px_2px_#000,inset_-1px_-1px_3px_#222,0_4px_12px_#101010,0_0_8px_#9af22244] " +
  "active:shadow-[inset_3px_3px_6px_#000,inset_-2px_-2px_5px_#2a2a2a,0_0_0_#000] " +
  // 🪶 Subtle motion
  "active:scale-[0.98] hover:text-[#9af222]";

export default function GameMenu({ onClick }: { onClick: () => void }) {
  const [menuState, setMenuState] = useState<"main" | "local">("main");

  return (
    <TooltipProvider>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mt-20 ">
        <AnimatePresence mode="wait">
          {/* ─── MAIN MENU ─────────────────────────────── */}
          {menuState === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex gap-6 pointer-events-auto"
            >
              {/* Play Local */}
              <Button
                onClick={() => setMenuState("local")}
                className={`${baseButton} hover:text-[#9af222]`}
              >
                Play Local
              </Button>

              {/* Play Online */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`${baseButton} text-[#555] cursor-not-allowed hover:text-[#666]`}
                  >
                    Play Online
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1d1d1d] text-[#dfdfdf] border border-[#333] rounded-md">
                  Coming soon...
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}

          {/* ─── LOCAL MENU ─────────────────────────────── */}
          {menuState === "local" && (
            <motion.div
              key="local"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-5 pointer-events-auto mt-39"
            >
              <Button className={`${baseButton} hover:text-[#9af222]`} onClick={onClick}>
                Play on the same device
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`${baseButton} text-[#555] cursor-not-allowed hover:text-[#666]`}
                  >
                    Join a room
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1d1d1d] text-[#dfdfdf] border border-[#333] rounded-md">
                  Coming soon...
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={`${baseButton} text-[#555] cursor-not-allowed hover:text-[#666]`}
                  >
                    Make a room
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1d1d1d] text-[#dfdfdf] border border-[#333] rounded-md">
                  Coming soon...
                </TooltipContent>
              </Tooltip>

              {/* Back button */}
              <Button
                onClick={() => setMenuState("main")}
                className={`${baseButton} bg-[#616163]/90 text-white cursor-not-allowed hover:text-[#9af222]`}
              >
                ← Back
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
