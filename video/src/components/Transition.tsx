import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface TransitionProps {
  style: "tech" | "minimal" | "cute"; // 风格
  totalFrames: number;                 // 过渡总帧数
}

// 场景过渡动画：遮罩划入效果
export const Transition: React.FC<TransitionProps> = ({ style, totalFrames }) => {
  const frame = useCurrentFrame();

  // 过渡遮罩从左到右划过
  const translateX = interpolate(frame, [0, totalFrames], [-100, 100], {
    extrapolateRight: "clamp",
  });

  // 根据风格选择过渡颜色
  const colorMap = {
    tech: "#00D4FF",
    minimal: "#FFFFFF",
    cute: "#FF6B9D",
  };

  const color = colorMap[style];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transform: `translateX(${translateX}%)`,
        pointerEvents: "none",
      }}
    />
  );
};
