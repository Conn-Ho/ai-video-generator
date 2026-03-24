import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface TitleProps {
  text: string;         // 标题文字
  style: "tech" | "minimal" | "cute"; // 风格
  startFrame?: number;  // 动画开始帧
}

// 标题动画组件：从下滑入 + 淡入效果
export const Title: React.FC<TitleProps> = ({ text, style, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // 弹簧动画：Y轴位移
  const translateY = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.8,
    },
    from: 80,
    to: 0,
  });

  // 淡入效果
  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 根据风格选择样式
  const styleMap = {
    tech: {
      color: "#00D4FF",
      fontFamily: "'Microsoft YaHei', sans-serif",
      textShadow: "0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3)",
      fontSize: 72,
      fontWeight: 900,
    },
    minimal: {
      color: "#1A1A1A",
      fontFamily: "'Microsoft YaHei', sans-serif",
      textShadow: "none",
      fontSize: 68,
      fontWeight: 700,
    },
    cute: {
      color: "#FF6B9D",
      fontFamily: "'Microsoft YaHei', sans-serif",
      textShadow: "3px 3px 0px rgba(255, 107, 157, 0.3)",
      fontSize: 66,
      fontWeight: 800,
    },
  };

  const currentStyle = styleMap[style];

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize: currentStyle.fontSize,
        fontWeight: currentStyle.fontWeight,
        color: currentStyle.color,
        fontFamily: currentStyle.fontFamily,
        textShadow: currentStyle.textShadow,
        textAlign: "center",
        lineHeight: 1.3,
        padding: "0 60px",
        wordBreak: "break-all",
      }}
    >
      {text}
    </div>
  );
};
