import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface GridCell {
  x: number;
  y: number;
  targetScale: number;
  currentScale: number;
  targetGlow: number;
  currentGlow: number;
}

export default function CanvasGrid({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<GridCell[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(null);

  const CELL_SIZE = 20;
  const SPACING = 25;
  const INTERACTION_RADIUS = 70;
  const GRID_COLOR = "#000000";
  const GLOW_COLOR = "#22f237";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const initializeGrid = () => {
      cellsRef.current = [];
      const cols = Math.ceil(canvas.width / SPACING) + 2;
      const rows = Math.ceil(canvas.height / SPACING) + 2;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          cellsRef.current.push({
            x: x * SPACING - SPACING,
            y: y * SPACING - SPACING,
            targetScale: 1,
            currentScale: 1,
            targetGlow: 0,
            currentGlow: 0,
          });
        }
      }
    };

    initializeGrid();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      cellsRef.current.forEach((cell) => {
        cell.targetScale = 1;
        cell.targetGlow = 0;

        const dx = cell.x + CELL_SIZE / 2 - mouse.x;
        const dy = cell.y + CELL_SIZE / 2 - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INTERACTION_RADIUS) {
          const influence = 1 - distance / INTERACTION_RADIUS;
          cell.targetScale = 1 + influence * 0.5;
          cell.targetGlow = influence * 0.8;
        }

        cell.currentScale += (cell.targetScale - cell.currentScale) * 0.15;
        cell.currentGlow += (cell.targetGlow - cell.currentGlow) * 0.15;

        const size = CELL_SIZE * cell.currentScale;
        const offset = (size - CELL_SIZE) / 2;

        ctx.fillStyle = GRID_COLOR;
        ctx.fillRect(cell.x - offset, cell.y - offset, size, size);

        if (cell.currentGlow > 0.01) {
          ctx.strokeStyle = `rgba(89, 202, 110, ${cell.currentGlow})`;
          ctx.lineWidth = 2;
          ctx.strokeRect(cell.x - offset, cell.y - offset, size, size);
          ctx.fillStyle = GLOW_COLOR;

          ctx.shadowColor = `rgba(89, 202, 110, ${cell.currentGlow * 0.6})`;
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(89, 202, 110, ${cell.currentGlow * 0.1})`;
          ctx.fillRect(cell.x - offset, cell.y - offset, size, size);
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none -z-10"
      style={{ zIndex: 0 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
      }
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}
