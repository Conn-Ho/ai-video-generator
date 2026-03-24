// 视频场景数据
export interface SceneData {
  title: string;       // 场景标题
  body: string;        // 场景正文
  imageUrl: string;    // 背景图片 URL
  keywords: string[];  // 关键词标签
  imagePrompt: string; // 图片生成提示词
}

// 视频风格
export type VideoStyle = "tech" | "minimal" | "cute";

// 视频脚本
export interface VideoScript {
  title: string;       // 视频总标题
  scenes: SceneData[]; // 场景列表
}

// 任务状态
export type JobStatus = "generating" | "rendering" | "done" | "error";

// 任务数据
export interface Job {
  id: string;
  status: JobStatus;
  progress: number;          // 0-100
  topic: string;
  style: VideoStyle;
  script?: VideoScript;
  videoUrl?: string;
  error?: string;
  createdAt: Date;
}

// 生成请求体
export interface GenerateRequest {
  topic: string;
  style: VideoStyle;
  scenes: number;
}
