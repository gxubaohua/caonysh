# 静态 JSON 配置作为商品数据源，不引入后端

商品信息（Product Config）以 JSON 文件形式存放在仓库内，由 Astro 在构建时注入生成纯静态 HTML，通过 GitHub Actions 在 push 后自动重建部署。我们刻意拒绝了"网页管理界面 + localStorage"（修改只有本机可见）和"BaaS 服务"（引入隐性后端依赖与成本）。代价是商品更新需要编辑文件并 push，维护者已确认接受。
