import { useState, useEffect } from 'react';
import { getHistory, deleteHistory } from '../utils/history.js';

/**
 * 格式化时间显示
 */
function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin} 分钟前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} 小时前`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} 天前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 侧边栏导航组件
 *
 * @param {Object} props
 * @param {string} props.currentPage - 当前页面
 * @param {Function} props.onNavigate - 导航回调
 * @param {Array} props.historyList - 历史记录列表
 * @param {Function} props.onLoadHistory - 加载历史记录
 * @param {Function} props.onDeleteHistory - 删除历史记录
 */
export default function Sidebar({
  currentPage,
  onNavigate,
  historyList = [],
  onLoadHistory,
  onDeleteHistory,
}) {
  const [showHistory, setShowHistory] = useState(true);

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col"
      style={{
        width: '220px',
        backgroundColor: '#fff',
        borderRight: '1px solid var(--color-border)',
        zIndex: 10,
      }}
    >
      {/* Logo 区 */}
      <div className="px-6 py-7 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">💬</span>
          <span className="text-lg font-bold" style={{ color: 'var(--color-ink)' }}>
            ReplyMate
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
          智能差评回复助手
        </p>
      </div>

      {/* 导航菜单 */}
      <nav className="px-4 py-5 space-y-1">
        <p className="px-2 mb-3 text-xs font-medium" style={{ color: 'var(--color-ink-secondary)' }}>
          功能模块
        </p>

        <button
          type="button"
          onClick={() => onNavigate('input')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-colors"
          style={{
            backgroundColor: currentPage === 'input' ? 'var(--color-accent-light)' : 'transparent',
            color: 'var(--color-ink)',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 'input') e.currentTarget.style.backgroundColor = 'var(--color-accent-light)';
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'input') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span className="text-lg">📝</span>
          <div>
            <div className="font-medium">差评输入</div>
            <div className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>填写商品与评价信息</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('result')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-colors"
          style={{
            backgroundColor: currentPage === 'result' ? 'var(--color-accent-light)' : 'transparent',
            color: 'var(--color-ink)',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 'result') e.currentTarget.style.backgroundColor = 'var(--color-accent-light)';
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 'result') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span className="text-lg">✨</span>
          <div>
            <div className="font-medium">回复生成</div>
            <div className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>查看 AI 分析与回复</div>
          </div>
        </button>
      </nav>

      {/* 历史记录 */}
      <div className="flex-1 overflow-hidden flex flex-col border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:opacity-70"
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-ink-secondary)' }}>
            📋 历史记录
          </span>
          <span className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
            {showHistory ? '▾' : '▸'}
          </span>
        </button>

        {showHistory && (
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {historyList.length === 0 ? (
              <p className="text-xs px-2 py-4 text-center" style={{ color: 'var(--color-ink-secondary)' }}>
                暂无记录
              </p>
            ) : (
              historyList.map((entry) => (
                <div
                  key={entry.id}
                  className="group relative"
                >
                  <button
                    type="button"
                    onClick={() => onLoadHistory?.(entry)}
                    className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--color-accent-light)]"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span style={{ color: 'var(--color-accent-deep)' }}>🏷️</span>
                      <span className="font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                        {entry.category}
                      </span>
                      <span className="shrink-0 ml-auto" style={{ color: 'var(--color-ink-secondary)' }}>
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: 'var(--color-ink-secondary)', paddingLeft: '20px' }}
                    >
                      {entry.reviewSnippet}...
                    </p>
                  </button>
                  {/* 删除按钮 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistory?.(entry.id);
                    }}
                    className="absolute top-2 right-2 text-xs opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity hover:text-red-500"
                    style={{ color: 'var(--color-ink-secondary)' }}
                    title="删除此记录"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
          v1.0 · MVP
        </p>
      </div>
    </aside>
  );
}
