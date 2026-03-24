import React from "react";
import { JobStatus } from "../api/client";

interface ProgressCardProps {
  jobStatus: JobStatus;
  onDownload: () => void;
}

// 进度状态文字映射
const statusText: Record<string, string> = {
  generating: "AI 正在生成脚本...",
  rendering: "视频渲染中...",
  done: "视频生成完成！",
  error: "生成失败",
};

const statusIcon: Record<string, string> = {
  generating: "🤖",
  rendering: "🎬",
  done: "✅",
  error: "❌",
};

// 进度展示卡片
export const ProgressCard: React.FC<ProgressCardProps> = ({ jobStatus, onDownload }) => {
  const { status, progress, script, error } = jobStatus;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5">
      {/* 状态标题 */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{statusIcon[status]}</span>
        <div>
          <div className="font-bold text-white">{statusText[status]}</div>
          {status !== "done" && status !== "error" && (
            <div className="text-sm text-white/50">请耐心等待，这可能需要1-3分钟</div>
          )}
        </div>
      </div>

      {/* 进度条 */}
      {status !== "error" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">进度</span>
            <span className="text-cyan-400 font-mono">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {status === "error" && error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 脚本预览 */}
      {script && status !== "error" && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-white/70">📝 生成的脚本</div>
          <div className="text-cyan-400 font-bold text-lg">{script.title}</div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {script.scenes.map((scene, i) => (
              <div
                key={i}
                className="p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="text-xs text-white/40 mb-1">场景 {i + 1}</div>
                <div className="text-sm font-semibold text-white">{scene.title}</div>
                <div className="text-xs text-white/60 mt-1 leading-relaxed">{scene.body}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {scene.keywords.map((kw, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full text-xs border border-cyan-500/20"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 下载按钮 */}
      {status === "done" && (
        <button
          onClick={onDownload}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white
                     hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all duration-200
                     shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-lg"
        >
          <span>⬇</span>
          下载视频 (MP4)
        </button>
      )}
    </div>
  );
};
