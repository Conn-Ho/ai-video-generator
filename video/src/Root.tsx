import React from "react";
import { Composition } from "remotion";
import { ShortVideo } from "./compositions/ShortVideo";
import type { ShortVideoProps } from "./types";

// Remotion 根组件：注册所有合成
export const RemotionRoot: React.FC = () => {
  // 默认测试场景数据
  const defaultScenes = [
    {
      title: "提升效率的第一步",
      body: "使用 AI 工具可以让你的工作效率提升 10 倍",
      imageUrl: "",
      keywords: ["效率", "AI", "工具"],
    },
    {
      title: "自动化重复任务",
      body: "把重复性工作交给 AI，专注于创造性思维",
      imageUrl: "",
      keywords: ["自动化", "创意", "智能"],
    },
    {
      title: "数据分析更简单",
      body: "一句话描述需求，AI 帮你生成完整分析报告",
      imageUrl: "",
      keywords: ["数据", "分析", "报告"],
    },
  ];

  const defaultProps: ShortVideoProps = {
    scenes: defaultScenes,
    style: "tech",
    title: "5个提升效率的AI工具",
    brandName: "AI视频",
  };

  // 计算总帧数：开场2秒 + 每场景6秒
  const totalFrames = (2 + defaultScenes.length * 6) * 30;

  return (
    <>
      <Composition
        id="ShortVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ShortVideo as any}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => {
          // 动态计算时长
          const frames = (2 + (props as unknown as ShortVideoProps).scenes.length * 6) * 30;
          return { durationInFrames: frames };
        }}
      />
    </>
  );
};
