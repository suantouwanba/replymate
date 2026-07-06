/**
 * 历史记录工具模块
 * 使用 localStorage 存储生成历史，最多保留 20 条
 */

const STORAGE_KEY = 'replymate_history';
const MAX_ENTRIES = 20;

/**
 * 获取全部历史记录（最新的在前）
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 添加一条历史记录
 * @param {Object} formData - 表单输入数据
 * @param {Object} result - 生成结果
 */
export function addHistory(formData, result) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    category: result.category || '未知',
    reviewSnippet: (formData.reviewText || '').slice(0, 40),
    productCategory: formData.productCategory || '',
    formData,
    result,
  });
  // 超过上限删掉最旧的
  if (history.length > MAX_ENTRIES) {
    history.length = MAX_ENTRIES;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * 删除一条历史记录
 */
export function deleteHistory(id) {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * 清空全部历史
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
