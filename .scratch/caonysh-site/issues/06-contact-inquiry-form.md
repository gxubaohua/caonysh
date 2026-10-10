# 06: Contact 页 + Web3Forms 询盘表单

**What to build:** Contact 页：询盘表单（name/email/message 必填，country/company 可选，无电话字段）提交到 Web3Forms；hidden access key 字段经环境变量注入，不硬编码进仓库；读取 URL query 预填商品名（Inquiry Prefill，来自商品详情页的 Inquiry 按钮）；提交后有明确的成功与失败状态；页面同时展示 service@caonysh.com 供直接邮件联系。Country 下拉为可选字段。

**Blocked by:** 04（Inquiry 预填链接的接收端）、05（布局壳）

**Status:** ready-for-agent

- [ ] 表单五字段：name/email/message 必填，country/company 可选
- [ ] 表单提交到 Web3Forms endpoint，hidden access key 经环境变量/构建配置注入
- [ ] URL query 携带商品名时，表单预填该商品名上下文
- [ ] 提交成功显示成功状态；提交失败显示错误与重试提示
- [ ] 页面展示 service@caonysh.com
- [ ] 测试：构建产物上断言表单字段标记、hidden key 字段存在、预填脚本行为（不测 Web3Forms 实际网络提交）
