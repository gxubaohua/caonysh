# 06: Contact 页 + Web3Forms 询盘表单

**What to build:** Contact 页：询盘表单（name/email/message 必填，country/company 可选，无电话字段）提交到 Web3Forms；hidden access key 字段经环境变量注入，不硬编码进仓库；读取 URL query 预填商品名（Inquiry Prefill，来自商品详情页的 Inquiry 按钮）；提交后有明确的成功与失败状态；页面同时展示 service@caonysh.com 供直接邮件联系。Country 下拉为可选字段。

**Blocked by:** 04（Inquiry 预填链接的接收端）、05（布局壳）

**Status:** resolved

完整上下文（用户故事、测试决策、Out of Scope）见本 feature 目录下的 `../spec.md`。

- [x] 表单五字段：name/email/message 必填，country/company 可选
- [x] 表单提交到 Web3Forms endpoint，hidden access key 经环境变量/构建配置注入
- [x] URL query 携带商品名时，表单预填该商品名上下文
- [x] 提交成功显示成功状态；提交失败显示错误与重试提示
- [x] 页面展示 service@caonysh.com
- [x] 测试：构建产物上断言表单字段标记、hidden key 字段存在、预填脚本行为（不测 Web3Forms 实际网络提交）

## Comments

- 实现摘要：`src/pages/contact.astro` 套 BaseLayout 新增 `/contact/`；Inquiry 表单五字段（name/email/message 必填、country select 常用国家+空默认、company 文本、无电话），action 指向 `https://api.web3forms.com/submit`，hidden `access_key` 经 `import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY`（缺省空串，构建不失败）注入；`.env.example` 新增该变量说明。成功/失败为页面内 `hidden` 面板，由内联 fetch 提交脚本切换 DOM（零框架，脚本不可用时表单仍原生提交）。`service@caonysh.com` 在正文与错误兜底处均可见（读 Site Config）。
- 预填实现方式决定：Inquiry Prefill 写入 message textarea 初始内容（"Inquiry about: X\n"），不设只读上下文字段——按 GLOSSARY "表单的初始内容，不是必填约束"，买家可自由改写；内联脚本读 `location.search` 的 `product` 参数并 `decodeURIComponent`（含 decode 失败兜底）。
- 测试：`test/contact.test.ts`（11 例）全部在构建产物 HTML 接缝上断言——字段/required/无 tel、form action、hidden access_key、正文邮箱、预填脚本与提交脚本在 HTML 中存在、成功/失败面板标记。不测网络提交。
- 关键文件：`src/pages/contact.astro`、`test/contact.test.ts`、`.env.example`。
- 收尾时发现的测试基建问题（一并修复）：新增第 12 个测试文件改变了 vitest 的文件执行顺序，暴露工单 05 遗留的顺序依赖——`test/home-featured.test.ts` 的 fixture 构建写进共享 `dist/` 且只恢复 `index.html`（快照恢复机制不完整，gaskets 落地页等页面被清掉）。已按工单 02 的隔离 outDir 模式重写该测试并删除废弃的 `test/baseline-dist/` 快照，修复提交 a55f038。
