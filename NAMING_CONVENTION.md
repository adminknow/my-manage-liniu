1. 通用规则
小写字母 + 连字符（kebab-case）（推荐）

例如：src/components/、assets/fonts/、utils/api-helpers/

理由：兼容所有操作系统（Linux/macOS/Windows），URL 友好，无大小写敏感问题。

避免特殊字符和空格

错误示例：My Components/、data&utils/

语义化 + 功能分类

按模块分：user-auth/、product-list/

按类型分：hooks/、styles/、mocks/

2. 常见目录命名示例
类型	示例命名	说明
源代码目录	src/ 或 app/	主代码入口
组件目录	components/	通用组件
页面目录	pages/ 或 views/	路由级页面（Next.js/Vue）
静态资源	assets/ 或 public/	图片、字体等
工具函数	utils/ 或 helpers/	公共工具类
测试目录	__tests__/ 或 test/	单元测试/集成测试
配置文件	config/	项目配置文件


文件夹：统一用 kebab-case（如 src/components/）。

文件：大多数用 kebab-case，React/Vue 组件可灵活使用 PascalCase。

核心原则：语义化 + 一致性 > 严格规则。