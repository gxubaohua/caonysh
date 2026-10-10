# 05: 布局壳 + Home + About

**What to build:** 全站统一布局：响应式导航（桌面横向、移动端可展开）、页脚（公司名 Caonysh、邮箱 service@caonysh.com、版权行）；Home 页含公司卖点区、Featured Product 精选区（按 JSON 文件顺序）；About 页占位文案。每页（含既有页面）套用布局壳并获得各自的 title/description。

**Blocked by:** 01

**Status:** ready-for-agent

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [ ] 统一布局：导航在移动端可用（汉堡菜单或等价方案）
- [ ] 页脚展示公司名与邮箱
- [ ] Home 页展示 Featured Product（按 Product Config 文件顺序），无精选商品时该区不渲染
- [ ] About 页渲染占位公司介绍
- [ ] 全站每个页面有各自的 title 与 meta description
- [ ] 测试：构建产物上断言导航链接、页脚联系方式、精选区顺序与 title/description
