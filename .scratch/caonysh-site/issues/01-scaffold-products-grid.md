# 01: Astro 脚手架 + 占位 Product Config + 能渲染的 Products 页

**What to build:** 第一发 tracer bullet：初始化 Astro 项目，建立 Product Config（JSON）的 schema 与读取层，Products 页从配置读出商品并渲染成网格（图片、名称、价格）。包含 2~3 个占位商品 fixture 和占位图。完成后 `astro dev` 能起站，`astro build` 能出静态页，测试在构建产物 HTML 接缝上断言商品网格内容。

**Blocked by:** None (can start immediately)

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] Astro 项目初始化完成，`astro build` 产出静态 HTML
- [x] Product Config schema 定义了 Product 的名称、分类、图片、描述、价格、MOQ、Specs、featured 字段
- [x] 2~3 个占位商品（含占位图）可通过编辑 JSON 增删
- [x] Products 页渲染商品网格：每个商品显示图、名、价格
- [x] 两态价格：填了价格（精确值或区间，USD）显示价格，没填显示 "Contact for price"
- [x] 测试：在构建产物 HTML 上断言商品网格内容与价格两态渲染

## Comments

- [2026-10-10] Implemented via tracer bullet: 手写最小 Astro 项目（package.json + astro.config.mjs + src/pages），Product Config 为单一 JSON 数组 `src/content/products.json`（顺序即展示顺序，含 featured/无价格两态覆盖），Site Config 独立 `src/config/site.json`，Products 页 `/products/` 从配置渲染网格（图经 astro:assets 转 WebP、名、价格两态含 "Contact for price"）。关键文件：src/lib/products.ts、src/lib/images.ts、src/components/ProductCard.astro、src/pages/products/index.astro、src/content/products.json、src/config/site.json、test/products-grid.test.ts、test/global-setup.ts。测试命令：`npm test`。
