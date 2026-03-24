import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import generateRouter from "./routes/generate";

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件（渲染完成的视频）
app.use("/output", express.static(path.join(process.cwd(), "output")));

// API 路由
app.use("/api", generateRouter);

// 健康检查
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve 前端静态文件
const frontendPath = path.join(process.cwd(), "..", "frontend", "dist");
app.use(express.static(frontendPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 AI视频生成器后端已启动: http://localhost:${PORT}`);
  console.log(`📝 Gemini API Key: ${process.env.GEMINI_API_KEY ? "已配置" : "未配置"}`);
});

export default app;
