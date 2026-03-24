import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Job, GenerateRequest } from "../types";
import { generateVideoScript, generateVideoScriptFromContent } from "../services/ai";
import { scrapeUrl } from "../services/scraper";
import { fetchImagesForScenes } from "../services/image";
import { renderVideo } from "../services/render";

const router = Router();

// 内存中存储任务状态（MVP 足够了）
const jobs = new Map<string, Job>();

// POST /api/generate - 创建生成任务
router.post("/generate", async (req: Request, res: Response) => {
  const { topic, url, style = "tech", scenes = 5 } = req.body as GenerateRequest;

  if (!topic?.trim() && !url?.trim()) {
    res.status(400).json({ error: "请提供视频主题或 URL" });
    return;
  }

  const displayTopic = topic?.trim() || url!.trim();
  const jobId = uuidv4();
  const job: Job = {
    id: jobId,
    status: "generating",
    progress: 0,
    topic: displayTopic,
    style,
    createdAt: new Date(),
  };

  jobs.set(jobId, job);
  res.json({ jobId });

  // 异步执行生成流程（不阻塞响应）
  processJob(jobId, topic?.trim(), url?.trim(), style, scenes).catch((err) => {
    const j = jobs.get(jobId);
    if (j) {
      j.status = "error";
      j.error = err.message;
    }
    console.error(`任务 ${jobId} 失败:`, err);
  });
});

// GET /api/job/:jobId - 查询任务状态
router.get("/job/:jobId", (req: Request, res: Response) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "任务不存在" });
    return;
  }

  res.json({
    status: job.status,
    progress: job.progress,
    videoUrl: job.videoUrl,
    script: job.script,
    error: job.error,
  });
});

// GET /api/download/:jobId - 下载视频文件
router.get("/download/:jobId", (req: Request, res: Response) => {
  const job = jobs.get(req.params.jobId);
  if (!job || job.status !== "done") {
    res.status(404).json({ error: "视频未就绪" });
    return;
  }

  const { getVideoPath, videoExists } = require("../services/render");
  const videoPath = getVideoPath(req.params.jobId);

  if (!videoExists(req.params.jobId)) {
    res.status(404).json({ error: "视频文件不存在" });
    return;
  }

  res.download(videoPath, `${job.topic}-${job.style}.mp4`);
});

// 异步处理任务的核心流程
async function processJob(
  jobId: string,
  topic: string | undefined,
  url: string | undefined,
  style: import("../types").VideoStyle,
  sceneCount: number
) {
  const job = jobs.get(jobId)!;

  // 第一步：生成脚本
  job.progress = 5;
  let script;

  if (url) {
    // URL 模式：先抓取正文，再基于内容生成脚本
    console.log(`[${jobId}] 抓取 URL: ${url}`);
    job.progress = 10;
    const scraped = await scrapeUrl(url);
    job.topic = scraped.title || url; // 用页面标题替换显示名
    console.log(`[${jobId}] 抓取完成，正文 ${scraped.text.length} 字`);
    job.progress = 20;
    script = await generateVideoScriptFromContent(scraped.text, scraped.title, style, sceneCount);
  } else {
    // 主题模式：直接生成脚本
    console.log(`[${jobId}] 开始生成脚本: ${topic}`);
    script = await generateVideoScript(topic!, style, sceneCount);
  }

  job.script = script;
  job.progress = 30;
  console.log(`[${jobId}] 脚本生成完成，共 ${script.scenes.length} 个场景`);

  // 第二步：获取配图
  console.log(`[${jobId}] 开始获取配图`);
  script.scenes = await fetchImagesForScenes(script.scenes);
  job.progress = 40;
  console.log(`[${jobId}] 配图获取完成`);

  // 第三步：渲染视频
  job.status = "rendering";
  console.log(`[${jobId}] 开始渲染视频`);

  await renderVideo(jobId, script, style, (progress) => {
    job.progress = 40 + Math.floor(progress * 0.6);
  });

  // 完成
  job.status = "done";
  job.progress = 100;
  job.videoUrl = `/api/download/${jobId}`;
  console.log(`[${jobId}] 渲染完成!`);
}

export { jobs };
export default router;
