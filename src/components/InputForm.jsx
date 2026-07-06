import { useState, useRef } from 'react';
import FieldExample from './FieldExample.jsx';

/**
 * 字段配置：定义每个输入字段的属性
 */
const FIELDS = [
  {
    name: 'productCategory',
    label: '📦 商品类目',
    placeholder: '例如：女装、美妆、3C数码、食品…',
    rows: 1,
    exampleTitle: '💡 填写示例',
    exampleContent: '填写商品的所属类目，帮助 AI 理解行业背景。\n\n比如：女装、手机配件、零食、家具、母婴用品',
  },
  {
    name: 'productInfo',
    label: '📝 商品详情',
    placeholder: '描述商品的核心卖点、材质、规格等信息…\n例如：夏季女士短袖T恤，纯棉面料，200g重磅，不变形不缩水',
    rows: 3,
    exampleTitle: '💡 填写示例',
    exampleContent: '写出商品的卖点和规格，越详细 AI 生成的回复越精准。\n\n示例：「夏季女士短袖T恤，纯棉面料，200g重磅，不变形不缩水，机洗不掉色，S-XXL码可选」',
  },
  {
    name: 'returnPolicy',
    label: '🔄 退换政策',
    placeholder: '例如：七天无理由退货，赠送运费险',
    rows: 2,
    exampleTitle: '💡 填写示例',
    exampleContent: '写清楚退换货规则，AI 会在回复中适当引用。\n\n示例：「支持七天无理由退换货，赠送运费险，退回运费由我们承担」',
  },
  {
    name: 'reviewText',
    label: '💬 差评原文',
    placeholder: '粘贴买家的差评内容…\n例如：洗了一次就变形了，质量太差了，完全不值这个价！',
    rows: 6,
    exampleTitle: '💡 填写示例',
    exampleContent: '直接复制粘贴买家写的差评原文，不要改动。\n\n示例：「洗了一次就变形了，质量太差了，完全不值这个价！跟图片完全不一样，后悔买了！」',
  },
];

/**
 * 输入表单组件
 * 包含 4 个文本输入字段 + 图片上传 + 翻卡片示例
 */
export default function InputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    productCategory: '',
    productInfo: '',
    returnPolicy: '',
    reviewText: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!formData.reviewText.trim()) {
      alert('请填写差评原文');
      return;
    }
    onSubmit({ ...formData, images });
  };

  const isFormEmpty = Object.values(formData).every((v) => !v.trim()) && images.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-sm">{field.label}</label>
              <FieldExample title={field.exampleTitle} content={field.exampleContent} />
            </div>

            {field.rows === 1 ? (
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border text-sm transition-colors outline-none
                  focus:border-[var(--color-orange)] focus:ring-2 focus:ring-[var(--color-orange-light)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder-[var(--color-ink-secondary)]"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: '#fff',
                }}
              />
            ) : (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={field.rows}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg border text-sm transition-colors resize-none outline-none
                  focus:border-[var(--color-orange)] focus:ring-2 focus:ring-[var(--color-orange-light)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder-[var(--color-ink-secondary)]"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: '#fff',
                }}
              />
            )}
          </div>
        ))}

        {/* 图片上传（可选） */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-sm">📷 买家晒图（可选，可多张）</label>
            <span className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
              上传买家在评价中晒的图片
            </span>
          </div>

          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`买家晒图 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: '#ef4444', color: '#fff' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all
              hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#fff',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-ink-secondary)',
            }}
          >
            <span>📁</span>
            <span>{imagePreviews.length > 0 ? `已选 ${imagePreviews.length} 张，点击添加` : '点击上传图片'}</span>
          </button>
        </div>

        {/* 提交按钮 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || isFormEmpty}
            className="w-full py-3.5 rounded-xl font-semibold text-base cursor-pointer transition-all
              hover:shadow-md active:scale-[0.99]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            style={{
              backgroundColor: 'var(--color-orange-deep)',
              color: '#fff',
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                正在生成回复…
              </span>
            ) : (
              '✨ 生成回复'
            )}
          </button>

          {!isLoading && (
            <p className="text-center text-xs mt-2" style={{ color: 'var(--color-ink-secondary)' }}>
              生成大约需要 30 秒，请耐心等待
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
