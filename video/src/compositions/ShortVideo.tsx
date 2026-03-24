import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Series,
} from "remotion";
import { ShortVideoProps } from "../types";
import { Scene } from "../components/Scene";

// 品牌水印组件
const Watermark: React.FC<{ brandName: string; style: string }> = ({ brandName, style }) => {
  const colorMap: Record<string, string> = {
    tech: "rgba(0, 212, 255, 0.6)",
    minimal: "rgba(0, 0, 0, 0.3)",
    cute: "rgba(255, 107, 157, 0.6)",
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontFamily: "'Microsoft YaHei', sans-serif",
          color: colorMap[style] || "rgba(255,255,255,0.5)",
          letterSpacing: 4,
          fontWeight: 300,
        }}
      >
        {brandName}
      </div>
    </div>
  );
};

// 开场标题卡
const IntroCard: React.FC<{ title: string; style: "tech" | "minimal" | "cute" }> = ({ title, style }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20, 50, 60], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 20], [0.85, 1], {
    extrapolateRight: "clamp",
  });

  const bgMap = {
    tech: "linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%)",
    minimal: "linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)",
    cute: "linear-gradient(135deg, #FFE4F3 0%, #FFC8E8 100%)",
  };

  const titleColorMap = {
    tech: "#00D4FF",
    minimal: "#1A1A1A",
    cute: "#FF6B9D",
  };

  return (
    <AbsoluteFill
      style={{
        background: bgMap[style],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: titleColorMap[style],
            fontFamily: "'Microsoft YaHei', sans-serif",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {style === "tech" && (
          <div
            style={{
              marginTop: 30,
              width: 120,
              height: 4,
              background: "linear-gradient(90deg, transparent, #00D4FF, transparent)",
              margin: "30px auto 0",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

// 主短视频合成组件
export const ShortVideo: React.FC<ShortVideoProps> = ({
  scenes,
  style,
  title,
  brandName = "AI视频",
}) => {
  const { fps } = useVideoConfig();

  // 每个场景时长：6秒
  const sceneDuration = 6 * fps;
  // 开场卡时长：2秒
  const introDuration = 2 * fps;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {/* 开场标题卡 */}
        <Series.Sequence durationInFrames={introDuration}>
          <IntroCard title={title} style={style} />
        </Series.Sequence>

        {/* 各场景 */}
        {scenes.map((scene, index) => (
          <Series.Sequence key={index} durationInFrames={sceneDuration}>
            <AbsoluteFill>
              <Scene scene={scene} style={style} sceneIndex={index} />
              {/* 品牌水印 */}
              <Watermark brandName={brandName} style={style} />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
