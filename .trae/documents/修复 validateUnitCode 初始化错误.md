## 问题分析

错误信息：`Cannot access 'validateUnitCode' before initialization`

原因：在 `EditModal.vue` 文件中，`rules` 对象引用了 `validateUnitCode` 函数，但是 `validateUnitCode` 函数的定义在 `rules` 对象之后。

在 JavaScript 中，使用 `const` 声明的变量会被提升到作用域顶部，但在赋值之前会处于"暂时性死区"状态，无法访问。

## 修复方案

将 `validateUnitCode` 函数的定义移到 `rules` 对象之前，确保在引用该函数时它已经被初始化。

## 具体修改

修改文件：`src/components/IssueUnit/EditModal.vue`

1. 将第 318-325 行的 `validateUnitCode` 函数定义移到第 292 行之前
2. 保持函数实现不变

这样修改后，`rules` 对象在引用 `validateUnitCode` 函数时，该函数已经完成初始化，不会再抛出错误。