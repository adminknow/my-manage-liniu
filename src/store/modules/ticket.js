// 券数据
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    ticketIds: [], //为了券批次里面点击卖券和销售券，暂时把id保存在这里面
  },
  mutations: {
    setTickets(state, val) {
      state.ticketIds = val;
    },
  },
  actions: {},
  getters: {},
};
