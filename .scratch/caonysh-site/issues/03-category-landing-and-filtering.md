# 03: 分类落地页 + 空分类隐藏 + Products 页筛选

**What to build:** 每个 Category 拥有独立落地页（`/products/<category>/` 形式的 URL），渲染该分类的商品网格与可选介绍文案（SEO 着陆页）；Products 页提供分类筛选，点击进入对应分类视图；空分类在构建时被隐藏——不出现在导航、筛选条和路由中。

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] 每个非空分类有独立 URL 的落地页，含该分类商品网格
- [ ] 分类落地页渲染可选的 description 文案（配置了才显示）
- [ ] Products 页有分类筛选，可切换查看各分类
- [ ] 空分类不出现在任何导航、筛选或路由中
- [ ] 分类落地页有针对分类的 title/description（SEO）
- [ ] 测试：构建产物上断言分类路由存在、description 渲染、空分类不可见
