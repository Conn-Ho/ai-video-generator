import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  interpolate,
  spring,
} from "remotion";
import { SceneData, VideoStyle } from "../types";
import { Title } from "./Title";

interface SceneProps {
  scene: SceneData;         // 场景数据
  style: VideoStyle;        // 视频风格
  sceneIndex: number;       // 场景序号（从0开始）
}

// 单个视频场景：背景图 + 渐变蒙层 + 标题 + 正文 + 序号
export const Scene: React.FC<SceneProps> = ({ scene, style, sceneIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 背景图片缓慢缩放（Ken Burns效果）
  const bgScale = interpolate(frame, [0, 150], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // 正文淡入（延迟标题出现后）
  const bodyOpacity = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const bodyTranslateY = interpolate(frame - 25, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 关键词标签淡入
  const tagsOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 根据风格选择配色方案
  const themeMap = {
    tech: {
      overlayGradient: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,20,0.7) 50%, rgba(0,0,0,0.3) 100%)",
      bodyColor: "#E0F0FF",
      tagBg: "rgba(0, 212, 255, 0.2)",
      tagBorder: "1px solid rgba(0, 212, 255, 0.5)",
      tagColor: "#00D4FF",
      indexColor: "rgba(0, 212, 255, 0.8)",
      numberBg: "rgba(0, 212, 255, 0.15)",
    },
    minimal: {
      overlayGradient: "linear-gradient(to top, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.1) 100%)",
      bodyColor: "#333333",
      tagBg: "rgba(26, 26, 26, 0.08)",
      tagBorder: "1px solid rgba(26, 26, 26, 0.2)",
      tagColor: "#555555",
      indexColor: "rgba(26, 26, 26, 0.5)",
      numberBg: "rgba(26, 26, 26, 0.06)",
    },
    cute: {
      overlayGradient: "linear-gradient(to top, rgba(255,240,248,0.96) 0%, rgba(255,220,240,0.65) 45%, rgba(255,200,220,0.2) 100%)",
      bodyColor: "#5A3045",
      tagBg: "rgba(255, 107, 157, 0.15)",
      tagBorder: "1px solid rgba(255, 107, 157, 0.4)",
      tagColor: "#FF6B9D",
      indexColor: "rgba(255, 107, 157, 0.7)",
      numberBg: "rgba(255, 107, 157, 0.1)",
    },
  };

  const theme = themeMap[style];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* 背景图片 - Ken Burns 效果 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${bgScale})`,
          transformOrigin: "center center",
        }}
      >
        {scene.imageUrl ? (
          <Img
            src={scene.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          // 无图片时用渐变背景
          <div
            style={{
              width: "100%",
              height: "100%",
              background: style === "tech"
                ? "linear-gradient(135deg, #0a0a2e 0%, #16213e 50%, #0f3460 100%)"
                : style === "minimal"
                ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)"
                : "linear-gradient(135deg, #FFE4F3 0%, #FFC8E8 50%, #FFB0D9 100%)",
            }}
          />
        )}
      </div>

      {/* 渐变蒙层 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: theme.overlayGradient,
        }}
      />

      {/* 场景序号 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 60,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: theme.numberBg,
          border: `2px solid ${theme.indexColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 700,
          color: theme.indexColor,
          fontFamily: "'Microsoft YaHei', sans-serif",
        }}
      >
        {sceneIndex + 1}
      </div>

      {/* 底部内容区域 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 60px 200px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* 标题 */}
        <Title text={scene.title} style={style} />

        {/* 正文 */}
        <div
          style={{
            opacity: bodyOpacity,
            transform: `translateY(${bodyTranslateY}px)`,
            fontSize: 42,
            lineHeight: 1.6,
            color: theme.bodyColor,
            fontFamily: "'Microsoft YaHei', sans-serif",
            fontWeight: 400,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          {scene.body}
        </div>

        {/* 关键词标签 */}
        {scene.keywords && scene.keywords.length > 0 && (
          <div
            style={{
              opacity: tagsOpacity,
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {scene.keywords.slice(0, 3).map((kw, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 24px",
                  borderRadius: 40,
                  background: theme.tagBg,
                  border: theme.tagBorder,
                  color: theme.tagColor,
                  fontSize: 34,
                  fontFamily: "'Microsoft YaHei', sans-serif",
                  fontWeight: 500,
                }}
              >
                #{kw}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
