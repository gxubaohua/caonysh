# 07: GitHub Actions 部署 + 整站冒烟测试

**What to build:** push 到 main 时 GitHub Actions 自动构建并部署到 GitHub Pages（workflow 文件交付即完成，实际推送到远端仓库与 Pages 开通属 /wizard 阶段的人类操作）；整站冒烟测试：一次 build 断言全部路由可生成、构建校验通过、产物结构完整。

**Blocked by:** 01、02、03、04、05、06

**Status:** ready-for-agent

- [ ] GitHub Actions workflow：push 到 main 自动 build + 部署 Pages
- [ ] workflow 中 Web3Forms access key 以 GitHub Secrets 注入，不出现在仓库明文
- [ ] 整站冒烟测试：全部路由（Home/Products/分类/详情/About/Contact）build 成功且产物存在
- [ ] README 简述本地开发、测试、部署三条命令
