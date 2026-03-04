import { createRouter, createWebHashHistory } from "vue-router";
import Cookie from "js-cookie";
import Home from "../components/Home.vue";

const routes = [
  {
    path: "/",
    redirect: "/user",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          title: "系统首页",
        },
        component: () => import("../views/Basics/index.vue"),
      },
      {
        path: "/user",
        name: "user",
        component: () => import("../views/Basics/user.vue"),
        meta: { title: "用户" },
      },
      {
        path: "/userInfo",
        name: "userInfo",
        component: () => import("../views/Basics/userInfo.vue"),
        meta: { title: "用户详情" },
      },
      {
        path: "/role",
        name: "role",
        component: () => import("../views/Basics/role.vue"),
        meta: { title: "角色" },
      },
      {
        path: "/roleInfo",
        name: "roleInfo",
        component: () => import("../views/Basics/roleInfo.vue"),
        meta: { title: "角色详情" },
      },
      {
        path: "/jurisdiction",
        name: "jurisdiction",
        meta: {
          title: "权限",
        },
        component: () => import("../views/Basics/jurisdiction.vue"),
      },
      {
        path: "/jurisdictionEdit",
        name: "jurisdictionEdit",
        meta: {
          title: "权限编辑",
        },
        component: () => import("../views/Basics/jurisdictionEdit.vue"),
      },
      {
        path: "/task",
        name: "task",
        component: () => import("../views/system/task.vue"),
        meta: { title: "定时任务" },
      },
      {
        path: "/taskInfo",
        name: "taskInfo",
        component: () => import("../views/system/taskInfo.vue"),
        meta: { title: "定时任务详情" },
      },
      {
        path: "/system",
        name: "system",
        component: () => import("../views/system/system.vue"),
        meta: { title: "系统配置" },
      },
      {
        path: "/my_settings",
        name: "my_settings",
        component: () => import("../views/Basics/my_settings.vue"),
        meta: { title: "我的设置" },
      },
      {
        path: "/issue_unit_list",
        name: "issue_unit_list",
        component: () => import("../views/Basics/issue_unit_list.vue"),
        meta: { title: "券商" },
      },
      {
        path: "/unitInfo",
        name: "unitInfo",
        component: () => import("../views/Basics/unitInfo.vue"),
        meta: { title: "单位详情" },
      },
      {
        path: "/ticket_list",
        name: "ticket_list",
        component: () => import("../views/ticket/list.vue"),
        meta: { title: "券列表" },
      },
      {
        path: "/ticket_sales",
        name: "ticket_sales",
        component: () => import("../views/ticket/ticket_sales.vue"),
        meta: { title: "销售单" },
      },
      {
        path: "/ticket_sales_info",
        name: "ticket_sales_info",
        component: () => import("../views/ticket/ticket_sales_info.vue"),
        meta: { title: "销售单详情" },
      },
      {
        path: "/ticket_batch",
        name: "ticket_batch",
        component: () => import("../views/ticket/ticket_batch.vue"),
        meta: { title: "我的卡券" },
      },
      {
        path: "/ticket_batch_more",
        name: "ticket_batch_more",
        component: () => import("../views/ticket/ticket_batch_more.vue"),
        meta: { title: "卡券列表" },
      },
      {
        path: "/ticket_inventory",
        name: "ticket_inventory",
        component: () => import("../views/ticket/ticket_inventory.vue"),
        meta: { title: "卡券库存" },
      },
      {
        path: "/ticket_batch_info",
        name: "ticket_batch_info",
        component: () => import("../views/ticket/ticket_batch_info.vue"),
        meta: { title: "卡券详情" },
      },
      {
        path: "/order",
        name: "order",
        component: () => import("../views/Sale/order.vue"),
        meta: { title: "订单" },
      },
      {
        path: "/deliver_order",
        name: "deliver_order",
        component: () => import("../views/Sale/deliver_order.vue"),
        meta: { title: "配送订单" },
      },
      {
        path: "/test",
        name: "test",
        component: () => import("../views/Basics/test.vue"),
        meta: { title: "测试页面", urlPath: "基础管理/测试页面模板" },
      },
      {
        path: "/customer",
        name: "customer",
        component: () => import("../views/Basics/customer.vue"),
        meta: { title: "客户列表" },
      },
      {
        path: "/roster",
        name: "roster",
        component: () => import("../views/Basics/roster.vue"),
        meta: { title: "客户名单" },
      },
      {
        path: "/commodity",
        name: "commodity",
        component: () => import("../views/Sale/commodity.vue"),
        meta: { title: "兑换商品" },
      },
      {
        path: "/commodity_info",
        name: "commodity_info",
        component: () => import("../views/Sale/commodity_info.vue"),
        meta: { title: "商品详情" },
      },
      {
        path: "/attributes",
        name: "attributes",
        component: () => import("../views/Sale/attributes.vue"),
        meta: { title: "商品属性" },
      },
      {
        path: "/attributes_info",
        name: "attributes_info",
        component: () => import("../views/Sale/attributes_info.vue"),
        meta: { title: "属性详情" },
      },
      {
        path: "/distribution_template",
        name: "distribution_template",
        component: () => import("../views/ticket/distribution_template.vue"),
        meta: { title: "配送模板" },
      },
      {
        path: "/detail",
        name: "detail",
        component: () => import("../views/ticket/detail.vue"),
        meta: { title: "券明细" },
      },
      {
        path: "/ticket_send",
        name: "ticket_send",
        component: () => import("../views/ticket/ticket_send.vue"),
        meta: { title: "发券单" },
      },
      {
        path: "/ticket_send_info",
        name: "ticket_send_info",
        component: () => import("../views/ticket/ticket_send_info.vue"),
        meta: { title: "发券详情" },
      },
      {
        path: "/ticket_send_detail",
        name: "ticket_send_detail",
        component: () => import("../views/ticket/ticket_send_detail.vue"),
        meta: { title: "发券明细" },
      },
      {
        path: "/brand",
        name: "brand",
        component: () => import("../views/Basics/brand.vue"),
        meta: { title: "品牌列表" },
      },
      {
        path: "/d_template",
        name: "d_template",
        component: () => import("../views/ticket/d_template.vue"),
        meta: { title: "模板列表" },
      },
      {
        path: "/find_no",
        name: "find_no",
        component: () => import("../views/ticket/find_no.vue"),
        meta: { title: "券码查询" },
      },
      {
        path: "/fans",
        name: "fans",
        component: () => import("../views/vips/fans.vue"),
        meta: { title: "小程序粉丝" },
      },
      {
        path: "/vip",
        name: "vip",
        component: () => import("../views/vips/vip.vue"),
        meta: { title: "会员列表" },
      },
      {
        path: "/bill_of_lading",
        name: "bill_of_lading",
        component: () => import("../views/point/bill_of_lading.vue"),
        meta: { title: "提货单" },
      },
      {
        path: "/pick_up_point",
        name: "pick_up_point",
        component: () => import("../views/point/pick_up_point.vue"),
        meta: { title: "提货点" },
      },
      {
        path: "/ticket_point_list",
        name: "ticket_point_list",
        component: () => import("../views/point/ticket_point_list.vue"),
        meta: { title: "门店信息" },
      },
      {
        path: "/application_list",
        name: "application_list",
        component: () => import("../views/Basics/application_list.vue"),
        meta: { title: "申请演示" },
      },
      {
        path: "/feedback",
        name: "feedback",
        component: () => import("../views/Basics/feedback.vue"),
        meta: { title: "反馈列表" },
      },
      {
        path: "/pickup_statistics",
        name: "pickup_statistics",
        component: () => import("../views/statistics/pickup_statistics.vue"),
        meta: { title: "已提货券统计" },
      },
      {
        path: "/pickup_statistics1",
        name: "pickup_statistics1",
        component: () => import("../views/statistics/pickup_statistics1.vue"),
        meta: { title: "预约提货" },
      },
      {
        path: "/pickup_statistics2",
        name: "pickup_statistics2",
        component: () => import("../views/statistics/pickup_statistics2.vue"),
        meta: { title: "客户券统计" },
      },
      {
        path: "/sku",
        name: "sku",
        component: () => import("../views/Sale/sku.vue"),
        meta: { title: "规格" },
      },
      {
        path: "/category",
        name: "category",
        component: () => import("../views/online_shop/category.vue"),
        meta: { title: "平台分类" },
      },
      {
        path: "/category_info",
        name: "category_info",
        component: () => import("../views/online_shop/category_info.vue"),
        meta: { title: "分类详情" },
      },
      {
        path: "/my_category",
        name: "my_category",
        component: () => import("../views/online_shop/my_category.vue"),
        meta: { title: "我的分类" },
      },
      {
        path: "/my_category_info",
        name: "my_category_info",
        component: () => import("../views/online_shop/my_category_info.vue"),
        meta: { title: "我的分类详情" },
      },
      {
        path: "/goods_approve",
        name: "goods_approve",
        component: () => import("../views/online_shop/goods_approve.vue"),
        meta: { title: "上架审批新" },
      },
      {
        path: "/approval",
        name: "approval",
        component: () => import("../views/online_shop/approval.vue"),
        meta: { title: "上架审批" },
      },
      {
        path: "/Ad_list",
        name: "Ad_list",
        component: () => import("../views/online_shop/Ad_list.vue"),
        meta: { title: "广告列表" },
      },
      {
        path: "/Ad_list_info",
        name: "Ad_list_info",
        component: () => import("../views/online_shop/Ad_list_info.vue"),
        meta: { title: "广告详情" },
      },
      {
        path: "/best_goods",
        name: "best_goods",
        component: () => import("../views/online_shop/best_goods.vue"),
        meta: { title: "热卖商品" },
      },
      {
        path: "/selling_goods",
        name: "selling_goods",
        component: () => import("../views/online_shop/selling_goods.vue"),
        meta: { title: "售卖商品" },
      },
      {
        path: "/selling_goods_info",
        name: "selling_goods_info",
        component: () => import("../views/online_shop/selling_goods_info.vue"),
        meta: { title: "售卖详情" },
      },
      {
        path: "/order_list",
        name: "order_list",
        component: () => import("../views/online_shop/order_list.vue"),
        meta: { title: "礼牛订单" },
      },
      {
        path: "/order_list_unit",
        name: "order_list_unit",
        component: () => import("../views/online_shop/order_list.vue"),
        meta: { title: "自有订单" },
      },
      {
        path: "/tag",
        name: "tag",
        component: () => import("../views/system/tag.vue"),
        meta: { title: "首页标签" },
      },
      {
        path: "/tag_goods",
        name: "tag_goods",
        component: () => import("../views/system/tag_goods.vue"),
        meta: { title: "标签商品" },
      },
      {
        path: "/order_info",
        name: "order_info",
        component: () => import("../views/online_shop/order_info.vue"),
        meta: { title: "订单详情" },
      },
      {
        path: "/refund_ticket_info",
        name: "refund_ticket_info",
        component: () => import("../views/ticket/refund_ticket_info.vue"),
        meta: { title: "退券单详情" },
      },
      {
        path: "/refund_ticket",
        name: "refund_ticket",
        component: () => import("../views/ticket/refund_ticket.vue"),
        meta: { title: "退券单" },
      },
      {
        path: "/finance_info",
        name: "finance_info",
        component: () => import("../views/online_shop/finance_info.vue"),
        meta: { title: "每月费用单据详情" },
      },
      {
        path: "/finance",
        name: "finance",
        component: () => import("../views/online_shop/finance.vue"),
        meta: { title: "每月费用" },
      },
      {
        path: "/operational_data",
        name: "operational_data",
        component: () => import("../views/online_shop/operational_data.vue"),
        meta: { title: "运营数据" },
      },
      {
        path: "/wechat_billing",
        name: "wechat_billing",
        component: () => import("../views/online_shop/wechat_billing.vue"),
        meta: { title: "微信账单" },
      },
      {
        path: "/distributors_list",
        name: "distributors_list",
        component: () => import("../views/distribution/distributors_list.vue"),
        meta: { title: "分销员" },
      },
      {
        path: "/distributors_list_unit",
        name: "distributors_list_unit",
        component: () => import("../views/distribution/distributors_list.vue"),
        meta: { title: "券商分销员" },
      },
      {
        path: "/distribution_strategy",
        name: "distribution_strategy",
        component: () =>
          import("../views/distribution/distribution_strategy.vue"),
        meta: { title: "分销策略" },
      },
      {
        path: "/distribution_strategy_unit",
        name: "distribution_strategy_unit",
        component: () =>
          import("../views/distribution/distribution_strategy.vue"),
        meta: { title: "券商分销策略" },
      },
      {
        path: "/distributors_relationship",
        name: "distributors_relationship",
        component: () =>
          import("../views/distribution/distributors_relationship.vue"),
        meta: { title: "客户关系" },
      },
      {
        path: "/distributors_relationship_unit",
        name: "distributors_relationship_unit",
        component: () =>
          import("../views/distribution/distributors_relationship.vue"),
        meta: { title: "券商客户关系" },
      },
      {
        path: "/distributors_order",
        name: "distributors_order",
        component: () => import("../views/distribution/distributors_order.vue"),
        meta: { title: "分销订单" },
      },
      {
        path: "/distributors_order_unit",
        name: "distributors_order_unit",
        component: () => import("../views/distribution/distributors_order.vue"),
        meta: { title: "券商分销订单" },
      },
      {
        path: "/distribution_config",
        name: "distribution_config",
        component: () =>
          import("../views/distribution/distribution_config.vue"),
        meta: { title: "分销商配置" },
      },
      {
        path: "/distribution_good",
        name: "distribution_good",
        component: () => import("../views/distribution/distribution_good.vue"),
        meta: { title: "可分销商品" },
      },
      {
        path: "/distribution_good_unit",
        name: "distribution_good_unit",
        component: () => import("../views/distribution/distribution_good.vue"),
        meta: { title: "券商可分销商品" },
      },
      {
        path: "/differential_exchange_template",
        name: "differential_exchange_template",
        component: () =>
          import("../views/point/differential_exchange_template.vue"),
        meta: { title: "差异兑换模板" },
      },
      {
        path: "/differential_exchange_template_info",
        name: "differential_exchange_template_info",
        component: () =>
          import("../views/point/differential_exchange_template_info.vue"),
        meta: { title: "差异兑换详情" },
      },
      {
        path: "/withdrawal_records",
        name: "withdrawal_records",
        component: () => import("../views/vips/withdrawal_records.vue"),
        meta: { title: "提现记录" },
      },
      {
        path: "/warehousing_bill",
        name: "warehousing_bill",
        component: () => import("../views/point/warehousing_bill.vue"),
        meta: { title: "入库单" },
      },
      {
        path: "/outbound_bill",
        name: "outbound_bill",
        component: () => import("../views/point/outbound_bill.vue"),
        meta: { title: "出库单" },
      },
      {
        path: "/Inventory_bill",
        name: "Inventory_bill",
        component: () => import("../views/point/Inventory_bill.vue"),
        meta: { title: "盘点单" },
      },
      {
        path: "/exchange_item_inventory",
        name: "exchange_item_inventory",
        component: () => import("../views/point/exchange_item_inventory.vue"),
        meta: { title: "提货点库存" },
      },
      {
        path: "/commodity_inventory",
        name: "commodity_inventory",
        component: () => import("../views/point/commodity_inventory.vue"),
        meta: { title: "商品总库存" },
      },
      {
        path: "/picked_up_goods",
        name: "picked_up_goods",
        component: () => import("../views/statistics/picked_up_goods.vue"),
        meta: { title: "已提货商品统计" },
      },
      {
        path: "/bill_info",
        name: "bill_info",
        component: () => import("../views/point/bill_info.vue"),
        meta: { title: "单据详情" },
      },
      {
        path: "/inventorybill_info",
        name: "inventorybill_info",
        component: () => import("../views/point/inventorybill_info.vue"),
        meta: { title: "盘点单详情" },
      },
      {
        path: "/card_transfer",
        name: "card_transfer",
        component: () => import("../views/vips/card_transfer.vue"),
        meta: { title: "卡券转赠" },
      },
      {
        path: "/customer_service",
        name: "customer_service",
        component: () => import("../views/Basics/customer_service.vue"),
        meta: { title: "我的客服" },
      },
      {
        path: "/claim_activity",
        name: "claim_activity",
        component: () => import("../views/ticket/claim_activity.vue"),
        meta: { title: "领取活动" },
      },
      {
        path: "/claim_activity_Info",
        name: "claim_activity_Info",
        component: () => import("../views/ticket/claim_activity_Info.vue"),
        meta: { title: "领取活动详情" },
      },
      {
        path: "/claim_activity_detail",
        name: "claim_activity_detail",
        component: () => import("../views/ticket/claim_activity_detail.vue"),
        meta: { title: "领取活动明细" },
      },
      {
        path: "/market_page_full",
        name: "market_page_full",
        component: () => import("../views/market/market_page_full.vue"),
        meta: { title: "满减活动" },
      },
      {
        path: "/market_page_buy",
        name: "market_page_buy",
        component: () => import("../views/market/market_page_buy.vue"),
        meta: { title: "买赠活动" },
      },
      {
        path: "/market_page_specify_price",
        name: "market_page_specify_price",
        component: () =>
          import("../views/market/market_page_specify_price.vue"),
        meta: { title: "指定价格活动" },
      },

      {
        path: "/card_transaction",
        name: "card_transaction",
        component: () => import("../views/ticket/card_transaction.vue"),
        meta: { title: "储值卡交易" },
      },
      {
        path: "/market_page_info",
        name: "market_page_info",
        component: () => import("../views/market/market_page_info.vue"),
        meta: { title: "营销活动详情" },
      },
      {
        path: "/agreement",
        name: "agreement",
        component: () => import("../views/Basics/agreement.vue"),
        meta: { title: "协议" },
      },
      {
        path: "/agreement_info",
        name: "agreement_info",
        component: () => import("../views/Basics/agreement_info.vue"),
        meta: { title: "协议详情" },
      },
      {
        path: "/page_decoration",
        name: "page_decoration",
        component: () => import("../views/activity/page_decoration.vue"),
        meta: { title: "装修详情1" },
      },
      {
        path: "/page_Info",
        name: "page_Info",
        component: () => import("../views/activity/page_Info.vue"),
        meta: { title: "装修详情" },
      },
      {
        path: "/page_list",
        name: "page_list",
        component: () => import("../views/activity/page_list.vue"),
        meta: { title: "页面装修" },
      },
      {
        path: "/level",
        name: "level",
        component: () => import("../views/vips/level.vue"),
        meta: { title: "会员等级" },
      },
      {
        path: "/levelInfo",
        name: "levelInfo",
        component: () => import("../views/vips/levelInfo.vue"),
        meta: { title: "会员等级详情" },
      },
      {
        path: "/scene_code",
        name: "scene_code",
        component: () => import("../views/activity/scene_code.vue"),
        meta: { title: "场景码" },
      },
      {
        path: "/notes",
        name: "notes",
        component: () => import("../views/vips/notes.vue"),
        meta: { title: "笔记管理" },
      },
      {
        path: "/NoteAnimation",
        name: "NoteAnimation",
        component: () => import("../views/vips/NoteAnimation.vue"),
        meta: { title: "笔记管理" },
      },
      {
        path: "/fucai_order",
        name: "fucai_order",
        component: () => import("../views/fucai/order.vue"),
        meta: { title: "福采订单" },
      },
      {
        path: "/warehouse_order",
        name: "warehouse_order",
        component: () => import("../views/fucai/warehouse_order.vue"),
        meta: { title: "仓库订单" },
      },
      {
        path: "/supplier_order",
        name: "supplier_order",
        component: () => import("../views/fucai/supplier_order.vue"),
        meta: { title: "供应商订单" },
      },
      {
        path: "/point_card",
        name: "point_card",
        component: () => import("../views/ticket/point_card.vue"),
        meta: { title: "点卡充值单" },
      },
      {
        path: "/point_card_info",
        name: "point_card_info",
        component: () => import("../views/ticket/point_card_info.vue"),
        meta: { title: "充值单详情" },
      },
      {
        path: "/best-sellers",
        name: "BestSellers",
        component: () => import("../views/Sale/BestSellers.vue"),
        meta: { title: "热卖商品" },
      },
      /////商城管理
      {
        path: "/my_mall",
        name: "my_mall",
        component: () => import("../views/mallManage/my_mall.vue"),
        meta: { title: "我的商城" },
      },
      {
        path: "/my_product",
        name: "my_product",
        component: () => import("../views/mallManage/my_product.vue"),
        meta: { title: "售卖商品" },
      },
      {
        path: "/my_supplier",
        name: "my_supplier",
        component: () => import("../views/mallManage/my_supplier.vue"),
        meta: { title: "我的供应商" },
      },
      {
        path: "/product_category",
        name: "product_category",
        component: () => import("../views/mallManage/product_category.vue"),
        meta: { title: "商品分类" },
      },
      {
        path: "/to_launch",
        name: "to_launch",
        component: () => import("../views/mallManage/to_launch.vue"),
        meta: { title: "我要上架" },
      },
      {
        path: "/to_review",
        name: "to_review",
        component: () => import("../views/mallManage/to_launch.vue"),
        meta: { title: "我要审核" },
      },
      {
        path: "/order_mall",
        name: "order_mall",
        component: () => import("../views/mallManage/order.vue"),
        meta: { title: "订单管理" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login.vue"),
  },
  {
    path: "/choicepost",
    name: "choicepost",
    meta: {
      title: "选择角色",
    },
    component: () => import("../views/choicepost.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 认证优先
  const token = Cookie.get("CookieToken");
  if (!token && to.path !== "/login") {
    return next("/login");
  }
  // 若进入平台分销策略页面且未带 type 参数, 自动补上 type=1
  if (
    (to.path === "/distribution_strategy" ||
      to.path === "/distribution_good" ||
      to.path === "/distributors_order" ||
      to.path === "/distributors_relationship") &&
    !to.query.type
  ) {
    return next({
      path: to.path,
      query: { ...to.query, type: 0 }, //0:礼牛网
      replace: true, // 不产生历史记录
    });
  }
  if (
    (to.path === "/distribution_strategy_unit" ||
      to.path === "/distribution_good_unit" ||
      to.path === "/distributors_order_unit" ||
      to.path === "/distributors_relationship_unit") &&
    !to.query.type
  ) {
    return next({
      path: to.path,
      query: { ...to.query, type: 1 }, //1:券商私域商城
      replace: true, // 不产生历史记录
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (
    (to.path === "/to_launch") &&
    !to.query.type
  ) {
    return next({
      path: to.path,
      query: { ...to.query, type: 'launch' }, //上架
      replace: true, // 不产生历史记录
    });
  }
  if (
    (to.path === "/to_review") &&
    !to.query.type
  ) {
    return next({
      path: to.path,
      query: { ...to.query, type: 'review' }, //审批
      replace: true, // 不产生历史记录
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (to.path === "/order_list" && !to.query.orderType) {
    return next({
      path: to.path,
      query: { ...to.query, orderType: 1 },
      replace: true, // 不产生历史记录
    });
  }
  if (to.path === "/order_list_unit" && !to.query.orderType) {
    return next({
      path: to.path,
      query: { ...to.query, orderType: 2 },
      replace: true, // 不产生历史记录
    });
  }
  // 动态标题规则集中
  const dynamicTitleMap = {
    "/tag": (q) => (q.id == 2 ? "首页标签" : "商品标签"),
    "/goods_approve": (q) =>
      q.type == 1 ? "商品上架(礼牛商城)" : "商品上架(福采商城)",
    "/sku": (q) => '规格',
    "/category": (q) => (q.unitType == 1 ? "平台分类" : "商品分类"),
    "/Ad_list": (q) => (q.adType == 1 ? "首页广告" : "广告管理"),
  };

  const resolver = dynamicTitleMap[to.path];
  const title = resolver ? resolver(to.query || {}) : to.meta?.title;
  if (title) {
    document.title = title;
    // 同步 meta 供标签页等使用
    to.meta.title = title;
  }
  next();
  // document.title = `${to.meta.title}`;
  // if (to.path == "/tag") {
  //   if (to.query.id == 2) {
  //     document.title = "首页标签";
  //     to.meta.title = "首页标签";
  //   } else {
  //     document.title = "商品标签";
  //     to.meta.title = "商品标签";
  //   }
  // }
  // if (to.path == "/goods_approve") {
  //   //针对于上架审批页面操作，动态带参数
  //   if (to.query.type == 1) {
  //     document.title = "商品上架(礼牛商城)";
  //     to.meta.title = "商品上架(礼牛商城)";
  //   } else {
  //     document.title = "商品上架(福采商城)";
  //     to.meta.title = "商品上架(福采商城)";
  //   }
  // }
  // if (to.path == "/sku") {
  //   //私域与平台区分一下 //type==1 礼牛，type==2，福彩
  //   if (to.query.UnitID == 1) {
  //     document.title = "规格(礼牛商城)";
  //     to.meta.title = "规格(礼牛商城)";
  //   } else if (to.query.UnitID == 2) {
  //     document.title = "规格(福采商城)";
  //     to.meta.title = "规格(福采商城)";
  //   } else {
  //     document.title = "规格";
  //     to.meta.title = "规格";
  //   }
  // }
  // if (to.path == "/category") {
  //   //针对于上架审批页面操作，动态带参数
  //   if (to.query.unitType == 1) {
  //     document.title = "平台分类";
  //     to.meta.title = "平台分类";
  //   } else {
  //     document.title = "商品分类";
  //     to.meta.title = "商品分类";
  //   }
  // }
  // if (to.path == "/Ad_list") {
  //   //adType 1、私域商城 2、福采商城
  //   if (to.query.adType == 1) {
  //     document.title = "首页广告";
  //     to.meta.title = "首页广告";
  //   } else {
  //     document.title = "广告管理";
  //     to.meta.title = "广告管理";
  //   }
  // }
  // if (to.path == "/order_list") {
  //   //orderType 1、私域订单 2、礼牛订单
  //   if (to.query.orderType == 1) {
  //     document.title = "自有订单";
  //     to.meta.title = "自有订单";
  //   } else {
  //     document.title = "礼牛订单";
  //     to.meta.title = "礼牛订单";
  //   }
  // }
});

export default router;
