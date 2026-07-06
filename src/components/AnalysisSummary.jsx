/**
 * 分析摘要组件
 * 显示 AI 分析结果：差评类型、情绪、合规状态
 *
 * @param {Object} props
 * @param {Object} props.result - API 返回的分析结果
 */
export default function AnalysisSummary({ result }) {
  if (!result) return null;

  const isCompliant = result.compliance_pass !== false;

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm">
      {/* 差评类型 */}
      {result.category && (
        <div className="flex items-center gap-1.5">
          <span>🏷️</span>
          <span style={{ color: 'var(--color-ink-secondary)' }}>差评类型：</span>
          <span className="font-medium">{result.category}</span>
        </div>
      )}

      {/* 分隔线 */}
      <div className="hidden md:block w-px h-4" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* 情绪强度 */}
      {result.emotion && (
        <div className="flex items-center gap-1.5">
          <span>🎯</span>
          <span style={{ color: 'var(--color-ink-secondary)' }}>情绪：</span>
          <span className="font-medium">{result.emotion}</span>
        </div>
      )}

      {/* 分隔线 */}
      <div className="hidden md:block w-px h-4" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* 合规状态 */}
      <div className="flex items-center gap-1.5">
        <span>{isCompliant ? '✅' : '🚫'}</span>
        <span style={{ color: 'var(--color-ink-secondary)' }}>合规检查：</span>
        <span
          className={`font-medium ${isCompliant ? '' : 'font-semibold'}`}
          style={{ color: isCompliant ? '#22c55e' : '#ef4444' }}
        >
          {isCompliant ? '通过' : '未通过！请修改后重新生成'}
        </span>
      </div>
    </div>
  );
}
