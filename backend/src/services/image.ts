import { SceneData } from "../types";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// 从 Unsplash 搜索图片
async function fetchUnsplashImage(query: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    return "";
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.unsplash.com/photos/random?query=${encodedQuery}&orientation=portrait&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = (await res.json()) as { urls?: { regular?: string } };
    return data?.urls?.regular || "";
  } catch {
    return "";
  }
}

// 为所有场景获取配图
export async function fetchImagesForScenes(scenes: SceneData[]): Promise<SceneData[]> {
  const updatedScenes = await Promise.all(
    scenes.map(async (scene) => {
      const imageUrl = await fetchUnsplashImage(scene.imagePrompt || scene.title);
      return { ...scene, imageUrl };
    })
  );
  return updatedScenes;
}
