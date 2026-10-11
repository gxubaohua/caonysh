# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Caonysh 外贸询盘站

面向海外买家的 B2B 商品展示与询盘网站。纯静态：Astro 在构建时从仓库内 JSON 配置注入商品内容，询盘经 Web3Forms 转发到邮箱，push 到 main 后由 GitHub Actions 自动重建并部署到 GitHub Pages。无后端、无数据库、无账户体系。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器（热重载，localhost:4321） |
| `npm run build` | 生产构建到 `dist/` |
| `npm test` | 全部测试 |
| `npx vitest run test/home.test.ts` | 单个测试文件 |
| `npm run typecheck` | `astro check` |

测试运行方式的隐含约定：

- 任何 vitest 调用（含单文件）都会先经 `test/global-setup.ts` 完整构建站点到 `dist/`，再对构建出的 HTML 断言——慢是设计使然，测试接缝只有构建产物。
- `vitest.config.ts` 关闭了 `fileParallelism`（fixture 测试替换 `src/content/*.json` 并重建到共享 `dist-fixture/`，并行会竞争）。同理，跑测试前先提交对 `src/content/*.json` 的修改：fixture 恢复用 `git checkout --`，会丢弃未提交内容。

## 架构

数据流单向，全部发生在构建期：

`src/content/*.json`（Product / Category Config，唯一内容入口）→ `src/lib/` 读取层（`products.ts`、`categories.ts`、`images.ts`）→ `src/pages/` + `src/layouts/BaseLayout.astro` 渲染 → 静态 HTML。页面上没有任何运行时数据获取。

需要跨多个文件阅读才能看出的横切规则：

- **校验发生在模块加载**：`src/lib/validate-config.ts` 是唯一的共享校验入口，由 `products.ts` 在模块加载时触发——商品缺图、图片路径拼写错、引用未定义分类、分类 slug 撞上保留段 `p`，都会让构建失败并点名问题条目。新的校验规则加在这个文件。import 保持无环：它只读原始 JSON 与 `lib/images.ts`，不 import 读取层。
- **测试接缝只有构建产物 HTML**：断言渲染出的标记（内容、链接、meta），不测组件内部结构与辅助函数。"换入 fixture 配置 → 重建到 `dist-fixture/` → 断言 → 恢复提交版配置"已封装为 `test/helpers.ts` 的 `withProductsFixture` / `withCategoriesFixture`，新测试直接复用。
- **部署 base 前缀**：站点挂在 `https://johoka.github.io/caonysh/`，`astro:assets` 的 URL 自动带 base，但模板里手写的 `href` 一律经 `src/lib/site-path.ts` 的 `sitePath()`——直接写 `/products/` 在本地 dev 正常、部署后 404。
- **展示顺序 = 配置文件内数组顺序**：商品、精选（featured）、分类都按文件顺序渲染，没有 order 字段，读取层不做重排。
- **价格两态**：`price: { min, max? }` 或空（null 与缺键等价）→ 渲染 "Contact for price"。展示统一走 `products.ts` 的 `formatPrice()`。
- **路由**：`/products/<category-slug>/` 分类落地页（空分类构建时整体隐藏：无路由、无筛选入口）；`/products/p/<slug>/` 商品详情页，`p` 为保留段。
- **零 JS、无 CSS 框架**：交互用纯 CSS（移动端导航是 checkbox hack），样式是 `BaseLayout.astro` 里的全局 CSS 变量体系。
- **Web3Forms 密钥**：Contact 表单的 access key 构建时从环境变量 `PUBLIC_WEB3FORMS_ACCESS_KEY` 注入（本地留空也能构建和测试；线上值放 GitHub Actions secret）。站点不持久化任何询盘。

## 配置入口

- 商品更新 = 编辑 `src/content/products.json`（或 `categories.json`）→ push 到 main，即自动部署生效。图片提交在 `src/assets/`，以相对 `src/content/` 的路径（`../assets/foo.png`）引用，构建时压成 WebP。
- `src/config/site.json` — 公司名、联系邮箱、分析 ID 预留槽（null 即不装脚本）。
- `astro.config.mjs` — `site` / `base` 指向 Pages 项目 URL；换域名改这里。

## 代码评审

评审改动时逐条执行 `CODING_STANDARDS.md`（测试接缝规则、GLOSSARY 领域词汇、ADR 冲突显式标注）。

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage labels (`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the repo root, ADRs in `docs/adr/`. See `docs/agents/domain.md`.
