import { useState } from 'react';

/**
 * 字段填写示例组件
 * 点击"📝 示例"后以翻卡片动画展示示例内容
 *
 * @param {Object} props
 * @param {string} props.title - 示例标题
 * @param {string} props.content - 示例内容
 */
export default function FieldExample({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-sm cursor-pointer"
        style={{ color: 'var(--color-blue-deep)' }}
      >
        <span>{isOpen ? '🔼' : '📝'}</span>
        <span className="hover:underline">{isOpen ? '收起示例' : '查看填写示例'}</span>
      </button>

      {/* 示例卡片（翻卡片动画展开/收起） */}
      {isOpen && (
        <div className="card-flip-enter mt-2 overflow-hidden">
          <div
            className="p-4 rounded-lg border text-sm leading-relaxed"
            style={{
              backgroundColor: 'var(--color-blue-light)',
              borderColor: 'var(--color-blue)',
              color: 'var(--color-ink-secondary)',
            }}
          >
            <div className="font-medium mb-1" style={{ color: 'var(--color-ink)' }}>
              {title}
            </div>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
