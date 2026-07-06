# 项目记忆

> Breview Reply — 电商差评 AI 回复生成器（前端项目）
> 每次会话开始时优先读取。

---

## 项目是什么

**Breview Reply** 是一个帮助淘宝/拼多多/抖音卖家快速生成差评回复的网页工具。

卖家输入差评内容 + 商品信息 → 调用 Coze AI 工作流 → 生成 3 版回复（真诚/专业/温暖）→ 一键复制使用。

一句话：**让卖家 30 秒写出专业差评回复，不用自己费脑子。**

---

## 我在这个项目中的角色

我是**网页开发负责人**，负责从零搭建整个前端项目。

我的工作方式：
1. 每次生成代码前，先和项目主理人完整讨论方案
2. 先确定前端风格，再动手写代码
3. 用通俗语言沟通，不抛专业术语
4. 时不时更新 memory.md / 日志.md / 工作记录.md / Claude.md

---

## 技术选型

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | React + Vite | 生态好，部署简单 |
| 样式 | Tailwind CSS | 写样式快，暗色模式方便 |
| 状态管理 | useState | 单页表单，够用 |
| 请求 | fetch | 就一个 POST 接口 |
| 部署 | Vercel | 免费、自动 HTTPS |

---

## 前端风格（已确认 ✅）

| 特点 | 说明 |
|------|------|
| 整体风格 | Notion 简约风，大量留白，小圆角，emoji 图标 |
| 主配色 | 淡橘黄 + 白色（温暖但不刺眼） |
| 点缀色 | 淡蓝色（链接、按钮等） |
| 暗色模式 | 先不做 |
| 字体 | 系统默认无衬线字体 |

---

## 后端（已就绪，不需要我管）

后端是 Coze 工作流，已发布为 API：

```
POST https://api.coze.cn/v1/workflow/run
Authorization: Bearer <token>

参数：review_text, product_category, product_info, return_policy, review_images
返回：sincere_reply, professional_reply, warm_reply, category, compliance_pass
```

---

## 项目主理人

- 大二学生，前后端小白
- 暑期全职投入创业
- 目标：2 个月赚 ¥10,000
- 沟通方式：非技术语言，多讨论少假设

---

*创建日期：2026-07-05*
