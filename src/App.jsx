import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import InputForm from './components/InputForm.jsx';
import ReplyCardStack from './components/ReplyCardStack.jsx';
import { generateReply } from './utils/api.js';
import { checkDailyLimit, incrementDailyCount, getDailyCount } from './utils/storage.js';
import { getHistory, addHistory, deleteHistory } from './utils/history.js';

/**
 * ReplyMate — 智能差评回复助手
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('input');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyInfo, setDailyInfo] = useState(() => checkDailyLimit());
  const [error, setError] = useState(null);
  const [historyList, setHistoryList] = useState(() => getHistory());
  // 保留上次的 formData 用于重新生成
  const [lastFormData, setLastFormData] = useState(null);

  /** 处理表单提交 */
  const handleSubmit = async (formData) => {
    setError(null);
    setLastFormData(formData);

    const limit = checkDailyLimit();
    if (!limit.allowed) {
      setError(`今日免费额度（${limit.limit}次）已用完，请明天再来使用～`);
      return;
    }

    setIsLoading(true);

    try {
      const data = await generateReply({
        reviewText: formData.reviewText,
        productCategory: formData.productCategory,
        productInfo: formData.productInfo,
        returnPolicy: formData.returnPolicy,
        reviewImages: [],
      });

      incrementDailyCount();
      setDailyInfo(checkDailyLimit());
      setResult(data);

      // 存入历史记录
      addHistory(formData, data);
      setHistoryList(getHistory());

      // 自动跳转结果页
      setCurrentPage('result');
    } catch (err) {
      setError(err.message || '生成失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  /** 新建任务：返回输入页并清空 */
  const handleNewTask = () => {
    setCurrentPage('input');
    setResult(null);
    setError(null);
  };

  /** 页面导航（保留结果数据） */
  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    setError(null);
  }, []);

  /** 加载历史记录 */
  const handleLoadHistory = useCallback((entry) => {
    setResult(entry.result);
    setLastFormData(entry.formData);
    setError(null);
    setCurrentPage('result');
  }, []);

  /** 删除历史记录 */
  const handleDeleteHistory = useCallback((id) => {
    deleteHistory(id);
    setHistoryList(getHistory());
  }, []);

  return (
    <div className="flex min-h-screen relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* ===== 背景装饰圆 — 橘/红/深蓝/黑 ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* 大 — 橘色 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '-4%',
            right: '-2%',
            width: '340px',
            height: '340px',
            background: '#F4A340',
            opacity: 0.45,
            filter: 'blur(90px)',
          }}
        />
        {/* 中 — 深蓝 */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-6%',
            left: '22%',
            width: '260px',
            height: '260px',
            background: '#1660AB',
            opacity: 0.45,
            filter: 'blur(75px)',
          }}
        />
        {/* 中 — 红色 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '35%',
            right: '5%',
            width: '200px',
            height: '200px',
            background: '#E04444',
            opacity: 0.45,
            filter: 'blur(65px)',
          }}
        />
        {/* 小 — 黑色 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '55%',
            left: '40%',
            width: '140px',
            height: '140px',
            background: '#1A1A1A',
            opacity: 0.45,
            filter: 'blur(50px)',
          }}
        />
        {/* 小 — 橘色点缀 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '15%',
            left: '35%',
            width: '100px',
            height: '100px',
            background: '#F4A340',
            opacity: 0.45,
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* ===== 左侧边栏 ===== */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        historyList={historyList}
        onLoadHistory={handleLoadHistory}
        onDeleteHistory={handleDeleteHistory}
      />

      {/* ===== 右侧主内容区 ===== */}
      <div className="flex-1 relative" style={{ marginLeft: '220px', zIndex: 1 }}>
        <div className="max-w-5xl mx-auto px-8 py-10 md:py-14">

          {/* ---- 错误提示 ---- */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl border flex items-start gap-3"
              style={{ backgroundColor: '#FFF2F0', borderColor: '#FFCCC7' }}
            >
              <span className="text-lg shrink-0">⚠️</span>
              <div className="flex-1">
                <p className="font-medium text-sm" style={{ color: '#cf1322' }}>{error}</p>
                {error.includes('额度') && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-ink-secondary)' }}>
                    已使用：{getDailyCount()} / {dailyInfo.limit} 次
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-sm cursor-pointer hover:opacity-70 shrink-0"
                style={{ color: 'var(--color-ink-secondary)' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* ========== 输入页 ========== */}
          {currentPage === 'input' && (
            <>
              <header className="mb-10">
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-ink)' }}>
                  智能差评回复
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                  填写差评信息，AI 为你生成专业、真诚、温暖的回复
                </p>
              </header>

              <section
                id="form-area"
                className="p-6 md:p-10 rounded-2xl border shadow-sm"
                style={{ backgroundColor: '#fff', borderColor: 'var(--color-border)' }}
              >
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <span>📋</span>
                  <span>差评信息</span>
                </h2>
                <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
              </section>

              <footer className="text-center mt-14 pb-8">
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
                  <span>今日剩余：{dailyInfo.remaining} / {dailyInfo.limit} 次</span>
                  <span>·</span>
                  <span>Made with ❤️</span>
                </div>
              </footer>
            </>
          )}

          {/* ========== 结果页（有结果） ========== */}
          {currentPage === 'result' && result && (
            <>
              <header className="mb-10">
                <button
                  type="button"
                  onClick={handleNewTask}
                  className="inline-flex items-center gap-1.5 text-sm mb-3 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--color-ink-secondary)' }}
                >
                  <span>←</span>
                  <span>返回编辑</span>
                </button>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-ink)' }}>
                  回复生成结果
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
                  三版不同风格的回复，选你最喜欢的一条
                </p>
              </header>

              <ReplyCardStack replies={result} />

              <footer className="text-center mt-14 pb-8">
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
                  <span>今日剩余：{dailyInfo.remaining} / {dailyInfo.limit} 次</span>
                  <span>·</span>
                  <span>Made with ❤️</span>
                </div>
              </footer>
            </>
          )}

          {/* ========== 结果页（空状态） ========== */}
          {currentPage === 'result' && !result && (
            <div className="flex flex-col items-center justify-center py-32">
              {/* 装饰图案 */}
              <div className="relative mb-8">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-accent-light)', opacity: 0.6 }}
                >
                  <span className="text-5xl">✨</span>
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-pink-light)', opacity: 0.7 }}
                >
                  <span className="text-xl">💬</span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                还没有生成回复
              </h2>
              <p className="text-sm mb-8 text-center" style={{ color: 'var(--color-ink-secondary)' }}>
                填写差评信息后，AI 会在这里为你生成三种风格的回复
              </p>

              <button
                type="button"
                onClick={() => setCurrentPage('input')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-accent-deep)',
                  color: '#fff',
                }}
              >
                <span>📝</span>
                <span>去填写差评信息</span>
              </button>

              {/* 历史记录快捷入口 */}
              {historyList.length > 0 && (
                <div className="mt-12 text-center">
                  <p className="text-xs mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                    或查看之前的生成记录
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {historyList.slice(0, 3).map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => handleLoadHistory(entry)}
                        className="px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: '#fff',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-ink)',
                        }}
                      >
                        🏷️ {entry.category} · {entry.reviewSnippet}...
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
