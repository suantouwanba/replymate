import AnalysisSummary from './AnalysisSummary.jsx';
import ReplyCardStack from './ReplyCardStack.jsx';

/**
 * 结果展示区组件
 * 包含分析摘要 + 三卡片叠层切换，生成完成后从下方滑入
 *
 * @param {Object} props
 * @param {Object} props.result - API 返回结果
 */
export default function ResultArea({ result }) {
  if (!result) return null;

  return (
    <div className="result-slide-in">
      {/* 分隔装饰线 */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
        <span className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
          📊 AI 分析结果
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      {/* 分析摘要 */}
      <div
        className="p-4 rounded-xl border mb-6"
        style={{
          backgroundColor: '#fff',
          borderColor: 'var(--color-border)',
        }}
      >
        <AnalysisSummary result={result} />
      </div>

      {/* 三张回复卡片叠层 */}
      <div
        className="p-5 md:p-8 rounded-xl border"
        style={{
          backgroundColor: '#fff',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-1">💡 三版回复，选你喜欢的</h3>
          <p className="text-sm" style={{ color: 'var(--color-ink-secondary)' }}>
            点击「换一个版本」切换，找到最合适的回复
          </p>
        </div>

        <ReplyCardStack replies={result} />
      </div>
    </div>
  );
}
