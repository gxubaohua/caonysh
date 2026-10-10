# 05: 布局壳 + Home + About

**What to build:** 全站统一布局：响应式导航（桌面横向、移动端可展开）、页脚（公司名 Caonysh、邮箱 service@caonysh.com、版权行）；Home 页含公司卖点区、Featured Product 精选区（按 JSON 文件顺序）；About 页占位文案。每页（含既有页面）套用布局壳并获得各自的 title/description。

**Blocked by:** 01

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] 统一布局：导航在移动端可用（汉堡菜单或等价方案）
- [x] 页脚展示公司名与邮箱
- [x] Home 页展示 Featured Product（按 Product Config 文件顺序），无精选商品时该区不渲染
- [x] About 页渲染占位公司介绍
- [x] 全站每个页面有各自的 title 与 meta description
- [x] 测试：构建产物上断言导航链接、页脚联系方式、精选区顺序与 title/description

## Comments

一行摘要：新增 `src/layouts/BaseLayout.astro` 统一布局壳（响应式导航 + Site Config 驱动页脚 + title/description props），Home 页重写为卖点区 + Featured Product 精选区（复用 ProductCard，无精选不渲染），新增 About 页；index/products 两页套壳。

导航 Contact 链接处理方式：导航四链全放（含 `/contact/`），Contact 页面属工单 06，当前链接 404 是预期——集成 06 后自然补齐，避免布局合入后还要改导航。理由：BaseLayout 的职责是稳定壳，Contact 路由必然存在（spec 用户故事 34），提前放链接不引入额外维护点。

测试接缝仍为构建产物 HTML（`test/layout.test.ts`、`test/home-featured.test.ts`、`test/about.test.ts`）。「无精选不渲染」分支用 fixture 替换型测试（`test/fixtures/products-none-featured.json`，git 恢复，工单 02 模式）；因本机构建一次约 2~5 分钟，`test/global-setup.ts` 会把 committed 配置的 dist/index.html 快照到 `test/baseline-dist/` 供该测试结束后快速还原 dist（避免二次全量重建）。

关键文件：`src/layouts/BaseLayout.astro`、`src/pages/index.astro`、`src/pages/about.astro`、`src/pages/products/index.astro`、`test/global-setup.ts`、`test/layout.test.ts`、`test/home-featured.test.ts`、`test/about.test.ts`、`test/fixtures/products-none-featured.json`。
