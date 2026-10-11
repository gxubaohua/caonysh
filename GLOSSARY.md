# Caonysh 外贸询盘站

面向海外买家的 B2B 商品展示与询盘网站。纯静态（Astro 构建时注入数据），商品内容来自仓库内的 JSON 配置文件，询盘通过第三方表单服务转发到邮箱。

## Language

### 商品目录

**Product（商品）**:
一个可被海外买家询价的最小销售单元，由图片、名称、描述、价格策略、MOQ 和规格构成。整个网站围绕它组织。同一 Amazon listing 的每个颜色/型号变体各算一个 Product（ADR-0006）。
_Avoid_: Item, goods, SKU（SKU 暗示库存管理，本站没有）

**Category（分类）**:
一组同类商品的命名集合，拥有独立落地页（`/products/<slug>/`）和一段可选的介绍文案，用于 Google 收录。每个 Product 恰好归属一个 Category；构建时空分类自动隐藏。
_Avoid_: Collection, tag（tag 暗示多对多，本站是严格的单归属）

**Price Strategy（价格策略）**:
单个 Product 的定价表达方式，两态：填了价格（精确值 $1.20 或区间 $1.20–$1.50）或没填（页面显示 "Contact for price"）。不填即询价，无第三种显式声明。
_Avoid_: Price tier, pricing, contact-for-price flag

**MOQ（最小起订量）**:
买家为达成交易至少需要订购的数量，外贸 B2B 标配字段。可选填，不填则不在页面展示。
_Avoid_: Minimum order, batch size

**Spec（规格）**:
商品详情页参数表中的一行自定义键值对（如 Material: PP）。Specs 的键和值都由配置者自由定义，没有固定 schema。
_Avoid_: Attribute, parameter, feature

**Featured Product（精选商品）**:
被标记为在 Home 页展示的 Product。一个商品可以既是精选又属于某分类，精选不改变归属，其在 Home 页的顺序由 Product Config 中的排列顺序决定。

**Bullet Points（五点描述）**:
商品详情页上以列表呈现的卖点文案，逐字来自对应 Amazon listing 的五点描述（不做翻译、不做改写）。仅在详情页渲染，商品卡片不展示；可选字段，缺省则不渲染列表。
_Avoid_: Features, highlights, key points（feature 与 Spec 的 _Avoid_ 词冲突，需保持区分）

### 询盘

**Inquiry（询盘）**:
一名买家通过 Contact 页表单发出的购买意向，包含姓名、邮箱、留言（必填）和国家、公司名（选填）。询盘经由 Web3Forms 转发到公司邮箱，本站不存储任何询盘。
_Avoid_: Lead, message, contact request

**Inquiry Prefill（询盘预填）**:
从商品详情页点击 Inquiry 按钮时，在跳转后的 Contact 表单中自动带入的商品名上下文（如 "Inquiry about: Product X"）。它是表单的初始内容，不是必填约束。
_Avoid_: Product context, auto-fill

### 内容配置

**Product Config（商品配置）**:
仓库 `src/content/` 下定义全部商品（名称、分类、价格策略、MOQ、图片、描述、五点描述、Specs）的 JSON 文件。文件内的排列顺序即页面展示顺序，修改它并 push 即完成商品更新，这是"前端配置"的唯一入口。构建时校验：商品缺图或缺分类直接构建失败。
_Avoid_: Database, CMS

**Site Config（站点配置）**:
存放公司名（Caonysh）、邮箱（service@caonysh.com）、未来分析 ID 等站点级信息的配置文件，与商品内容分离。
_Avoid_: Settings, constants

### 站点

**Visitor（访客）**:
浏览网站的任意海外买家。未登录、无身份、无追踪。
_Avoid_: User, customer（本站没有账户体系）

**Deploy（部署）**:
push 到 GitHub 后由 Actions 自动完成的构建与发布。商品更新的生效方式，无手动发布步骤。
_Avoid_: Release, publish
