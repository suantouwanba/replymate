/**
 * Coze API 调用模块（安全版）
 *
 * 调用路径：
 *   浏览器 → Vite 代理 / Vercel 云函数 → Coze API
 *   Token 藏在服务端，浏览器永远看不到
 */

const WORKFLOW_ID = '7658576993941061678';

/**
 * 调用 Coze API 生成差评回复
 */
export async function generateReply({ reviewText, productCategory, productInfo, returnPolicy, reviewImages = [] }) {
  const response = await fetch('/api/coze/v1/workflow/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflow_id: WORKFLOW_ID,
      parameters: {
        review_text: reviewText,
        product_category: productCategory,
        product_info: productInfo,
        return_policy: returnPolicy,
        review_images: reviewImages,
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('API 认证失败，请检查 Token 配置');
    }
    if (response.status === 429) {
      throw new Error('请求太频繁，请稍后再试');
    }
    throw new Error(`服务器异常（${response.status}），请稍后再试`);
  }

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || 'AI 生成失败，请重试');
  }

  // Coze 工作流 API 的 data 字段本身就是 JSON 字符串
  // 结构：{ category, passed, sincere_version, professional_version, warm_version, result_json }
  try {
    const output = JSON.parse(result.data);

    // result_json 是更深层的结构化数据（分析细节、合规、回复变体等）
    let detailed = null;
    try {
      detailed = JSON.parse(output.result_json);
    } catch {
      // result_json 解析失败不影响主流程
    }

    // 映射为前端组件需要的格式
    return {
      // AnalysisSummary 用的字段
      category: output.category || '未知',
      emotion: detailed?.analysis?.emotion || '未知',
      emotion_label: detailed?.analysis?.emotion_label || '',
      compliance_pass: output.passed !== false,

      // ReplyCardStack 用的字段
      sincere_reply: output.sincere_version || '暂无内容',
      professional_reply: output.professional_version || '暂无内容',
      warm_reply: output.warm_version || '暂无内容',

      // 完整数据留着备用
      _raw: output,
      _detailed: detailed,
    };
  } catch {
    throw new Error('AI 返回数据格式异常，请重试');
  }
}
