import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { VideoScript, VideoStyle } from "../types";

// 项目根目录（无论从哪里启动都正确）
const PROJECT_ROOT = path.resolve(__dirname, "../../../");

// 输出目录
const OUTPUT_DIR = path.join(PROJECT_ROOT, "output");

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Remotion 入口文件路径
const REMOTION_ENTRY = path.join(PROJECT_ROOT, "video/src/index.ts");

// 渲染视频
export async function renderVideo(
  jobId: string,
  script: VideoScript,
  style: VideoStyle,
  onProgress: (progress: number) => void
): Promise<string> {
  const outputPath = path.join(OUTPUT_DIR, `${jobId}.mp4`);

  // 计算总帧数：开场2秒 + 每场景6秒，30fps
  const totalFrames = (2 + script.scenes.length * 6) * 30;

  // 打包 Remotion 项目
  onProgress(10);
  const bundled = await bundle({
    entryPoint: REMOTION_ENTRY,
    onProgress: (p) => onProgress(10 + Math.floor(p * 30)),
  });

  // 选择合成
  onProgress(40);
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "ShortVideo",
    inputProps: {
      scenes: script.scenes,
      style,
      title: script.title,
      brandName: "AI视频",
    },
  });

  // 渲染视频
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: {
      scenes: script.scenes,
      style,
      title: script.title,
      brandName: "AI视频",
    },
    onProgress: ({ progress }) => {
      onProgress(40 + Math.floor(progress * 55));
    },
  });

  onProgress(100);
  return outputPath;
}

// 获取视频文件路径
export function getVideoPath(jobId: string): string {
  return path.join(OUTPUT_DIR, `${jobId}.mp4`);
}

// 检查视频文件是否存在
export function videoExists(jobId: string): boolean {
  return fs.existsSync(getVideoPath(jobId));
}
