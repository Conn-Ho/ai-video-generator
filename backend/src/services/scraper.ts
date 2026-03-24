import fetch from "node-fetch";
import * as cheerio from "cheerio";

export interface ScrapedContent {
  title: string;
  text: string;
  url: string;
}

// 从 URL 抓取并提取正文
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`抓取失败: ${response.status} ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // 移除无用标签
  $("script, style, nav, footer, header, aside, iframe, noscript, ads, .ad").remove();

  // 提取标题
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").text().trim() ||
    "";

  // 优先取 article / main 区域，否则取 body
  let text = "";
  const articleEl = $("article, main, [role='main'], .post-content, .article-body, .content");
  if (articleEl.length > 0) {
    text = articleEl.first().text();
  } else {
    text = $("body").text();
  }

  // 清理空白
  text = text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 6000); // 控制 token 用量

  if (!text || text.length < 100) {
    throw new Error("页面内容太少，无法提取有效正文");
  }

  return { title, text, url };
}
