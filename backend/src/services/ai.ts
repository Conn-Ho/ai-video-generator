import { GoogleGenAI } from "@google/genai";
import { VideoScript, VideoStyle } from "../types";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// 根据风格生成系统提示词
function getStyleDescription(style: VideoStyle): string {
  const styleMap = {
    tech: "科技感、未来感、蓝色主题、专业严谨",
    minimal: "简约风格、黑白配色、干净清爽、商务简洁",
    cute: "可爱风格、粉色主题、活泼有趣、亲切温暖",
  };
  return styleMap[style];
}

// 调用 Gemini 生成视频脚本
export async function generateVideoScript(
  topic: string,
  style: VideoStyle,
  sceneCount: number
): Promise<VideoScript> {
  const styleDesc = getStyleDescription(style);

  const prompt = `你是一个专业的短视频脚本创作者，专门为抖音/小红书创作竖屏短视频内容。

请为以下主题创作一个短视频脚本：
主题：${topic}
视频风格：${styleDesc}
场景数量：${sceneCount}

要求：
1. 每个场景有简短有力的标题（不超过15个字）
2. 每个场景正文简洁明了（20-40字）
3. 每个场景3个相关关键词
4. 每个场景提供一个英文图片搜索关键词（用于 Unsplash）
5. 内容吸引人，有传播价值

请严格按照以下 JSON 格式返回（不要有任何其他文字）：
{
  "title": "视频总标题",
  "scenes": [
    {
      "title": "场景标题",
      "body": "场景正文内容",
      "keywords": ["关键词1", "关键词2", "关键词3"],
      "imagePrompt": "english search keywords for unsplash",
      "imageUrl": ""
    }
  ]
}`;

  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  const text = response.text ?? "";

  // 提取 JSON（去掉 markdown 代码块）
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    text.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    throw new Error("Gemini 返回格式错误：无法解析 JSON");
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0];

  try {
    const script = JSON.parse(jsonStr) as VideoScript;
    // 确保 imageUrl 默认为空字符串
    script.scenes = script.scenes.map(scene => ({
      ...scene,
      imageUrl: scene.imageUrl || "",
    }));
    return script;
  } catch {
    throw new Error("JSON 解析失败：" + jsonStr.substring(0, 200));
  }
}
