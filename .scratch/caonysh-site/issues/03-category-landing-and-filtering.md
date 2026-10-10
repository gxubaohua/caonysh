# 03: 分类落地页 + 空分类隐藏 + Products 页筛选

**What to build:** 每个 Category 拥有独立落地页（`/products/<category>/` 形式的 URL），渲染该分类的商品网格与可选介绍文案（SEO 着陆页）；Products 页提供分类筛选，点击进入对应分类视图；空分类在构建时被隐藏——不出现在导航、筛选条和路由中。

**Blocked by:** 01

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] 每个非空分类有独立 URL 的落地页，含该分类商品网格
- [x] 分类落地页渲染可选的 description 文案（配置了才显示）
- [x] Products 页有分类筛选，可切换查看各分类
- [x] 空分类不出现在任何导航、筛选或路由中
- [x] 分类落地页有针对分类的 title/description（SEO）
- [x] 测试：构建产物上断言分类路由存在、description 渲染、空分类不可见

## Comments

实现了 Category 落地页（`/products/<category-slug>/`，仅渲染本分类商品网格 + 可选 description + 分类专属 title/meta description）、Products 页分类筛选（每个非空分类一个链接入口）、空分类构建时隐藏（无路由、无筛选入口），以及"Product 引用未定义 category slug → 构建失败并点名商品"的校验。

**数据结构决定：**
- 新增 Category 实体配置 `src/content/categories.json`（JSON 数组：`slug`/`name`/可选 `description`），文件内顺序即展示顺序。Product 的 `category` 字符串继续引用 Category slug（保持工单 01 的既有形态，不引入嵌套）。
- 分类逻辑集中在 `src/lib/categories.ts`（`categories`/`nonEmptyCategories`/`productsInCategory`/`categoryBySlug`），空分类隐藏规则 = `nonEmptyCategories` 过滤器，筛选条与 `getStaticPaths` 共用。
- 构建校验集中在 `src/lib/validate-config.ts` 的 `validateProductConfig()`（在 `categories.ts` 模块加载时执行一次）。与工单 02 的"缺分类构建失败"方向兼容：02 的校验（缺图/缺 category 字段）可并入同一函数/文件，汇合时无逻辑冲突。
- 空分类采用"留在正式 fixture 里钉住行为"的方式：`rotary-seals` 是正式 fixture 中的空分类（有配置、无商品），测试长期断言其无路由（dist 无目录）且不出现在筛选中。
- fixture 增加了第 3 个非空分类 `gaskets` 及商品 `nitrile-rubber-gasket`（1 图，复用占位 PNG 生成脚本）。

**关键文件：**
- `src/content/categories.json` — Category Config
- `src/lib/categories.ts` — 分类领域层（含空分类过滤）
- `src/lib/validate-config.ts` — 构建时配置校验（与 02 合并点）
- `src/pages/products/[category].astro` — 分类落地页
- `src/pages/products/index.astro` — Products 页筛选条
- `test/category-landing.test.ts`、`test/category-filter.test.ts`、`test/category-validation.test.ts` — 构建产物接缝测试
