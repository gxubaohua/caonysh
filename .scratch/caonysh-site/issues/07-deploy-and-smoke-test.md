# 07: GitHub Actions 部署 + 整站冒烟测试

**What to build:** push 到 main 时 GitHub Actions 自动构建并部署到 GitHub Pages（workflow 文件交付即完成，实际推送到远端仓库与 Pages 开通属 /wizard 阶段的人类操作）；整站冒烟测试：一次 build 断言全部路由可生成、构建校验通过、产物结构完整。

**Blocked by:** 01、02、03、04、05、06

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] GitHub Actions workflow：push 到 main 自动 build + 部署 Pages
- [x] workflow 在每次 push 和 PR 上运行 typecheck 与测试；部署 job 仅在 main 分支上追加执行
- [x] workflow 中 Web3Forms access key 以 GitHub Secrets 注入，不出现在仓库明文
- [x] 整站冒烟测试：全部路由（Home/Products/分类/详情/About/Contact）build 成功且产物存在
- [x] README 简述本地开发、测试、部署三条命令

## Comments

一行摘要：交付 `.github/workflows/deploy.yml`（verify job + main-only deploy job）、整站冒烟测试 `test/smoke.test.ts`（15 例）、README，并让全站内部链接携带 GitHub Pages base 路径。

**Workflow 方案**（手写版，弃 `withastro/action`，取透明可控）：verify job 在每次 push/PR 跑 `npm ci` → `npm run typecheck`（`astro check`，新增 `@astrojs/check` + `typescript` devDeps 与 npm script，顺手修了 ProductGallery 的 7 个 pre-existing 隐式 any 错误）→ `npm test`；deploy job `needs: verify` 且 `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`，手写 `actions/checkout@v5` + `actions/setup-node@v5`（`node-version-file: .nvmrc`，新增）+ `npm run build` + `actions/upload-pages-artifact@v4` + `actions/deploy-pages@v4`。workflow 顶部 `permissions: contents: read, pages: write, id-token: write`。`WEB3FORMS_ACCESS_KEY` secret 以 env `PUBLIC_WEB3FORMS_ACCESS_KEY` 注入 build（ADR-0003，密钥不落仓库）；CI 的 verify 阶段刻意不注入——空串不失败是工单 06 的既有保证。

**GitHub Pages base 路径决策**（显式记录，工单要求）：项目页 URL 是 `https://johoka.github.io/caonysh/`，故 `astro.config.mjs` 配 `site: 'https://johoka.github.io'` + `base: '/caonysh/'`。确认了 Astro 只对 astro:assets 自动加 base、不重写手写 `<a href>`，且 `astro:config/server` 在纯静态 prerender 渲染时 base 读到 `'/'`（manifest 注入时序问题），最终用 `import.meta.env.BASE_URL`（Vite 编译期注入解析后的 base，dev 下 `/`、build 下 `/caonysh/`，两态都对）。全站 6 个模板的内部链接统一走新 helper `src/lib/site-path.ts` 的 `sitePath()`，含 `/contact?product=` Inquiry Prefill 链接。受影响的 4 个既有测试（layout/home/category-filter/product-detail 的 href 断言）改为经 `test/site-base.ts` 共享常量 `SITE_BASE = '/caonysh/'` 前缀断言——保持断言语义（"链接指向该页面"），只适配 deploy base 这一新事实；测试数量不变（原 67 例全绿，加 smoke 15 例共 82 例）。

冒烟测试内容：`test/smoke.test.ts` 用 global-setup 的一次 build，系统性断言全部 11 条路由（Home/Products/3 分类/4 详情/About/Contact）产物存在、doctype、title 非空、各自内容标记、空分类 `rotary-seals` 无路由，以及 deploy 接缝：每页所有根绝对 href/src 都带 base 前缀、详情页 Inquiry Prefill 链接在 base 下保留 query。

关键文件：`.github/workflows/deploy.yml`、`astro.config.mjs`、`src/lib/site-path.ts`、`test/smoke.test.ts`、`test/site-base.ts`、`README.md`、`.nvmrc`、`package.json`（typecheck script）。**未做的 /wizard 人类操作**：push 到远端、开通 Pages（Settings > Pages > Source: GitHub Actions）、配置 `WEB3FORMS_ACCESS_KEY` secret。
