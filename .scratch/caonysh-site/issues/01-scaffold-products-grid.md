# 01: Astro 脚手架 + 占位 Product Config + 能渲染的 Products 页

**What to build:** 第一发 tracer bullet：初始化 Astro 项目，建立 Product Config（JSON）的 schema 与读取层，Products 页从配置读出商品并渲染成网格（图片、名称、价格）。包含 2~3 个占位商品 fixture 和占位图。完成后 `astro dev` 能起站，`astro build` 能出静态页，测试在构建产物 HTML 接缝上断言商品网格内容。

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Astro 项目初始化完成，`astro build` 产出静态 HTML
- [ ] Product Config schema 定义了 Product 的名称、分类、图片、描述、价格、MOQ、Specs、featured 字段
- [ ] 2~3 个占位商品（含占位图）可通过编辑 JSON 增删
- [ ] Products 页渲染商品网格：每个商品显示图、名、价格
- [ ] 两态价格：填了价格（精确值或区间，USD）显示价格，没填显示 "Contact for price"
- [ ] 测试：在构建产物 HTML 上断言商品网格内容与价格两态渲染
