/**
 * Cloudflare Pages Function — Coze API 安全代理
 *
 * 和 Vercel 版一样的作用：浏览器请求 → 这个函数加上 Token → 转发给 Coze → 返回结果
 * 🔒 Token 存在 Cloudflare 环境变量里，浏览器看不到
 *
 * 部署后在 Cloudflare Pages 后台设置环境变量：
 *   COZE_TOKEN=你的密钥
 */

export async function onRequest(context) {
  // 只接受 POST 请求
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ code: -1, msg: '仅支持 POST 请求' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 从 URL 拼出 Coze API 的路径
    // 例如：浏览器请求 /api/coze/v1/workflow/run → catchall = ['v1','workflow','run']
    const catchall = context.params.catchall || [];
    const targetPath = '/' + catchall.join('/');

    // 保留查询参数
    const url = new URL(context.request.url);
    const cozeUrl = `https://api.coze.cn${targetPath}${url.search}`;

    // 读取浏览器发来的请求体
    const body = await context.request.text();

    // 🔒 从 Cloudflare 环境变量读取 Token（服务器端，外界看不到）
    const token = context.env.COZE_TOKEN;
    if (!token) {
      return new Response(
        JSON.stringify({ code: -1, msg: '服务端未配置 COZE_TOKEN 环境变量' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 转发给真正的 Coze API
    const cozeResponse = await fetch(cozeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body,
    });

    const data = await cozeResponse.json();
    return new Response(JSON.stringify(data), {
      status: cozeResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ code: -1, msg: `代理请求失败：${error.message}` }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
