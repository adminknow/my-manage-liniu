# 重构 ticket_batch_info.vue 页面 - 详细实施计划

## 目标
将大型 `ticket_batch_info.vue` 文件（约2500行）重构为使用已创建的组件和可组合函数，显著减少代码量，提高可维护性，并添加适当的注释。

## 实施步骤

### 步骤1：重构模板部分 - 使用组件替换内联代码
- **步骤1.1**：用 `TicketSteps` 组件替换现有的步骤导航代码（第3-11行）
  - 导入 `TicketSteps` 组件
  - 传递 `activeIndex` 作为 props
  - 移除原有的内联步骤导航代码

- **步骤1.2**：用 `BasicInfoForm` 组件替换基本信息表单（第12-353行）
  - 导入 `BasicInfoForm` 组件
  - 传递必要的 props：`formOne`, `formData`, `Type`, `User`, `brands`, `Templates`, `defaultTime2`
  - 绑定事件：`CouponTypeChange`, `changeDatetimeRange`, `btnRefresh`, `btnTemplates`, `SuccessImg`, `beforeUpload`, `clear`, `validateDiscount`
  - 移除原有的内联基本信息表单代码

- **步骤1.3**：用 `ExchangeInfoForm` 组件替换兑换信息表单（第354-783行）
  - 导入 `ExchangeInfoForm` 组件
  - 传递必要的 props：`formTwo`, `formOne`, `Type`, `isDisabled`, `goods`, `packageDetails`, `goodsData`, `ticketsData`, `loading`, `defaultTime2`, `defaultDate2`
  - 绑定事件：`addGoods`, `delGoodBtn`, `addNumberBtn`, `reduceNumberBtn`, `remoteMethod`, `changeGoodsData`, `clearGoodsData`, `GoodsDetailClick`, `addTickets`, `delTicketBtn`, `addTicketNumberBtn`, `reduceTicketNumberBtn`, `remoteMethodTicket`, `changeTicketsData`, `clearTicketsData`, `addUseGoods`, `addUseSupplier`, `handleGoodsDel`, `handleUnitsDel`, `handlePageChange`, `handleSizeChange`, `getTinymceInput`
  - 移除原有的内联兑换信息表单代码

- **步骤1.4**：用 `SuccessTip` 组件替换成功提示页面（第784-911行）
  - 导入 `SuccessTip` 组件
  - 传递必要的 props：`ticketTemplateInfo`
  - 绑定事件：`onBackList`
  - 移除原有的内联成功提示代码

### 步骤2：重构脚本部分 - 使用可组合函数
- **步骤2.1**：导入并使用 `useTicketForm` 可组合函数
  - 导入 `useTicketForm` 函数
  - 使用该函数提供的 `formData`, `formOne`, `formTwo`, `rulesOne`, `rulesTwo` 等响应式数据
  - 移除原有的表单数据定义（第959-1176行）

- **步骤2.2**：导入并使用 `useTicketApi` 可组合函数
  - 导入 `useTicketApi` 函数
  - 使用该函数提供的 API 调用方法：`GetTicketTemplateById`, `SaveTicketTemplate`, `GetTicketTemplateList`, `SearchBrands`, `GetExpressTemplateList`
  - 移除原有的 API 调用代码和导入语句

- **步骤2.3**：导入并使用 `useDateHandler` 可组合函数
  - 导入 `useDateHandler` 函数
  - 使用该函数提供的日期处理方法：`changeDatetimeRange`, `processValidTime`, `processExchangeTime`
  - 移除原有的日期处理代码（第1570-1575行，第1473-1510行，第1439-1471行）

- **步骤2.4**：导入并使用 `useGoodsHandler` 可组合函数
  - 导入 `useGoodsHandler` 函数
  - 使用该函数提供的商品处理方法：`addGoods`, `delGoodBtn`, `addNumberBtn`, `reduceNumberBtn`, `remoteMethod`, `changeGoodsData`, `clearGoodsData`, `GoodsDetailClick`, `addTickets`, `delTicketBtn`, `addTicketNumberBtn`, `reduceTicketNumberBtn`, `remoteMethodTicket`, `changeTicketsData`, `clearTicketsData`
  - 移除原有的商品处理代码（第2031-2199行）

### 步骤3：简化主文件逻辑
- **步骤3.1**：保留必要的生命周期钩子和初始化逻辑
  - 保留 `Init` 函数和相关的初始化代码
  - 保留路由相关的逻辑

- **步骤3.2**：保留必要的表单提交和导航逻辑
  - 保留 `onSubmitOne`, `onSubmitTwo`, `onBackOne`, `onReturn`, `onBackList` 等导航函数
  - 确保这些函数正确调用可组合函数提供的方法

- **步骤3.3**：移除冗余的导入和代码
  - 移除不再需要的导入语句
  - 移除已经被可组合函数替代的代码

### 步骤4：添加详细注释和文档
- **步骤4.1**：为文件头部添加详细的文件说明注释
  - 说明文件的功能和用途
  - 说明使用的主要组件和可组合函数
  - 说明主要的业务逻辑

- **步骤4.2**：为关键函数添加注释
  - 为表单提交函数添加注释
  - 为数据处理函数添加注释
  - 为导航函数添加注释

- **步骤4.3**：为组件使用添加注释
  - 说明每个组件的作用和传递的 props
  - 说明组件间的事件传递

### 步骤5：优化样式部分
- **步骤5.1**：整理样式代码
  - 移除重复的样式定义
  - 将相关样式归类
  - 确保样式不会与组件样式冲突

- **步骤5.2**：添加样式注释
  - 为主要样式块添加注释说明

## 预期结果
- `ticket_batch_info.vue` 文件大小从约2500行减少到约500-800行
- 代码结构清晰，模块化程度高
- 可维护性和可读性大幅提升
- 所有现有功能保持不变
- 代码包含详细的注释和文档

## 技术要点
- 使用 Vue 3 Composition API
- 组件化开发
- 可组合函数复用逻辑
- 适当的注释和文档
- 保持代码风格一致性
- 确保所有功能正常工作