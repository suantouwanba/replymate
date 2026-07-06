/**
 * 本地存储工具
 * 负责每日使用次数统计，控制免费额度（每天最多 60 次）
 */

const STORAGE_KEY = 'breview_daily_usage';
const DAILY_LIMIT = 60;

/**
 * 获取今天的日期字符串（YYYY-MM-DD）
 */
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 读取今天的已使用次数
 * @returns {number} 今天已生成的回复次数
 */
export function getDailyCount() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.date === getToday()) {
      return data.count;
    }
  } catch {
    // 数据损坏，忽略
  }
  return 0;
}

/**
 * 增加一次使用记录（调用成功后调用）
 */
export function incrementDailyCount() {
  const today = getToday();
  const current = getDailyCount();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    date: today,
    count: current + 1,
  }));
}

/**
 * 检查是否还有剩余次数
 * @returns {{ allowed: boolean, remaining: number, limit: number }}
 */
export function checkDailyLimit() {
  const count = getDailyCount();
  return {
    allowed: count < DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - count),
    limit: DAILY_LIMIT,
  };
}
