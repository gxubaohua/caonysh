# 02: 构建校验与排序

**What to build:** 让坏配置永远到不了线上：Product 缺图或缺分类时构建直接失败，错误信息点名商品（如 "Product 'X' is missing images"）；商品在页面上的展示顺序等于 Product Config JSON 文件内的排列顺序（无 order 字段）。

**Blocked by:** 01

**Status:** ready-for-agent

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [ ] 缺图的商品导致构建失败，错误信息含商品名
- [ ] 缺分类的商品导致构建失败，错误信息含商品名
- [ ] fixture 内故意乱序排列时，渲染出的商品顺序与文件顺序一致
- [ ] 测试：喂无效 fixture 断言构建拒绝并输出可定位的错误；喂乱序 fixture 断言渲染顺序
