# 02: 构建校验与排序

**What to build:** 让坏配置永远到不了线上：Product 缺图或缺分类时构建直接失败，错误信息点名商品（如 "Product 'X' is missing images"）；商品在页面上的展示顺序等于 Product Config JSON 文件内的排列顺序（无 order 字段）。

**Blocked by:** 01

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] 缺图的商品导致构建失败，错误信息含商品名
- [x] 缺分类的商品导致构建失败，错误信息含商品名
- [x] fixture 内故意乱序排列时，渲染出的商品顺序与文件顺序一致
- [x] 测试：喂无效 fixture 断言构建拒绝并输出可定位的错误；喂乱序 fixture 断言渲染顺序

## Comments

Product Config 构建校验落在读取层（`src/lib/products.ts` 顶层 `validateProducts`）：缺图或缺分类在模块加载时抛错，`astro build` 以非零退出并点名商品（"Product 'X' is missing images / is missing a category"）；渲染顺序显式钉在 Product Config 数组顺序（无排序逻辑，无 order 字段）。测试在构建进程/构建产物 HTML 接缝上：`test/build-validation.test.ts`（坏 fixture 复制替换 + 子进程 build + 断言退出与错误信息，`finally`/`git checkout` 恢复）、`test/product-order.test.ts`（乱序 fixture 整体替换 + 断言 HTML 首次出现位置等于文件顺序，变异验证过排序测试能抓按名重排）。fixture 构建输出隔离在 `dist-fixture/`（已 gitignore）；vitest `fileParallelism: false` 避免 fixture 测试并发竞态。关键文件：`src/lib/products.ts`、`test/build-validation.test.ts`、`test/product-order.test.ts`、`test/fixtures/*.json`、`vitest.config.ts`。
