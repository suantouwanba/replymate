import { useState, useCallback } from 'react';
import ReplyCard from './ReplyCard.jsx';

/**
 * 三张回复卡片配置 — 加深的玻璃色调
 * active: 浓郁玻璃色, inactive: 淡玻璃色
 */
const CARD_CONFIGS = [
  {
    key: 'sincere',
    version: '真诚版',
    emoji: '💚',
    label: '真诚道歉，承认问题',
    glassColor: {
      active: 'rgba(255, 215, 165, 0.92)',
      inactive: 'rgba(255, 225, 180, 0.55)',
    },
    glassBorder: {
      active: 'rgba(235, 150, 25, 0.40)',
      inactive: 'rgba(235, 150, 25, 0.20)',
    },
  },
  {
    key: 'professional',
    version: '专业版',
    emoji: '💼',
    label: '专业正式，有理有据',
    glassColor: {
      active: 'rgba(195, 218, 252, 0.92)',
      inactive: 'rgba(200, 225, 252, 0.55)',
    },
    glassBorder: {
      active: 'rgba(18, 80, 150, 0.35)',
      inactive: 'rgba(18, 80, 150, 0.18)',
    },
  },
  {
    key: 'warm',
    version: '温暖版',
    emoji: '🌸',
    label: '温暖亲切，情感共鸣',
    glassColor: {
      active: 'rgba(255, 200, 218, 0.92)',
      inactive: 'rgba(255, 210, 225, 0.55)',
    },
    glassBorder: {
      active: 'rgba(220, 130, 155, 0.40)',
      inactive: 'rgba(220, 130, 155, 0.20)',
    },
  },
];

/**
 * 三卡片叠层切换组件
 * 卡片在左，切换按钮在右，垂直居中
 */
export default function ReplyCardStack({ replies }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [switching, setSwitching] = useState(false);

  const switchCard = useCallback(() => {
    if (switching) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
      setSwitching(false);
    }, 350);
  }, [switching]);

  const replyContents = [
    replies.sincere_reply || '暂无内容',
    replies.professional_reply || '暂无内容',
    replies.warm_reply || '暂无内容',
  ];

  return (
    <div className="flex items-center gap-6">
      {/* ===== 左侧：卡片堆叠区域 ===== */}
      <div className="flex-1 relative" style={{ minHeight: '380px', paddingTop: '24px' }}>
        {CARD_CONFIGS.map((config, index) => {
          const position = (index - activeIndex + 3) % 3;
          const isActive = position === 0;
          const isSwitchingOut = isActive && switching;

          const offsetX = position * 28;
          const offsetY = position * 20;

          return (
            <div
              key={config.key}
              className="absolute left-0 right-0 transition-all duration-300"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
                zIndex: 3 - position,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <ReplyCard
                version={config.version}
                emoji={config.emoji}
                content={replyContents[index]}
                glassColor={config.glassColor}
                glassBorder={config.glassBorder}
                isActive={isActive}
                layer={position}
                animationClass={isSwitchingOut ? 'card-fade-out' : ''}
              />
            </div>
          );
        })}
      </div>

      {/* ===== 右侧：版本指示器 + 切换按钮（垂直居中） ===== */}
      <div className="flex flex-col items-center gap-4 shrink-0">
        {/* 版本指示圆点 */}
        <div className="flex flex-col items-center gap-2.5">
          {CARD_CONFIGS.map((config, index) => (
            <button
              key={config.key}
              type="button"
              onClick={() => {
                if (!switching && index !== activeIndex) {
                  setSwitching(true);
                  setTimeout(() => {
                    setActiveIndex(index);
                    setSwitching(false);
                  }, 350);
                }
              }}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: index === activeIndex ? '12px' : '9px',
                height: index === activeIndex ? '12px' : '9px',
                backgroundColor:
                  index === activeIndex
                    ? 'var(--color-accent-deep)'
                    : 'var(--color-border)',
              }}
              title={config.version}
            />
          ))}
        </div>

        {/* 切换按钮 */}
        <button
          type="button"
          onClick={switchCard}
          disabled={switching}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
          style={{
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent-deep)',
            border: '1px solid var(--color-accent)',
          }}
        >
          <span>🔄</span>
          <span>换一个版本</span>
        </button>

        {/* 当前版本标签 */}
        <p className="text-xs text-center" style={{ color: 'var(--color-ink-secondary)' }}>
          {CARD_CONFIGS[activeIndex].label}
        </p>
      </div>
    </div>
  );
}
