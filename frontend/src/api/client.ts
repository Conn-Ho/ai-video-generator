// API 客户端 - 封装所有后端接口调用
const BASE_URL = "/api";

export interface GenerateRequest {
  topic?: string;
  url?: string;
  style: "tech" | "minimal" | "cute";
  scenes: number;
}

export interface JobStatus {
  status: "generating" | "rendering" | "done" | "error";
  progress: number;
  videoUrl?: string;
  script?: {
    title: string;
    scenes: Array<{
      title: string;
      body: string;
      keywords: string[];
      imageUrl: string;
    }>;
  };
  error?: string;
}

// 创建生成任务
export async function createGenerateJob(data: GenerateRequest): Promise<{ jobId: string }> {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json() as { error?: string };
    throw new Error(err.error || "创建任务失败");
  }

  return res.json() as Promise<{ jobId: string }>;
}

// 查询任务状态
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${BASE_URL}/job/${jobId}`);

  if (!res.ok) {
    throw new Error("查询任务状态失败");
  }

  return res.json() as Promise<JobStatus>;
}

// 获取下载链接
export function getDownloadUrl(jobId: string): string {
  return `${BASE_URL}/download/${jobId}`;
}
