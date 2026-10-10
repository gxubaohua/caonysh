# Coding Standards

Read during code review, not implementation. 评审时逐条执行。

## 测试

- **唯一接缝是构建产物 HTML**：测试通过 fixture 配置输入，断言渲染出的页面标记（内容、链接、meta）。只在构建产物上断言可见行为。
- **不断言实现细节**：不测组件内部结构、辅助函数、私有模块导出。
- 完整测试决策（含"明确不测"清单）见 `.scratch/caonysh-site/spec.md` 的 Testing Decisions 一节。

## 领域词汇

- 代码、测试名、提交信息中的领域概念使用 `GLOSSARY.md` 定义的术语（Product、Category、Inquiry、MOQ、Spec 等），不用词汇表标注的 Avoid 词。

## 架构约束

- 与改动区域相关的 ADR（`docs/adr/`）冲突时显式标注，不得静默绕过。
