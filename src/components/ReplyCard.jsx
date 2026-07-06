import { useState } from 'react';

/**
 * 去除回复内容末尾的署名和日期
 */
function stripSignature(text) {
  if (!text) return text;
  const lines = text.trim().split('\n');
  if (lines.length === 0) return text;
  const lastLine = lines[lines.length - 1].trim();
  const signaturePattern = /^.*(?:团队|客服|店|品牌|售后|服务).*\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}\s*$/;
  if (signaturePattern.test(lastLine)) {
    lines.pop();
  }
  return lines.join('\n').trim();
}

/**
 * 单张回复卡片 — 玻璃质感 + 颜色辨识
 * 每版卡片有独立的玻璃色调，不再是纯白
 */
export default function ReplyCard({
  version,
  emoji,
  content,
  glassColor,    // 玻璃底色 rgba
  glassBorder,   // 玻璃边框色 rgba
  isActive,
  animationClass = '',
  layer = 0,
}) {
  const [copied, setCopied] = useState(false);
  const cleanContent = stripSignature(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cleanContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 根据层级计算阴影
  const shadow = layer === 0
    ? '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)'
    : layer === 1
    ? '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)'
    : '0 2px 8px rgba(0,0,0,0.05)';

  return (
    <div
      className={`relative rounded-2xl p-5 md:p-7 transition-all ${animationClass}`}
      style={{
        backgroundColor: isActive ? glassColor.active : glassColor.inactive,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${isActive ? glassBorder.active : glassBorder.inactive}`,
        boxShadow: shadow,
        opacity: isActive ? 1 : layer === 1 ? 0.6 : 0.35,
      }}
    >
      {/* 版本标签 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{emoji}</span>
        <span className="font-semibold text-base" style={{ color: 'var(--color-ink)' }}>
          {version}
        </span>
      </div>

      {/* 回复内容 — 限制最大高度防止卡片太大 */}
      <div
        className="text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-5 overflow-y-auto"
        style={{ color: 'var(--color-ink)', maxHeight: '260px' }}
      >
        {cleanContent}
      </div>

      {/* 复制按钮 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
            ${copied ? 'copy-flash' : ''}`}
          style={{
            backgroundColor: copied ? 'rgba(34, 197, 94, 0.12)' : 'rgba(0,0,0,0.04)',
            color: copied ? '#16a34a' : 'var(--color-ink-secondary)',
            border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? '已复制！' : '一键复制'}</span>
        </button>
      </div>
    </div>
  );
}
