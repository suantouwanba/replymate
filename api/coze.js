/**
 * Vercel Serverless 函数 — Coze API 安全代理
 *
 * 作用：浏览器请求本地 "/api/coze/xxx" → 这个函数收到后
 *       加上 Coze Token → 转发给真正的 Coze 服务器 → 把结果返回给浏览器
 *
 * 🔒 Token 只存在 Vercel 环境变量里，浏览器永远看不到
 *
 * 用法（部署后在 Vercel 后台设置环境变量）：
 *   COZE_TOKEN=你的密钥
 */

// Vercel 函数接收浏览器的请求
export async function POST(request) {
  try {
    // 从请求路径中提取 Coze API 的具体路径
    // 例如：浏览器请求 /api/coze/v1/workflow/run → 提取出 /v1/workflow/run
    const url = new URL(request.url);
    let targetPath = url.pathname.replace(/^\/api\/coze/, '');
    // 保留查询参数
    const queryString = url.search;

    const cozeUrl = `https://api.coze.cn${targetPath}${queryString}`;

    // 读取浏览器的请求体
    const body = await request.text();

    // 🔒 从 Vercel 环境变量读取 Token（服务器端，外界看不到）
    const token = process.env.COZE_TOKEN;
    if (!token) {
      return Response.json(
        { code: -1, msg: '服务端未配置 COZE_TOKEN 环境变量' },
        { status: 500 }
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

    // 把 Coze 的返回原样传给浏览器
    const data = await cozeResponse.json();
    return Response.json(data, { status: cozeResponse.status });
  } catch (error) {
    return Response.json(
      { code: -1, msg: `代理请求失败：${error.message}` },
      { status: 502 }
    );
  }
}

/**
 * 处理非 POST 请求（OPTIONS 预检等）
 * Vercel 函数约定：导出对应 HTTP 方法的函数名
 */
export async function GET(request) {
  return Response.json(
    { code: -1, msg: '仅支持 POST 请求' },
    { status: 405 }
  );
}

export async function PUT(request) {
  return Response.json(
    { code: -1, msg: '仅支持 POST 请求' },
    { status: 405 }
  );
}

export async function DELETE(request) {
  return Response.json(
    { code: -1, msg: '仅支持 POST 请求' },
    { status: 405 }
  );
}
