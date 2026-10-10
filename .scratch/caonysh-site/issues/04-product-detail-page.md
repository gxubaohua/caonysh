# 04: 商品详情页（图廊、MOQ、Specs、两态价格、Inquiry 预填）

**What to build:** 商品详情页：多图画廊（每商品 3~8 张图）、描述、两态价格（精确值/区间，或 "Contact for price"）、MOQ（配置了才显示）、Specs 键值参数表（键值自由定义）、Inquiry 按钮链接到 Contact 页并携带商品名（Inquiry Prefill）。

**Blocked by:** 01

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] 商品详情页有多图画廊可切换查看
- [x] 价格两态渲染：填了显示精确值/区间，没填显示 "Contact for price"
- [x] MOQ 配置了才显示
- [x] Specs 表渲染自由键值对
- [x] Inquiry 按钮链接到 Contact 页并携带商品名 query 参数
- [x] 商品详情页有针对商品的 title/description（SEO）
- [x] 测试：构建产物上断言图廊、价格两态、MOQ 有无、Specs 表、Inquiry 链接的 query 参数

## Comments

商品详情页落地：多图画廊（CSS-only radio 切换，零 JS）、描述、两态价格（复用 `formatPrice`）、MOQ 按配置显示、Specs 键值表、Inquiry Prefill 链接（`/contact?product=<商品名>`）、商品专属 title/meta description。fixture 商品补齐 3~4 张占位图与 specs 数据。

**详情页 URL 形态决定：`/products/item/<slug>/`**。理由：GLOSSARY 钉死分类落地页为 `/products/<category-slug>/`，若用 `/products/<category>/<slug>/` 则详情页 URL 依赖分类 slug，商品换分类会破坏外链（Google 已收录的详情 URL 失效）；`/products/item/<slug>/` 与分类路由零冲突，商品 slug 全局唯一，URL 稳定不随分类变化。

关键文件：`src/pages/products/item/[slug].astro`（详情页路由）、`src/components/ProductGallery.astro`（图廊）、`src/components/SpecTable.astro`（Specs 表）、`scripts/generate-placeholder-images.mjs`（图廊占位图变体生成）、`src/content/products.json`（fixture 多图+specs）、`test/product-detail.test.ts`（11 个用例）。
