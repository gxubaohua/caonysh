# Spec: Caonysh 外贸询盘站

**Status:** ready-for-agent

## Problem Statement

Caonysh 需要一个面向海外买家的线上门面，让客户能发现商品、了解规格与价格、并发出购买意向。当前没有任何网站：客户无从了解公司卖什么、价格如何、如何联系。同时维护者不想为此运行或编写任何后端服务。

## Solution

一个纯静态的 B2B 询盘站：商品以图片、描述、价格、MOQ、规格表的形式展示在五个页面（Home、Products、分类落地页、商品详情、About、Contact）；买家通过 Contact 页表单发出 Inquiry，由 Web3Forms 转发到 service@caonysh.com；商品更新通过编辑仓库内的 Product Config（JSON）并 push 完成，GitHub Actions 自动重建部署到 GitHub Pages。站点英文单语、现代简洁风、移动端响应式、SEO 友好。

## User Stories

### 访客浏览

1. As a Visitor, I want to see a Home page with featured products and company selling points, so that I can quickly understand what Caonysh offers
2. As a Visitor, I want to browse all products in a grid, so that I can see the full catalog at a glance
3. As a Visitor, I want to filter products by Category, so that I can find the type of product I'm interested in
4. As a Visitor, I want to open a Category landing page with its own URL and intro copy, so that I can land from a Google search directly onto relevant products
5. As a Visitor, I want to click a product to see its gallery, description, price, MOQ and spec table, so that I can evaluate whether to inquire
6. As a Visitor, I want to swipe through multiple product photos, so that I can inspect the product visually
7. As a Visitor, I want to see prices in USD as an exact value or a range, so that I can budget my order
8. As a Visitor, I want to see "Contact for price" when a product has no listed price, so that I know the next step is to inquire
9. As a Visitor, I want to see the MOQ on products that declare one, so that I know the minimum viable order
10. As a Visitor, I want to read a spec table with custom key-value pairs, so that I can compare technical details
11. As a Visitor, I want the site to work well on my phone, so that I can browse anywhere
12. As a Visitor, I want pages to load fast, so that I don't abandon the site
13. As a Visitor, I want each page to have a meaningful title and description, so that search results tell me what the page is about

### 询盘

14. As a Visitor, I want an Inquiry form with name, email and message as required fields, so that I can express my purchase intent
15. As a Visitor, I want to optionally include my country and company name, so that the seller can understand my market
16. As a Visitor, I want a clear success state after submitting the form, so that I know my inquiry was sent
17. As a Visitor, I want a clear error state if submission fails, so that I can retry or fall back to email
18. As a Visitor, I want to click "Send Inquiry" on a product page and land on the Contact form with the product name prefilled, so that I don't have to retype what I'm asking about
19. As a Visitor, I want to see the company email (service@caonysh.com) on the Contact page, so that I can email directly if I prefer
20. As a Visitor, I do not want to be asked for my phone number, so that the form stays low-friction

### 维护者配置

21. As a maintainer, I want to add a product by editing the Product Config JSON and pushing, so that it appears on the site without any backend
22. As a maintainer, I want to edit a product's images, name, description, price, MOQ and specs in the same JSON, so that all product data lives in one place
23. As a maintainer, I want the order of products in the JSON file to be the order they appear on the page, so that reordering is just moving lines around
24. As a maintainer, I want to mark products as featured so they appear on the Home page, in JSON order
25. As a maintainer, I want to leave the price empty to show "Contact for price", so that not listing a price is the default, not a special flag
26. As a maintainer, I want each Category to have its own URL and optional intro copy, so that Google can index category-level landing pages
27. As a maintainer, I want the build to fail with a clear error naming the offending product when a product is missing images or a category, so that bad config never reaches production
28. As a maintainer, I want empty categories to be hidden from navigation and routing, so that there are no dead-end pages
29. As a maintainer, I want company-level info (name, email, future analytics ID) in a separate Site Config, so that it's not tangled with product data
30. As a maintainer, I want to edit config via the GitHub web interface, so that I can update products without a local dev environment
31. As a maintainer, I want images committed to the repo and automatically compressed to WebP at build time, so that I don't manage a separate image CDN
32. As a maintainer, I want pushes to main to deploy automatically via GitHub Actions, so that shipping an update is just a push

### 公司展示

33. As a Visitor, I want an About Us page introducing the company, so that I can judge trustworthiness
34. As a Visitor, I want a Contact page with the inquiry form and company email, so that I know how to reach the seller

## Implementation Decisions

- **框架**：Astro，零 JS 默认、构建时注入数据的纯静态生成。无 SPA 框架（ADR-0001）。
- **数据层**：Product Config 与 Site Config 为仓库内的 JSON（或 Astro Content Collections 等价物），是商品的唯一事实来源（ADR-0001）。
- **价格模型**：两态——填了价格（精确值或区间，USD）或没填（渲染 "Contact for price"）。无显式询价标志（ADR-0004）。
- **分类**：每个 Category 有独立落地页 URL 与可选 description；Product 恰好归属一个 Category；空分类构建时隐藏（ADR-0004）。
- **排序**：Product Config 文件内排列顺序即页面展示顺序（列表页、Home 精选区皆然），无 order 字段（ADR-0004）。
- **构建校验**：商品缺图或缺分类 → 构建失败，错误信息点名商品（ADR-0004）。
- **询盘**：Contact 表单提交到 Web3Forms（hidden access key 字段），转发到 service@caonysh.com；站点不持久化任何 Inquiry（ADR-0003）。access key 经环境变量/构建配置注入，不硬编码进仓库。
- **询盘预填**：商品详情页 Inquiry 按钮链接到 Contact 页并携带商品名 query 参数，表单读取后预填（ADR-0003、GLOSSARY: Inquiry Prefill）。
- **表单字段**：name/email/message 必填；country/company 可选；无电话字段。
- **页面结构**：Home、Products（筛选+网格）、Category 落地页、Product 详情、About、Contact，共六种路由（五页共识 + 分类落地页，Q23）。
- **设计**：现代简洁风（大图、留白、卡片式网格），响应式，Logo/文案占位，公司名 Caonysh、邮箱 service@caonysh.com 为真实值。
- **部署**：GitHub Pages + GitHub Actions，push 到 main 自动构建部署（ADR-0001）。域名先用 Pages 默认 URL，自有域名后补。
- **分析**：Site Config 预留分析 ID 配置位，默认不装。
- **图片**：图片文件入仓库，构建时 Astro 自动压缩转 WebP。
- **语言**：英文单语站点。

## Testing Decisions

- **唯一接缝：构建产物 HTML**。输入 Product Config fixture，断言渲染出的页面标记。测外部行为（页面里有什么），不测实现细节（组件内部结构、辅助函数）。
- 测试在该接缝上覆盖：价格两态渲染、排序=文件顺序、构建校验失败（错误点名商品）、空分类隐藏、询盘预填链接与表单字段标记、每页 title/description。
- 构建校验测试属于"断言失败"类：喂无效 fixture，期望 build 拒绝并输出可定位的错误信息。
- 不测：Web3Forms 实际网络提交（外部服务，只断言表单标记正确）；视觉样式与响应式（人工验收）。
- 实现载体在工单阶段决定：Astro Container API 进程内渲染（快，单测）与整站 build 冒烟（慢，验证校验与路由）可并用。
- **Prior art**：无——绿地项目，本 spec 建立测试先例。

## Out of Scope

- 购物车、下单、在线支付、账户体系（ADR-0002）
- 多语言（数据结构预留心智空间，但不实现）
- 博客/News 页面
- WhatsApp 集成
- 自有域名绑定（上线后后补）
- 分析工具接入（仅预留配置位）
- 后端服务、数据库、BaaS（ADR-0001）
- 真实商品图片与最终文案（开发期用占位内容）

## Further Notes

- 领域词汇以 `GLOSSARY.md` 为准（Product/Category/Price Strategy/MOQ/Spec/Inquiry/Inquiry Prefill/Product Config/Site Config/Visitor/Featured Product/Deploy）。
- 相关 ADR：0001（静态 JSON 数据源）、0002（询盘站形态）、0003（Web3Forms 转发）、0004（构建校验与排序）。
- 上线前置的人类操作（建 GitHub 仓库、开 Pages、生成 Web3Forms access key）由 `/wizard` 阶段处理，不在本 spec 的工单内。
- 商品规模假设：几十个商品 / 3~6 个分类 / 每商品 3~8 张图。

## Comments

- 评审修复完成（2026-10-11，分支 `ticket/review-fixes`）：修复项 1 ProductCard 可点击进详情页、2 详情页 URL `item`→`p`（Avoid 词违规）、3 分类落地页与详情页套 BaseLayout、4 price 键缺失走两态、5 Site Config 预留分析 ID 配置位、6 测试 fixture 替换逻辑收拢进 test/helpers.ts、7 两态价格字面量收拢进 formatPrice、8 validate-config 汇成单一校验入口并消除循环 import、9 images 路径存在性校验（错误点名商品）。
