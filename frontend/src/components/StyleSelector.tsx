import React from "react";

type VideoStyle = "tech" | "minimal" | "cute";

interface StyleSelectorProps {
  value: VideoStyle;
  onChange: (style: VideoStyle) => void;
}

// 风格选择器组件
const styles: Array<{
  value: VideoStyle;
  label: string;
  description: string;
  icon: string;
  gradient: string;
  border: string;
  activeBg: string;
}> = [
  {
    value: "tech",
    label: "科技感",
    description: "蓝色霓虹·未来科技",
    icon: "⚡",
    gradient: "from-blue-900/50 to-cyan-900/50",
    border: "border-cyan-500/30",
    activeBg: "bg-cyan-500/20 border-cyan-400",
  },
  {
    value: "minimal",
    label: "简约风",
    description: "黑白简洁·商务专业",
    icon: "◼",
    gradient: "from-gray-800/50 to-gray-700/50",
    border: "border-gray-500/30",
    activeBg: "bg-gray-500/20 border-gray-300",
  },
  {
    value: "cute",
    label: "可爱风",
    description: "粉色温暖·活泼有趣",
    icon: "✿",
    gradient: "from-pink-900/50 to-rose-800/50",
    border: "border-pink-500/30",
    activeBg: "bg-pink-500/20 border-pink-400",
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {styles.map((style) => {
        const isActive = value === style.value;
        return (
          <button
            key={style.value}
            onClick={() => onChange(style.value)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              bg-gradient-to-br ${style.gradient}
              ${isActive
                ? `${style.activeBg} shadow-lg scale-[1.02]`
                : `${style.border} hover:scale-[1.01] hover:border-white/30`
              }
            `}
          >
            <div className="text-2xl mb-2">{style.icon}</div>
            <div className="text-sm font-bold text-white">{style.label}</div>
            <div className="text-xs text-white/50 mt-1 leading-tight">{style.description}</div>
            {isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current" />
            )}
          </button>
        );
      })}
    </div>
  );
};
