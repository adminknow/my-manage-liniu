import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  SearchBrands,
  GetExpressTemplateList,
  SaveTicketTemplate,
  GetTicketTemplateById,
  GetTicketTemplateList,
} from "@/api/ticket.js";
import { SearchGoodses, GetGoods } from "@/api/goods.js";
import { UploadSingle } from "@/api/imgapi.js";
import { GetUnitList } from "@/api/index.js";

/**
 * 卡券 API 组合式函数
 * 用于管理卡券相关的 API 调用
 */
export function useTicketApi() {
  // 响应式数据
  const loading = ref(false);
  const brands = ref([]);
  const Templates = ref([]);
  const goodsData = ref([]);
  const ticketsData = ref([]);
  const ticketTemplateInfo = ref({});

  /**
   * 获取品牌列表
   */
  const getBrands = async () => {
    try {
      loading.value = true;
      let res = await SearchBrands({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
      });
      loading.value = false;
      if (res.Code == 200) {
        brands.value = res.DataMap.Data;
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('获取品牌列表失败');
      console.error('获取品牌列表失败:', error);
    }
  };

  /**
   * 获取配送模板列表
   */
  const getExpressTemplates = async () => {
    try {
      loading.value = true;
      let res = await GetExpressTemplateList({
        SearchCondition: {
          template_status: 1,
        },
      });
      loading.value = false;
      if (res.Code == 200) {
        Templates.value = res.DataMap;
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('获取配送模板列表失败');
      console.error('获取配送模板列表失败:', error);
    }
  };

  /**
   * 上传图片
   * @param {File} file - 图片文件
   * @returns {Promise<string>} - 图片 URL
   */
  const uploadImage = async (file) => {
    try {
      loading.value = true;
      let fd = new FormData();
      fd.append('file', file); // 传文件
      const res = await UploadSingle(fd);
      loading.value = false;
      if (res.Code == 200) {
        return res.DataMap.HttpsUrl;
      } else {
        ElMessage.error('上传图片失败');
        return '';
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('上传图片失败');
      console.error('上传图片失败:', error);
      return '';
    }
  };

  /**
   * 保存卡券模板
   * @param {Object} ticketTemplate - 卡券模板数据
   * @returns {Promise<Object>} - 保存结果
   */
  const saveTicketTemplate = async (ticketTemplate) => {
    try {
      loading.value = true;
      const res = await SaveTicketTemplate({
        TicketTemplate: ticketTemplate,
      });
      loading.value = false;
      if (res.Code == 200) {
        ElMessage.success('保存成功');
        return res;
      } else {
        ElMessage.error(res.Message || '保存失败');
        return null;
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('保存失败');
      console.error('保存卡券模板失败:', error);
      return null;
    }
  };

  /**
   * 根据 ID 获取卡券模板
   * @param {string} id - 卡券模板 ID
   * @returns {Promise<Object>} - 卡券模板数据
   */
  const getTicketTemplateById = async (id) => {
    try {
      loading.value = true;
      const res = await GetTicketTemplateById({
        TicketTemplateId: id,
        ReturnStatData: false,
      });
      loading.value = false;
      if (res.Code == 200) {
        ticketTemplateInfo.value = res.DataMap;
        return res;
      } else {
        return null;
      }
    } catch (error) {
      loading.value = false;
      // ElMessage.error('获取卡券模板失败');
      // console.error('获取卡券模板失败:', error);
      return null;
    }
  };

  /**
   * 搜索商品
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} - 商品列表
   */
  const searchGoods = async (query) => {
    try {
      if (!query) {
        goodsData.value = [];
        return [];
      }
      loading.value = true;
      let res = await SearchGoodses({
        PageStartRow: 0,
        PageRowCount: 100000,
        NoPage: true,
        SearchCondition: {
          search_keyword: query,
          goods_status: "1",
        },
      });
      loading.value = false;
      if (res.Code === 200) {
        if (res.DataMap.ToalCount == 0) {
          goodsData.value = [];
        } else {
          goodsData.value = res.DataMap.Data;
        }
        return goodsData.value;
      }
      return [];
    } catch (error) {
      loading.value = false;
      ElMessage.error('搜索商品失败');
      console.error('搜索商品失败:', error);
      return [];
    }
  };

  /**
   * 根据 ID 获取商品详情
   * @param {string} id - 商品 ID
   * @returns {Promise<Object>} - 商品详情
   */
  const getGoodsById = async (id) => {
    try {
      loading.value = true;
      let res = await GetGoods({
        ObjectId: id,
      });
      loading.value = false;
      if (res.Code == 200) {
        return res.DataMap;
      } else {
        ElMessage.error('获取商品详情失败');
        return null;
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('获取商品详情失败');
      console.error('获取商品详情失败:', error);
      return null;
    }
  };

  /**
   * 搜索卡券模板
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} - 卡券模板列表
   */
  const searchTicketTemplates = async (query) => {
    try {
      if (!query) {
        ticketsData.value = [];
        return [];
      }
      loading.value = true;
      let res = await GetTicketTemplateList({
        SearchCondition: {
          display_status: "1",
          search_keyword: query,
          ticket_template_type: 0,
        },
      });
      loading.value = false;
      if (res.Code === 200) {
        ticketsData.value = res.DataMap;
        return ticketsData.value;
      }
      return [];
    } catch (error) {
      loading.value = false;
      ElMessage.error('搜索卡券模板失败');
      console.error('搜索卡券模板失败:', error);
      return [];
    }
  };

  /**
   * 获取供应商列表
   * @param {string} unitIds - 供应商 ID 列表，多个用分号分隔
   * @param {string} createUnitId - 创建单位 ID
   * @returns {Promise<Array>} - 供应商列表
   */
  const getSuppliers = async (unitIds, createUnitId) => {
    try {
      loading.value = true;
      let res = await GetUnitList({
        SearchCondition: {
          from_mall: createUnitId,
          unit_id: unitIds
        }
      });
      loading.value = false;
      if (res.Code == 200) {
        return res;
      } else {
        ElMessage.error('获取供应商列表失败');
        return [];
      }
    } catch (error) {
      loading.value = false;
      ElMessage.error('获取供应商列表失败');
      console.error('获取供应商列表失败:', error);
      return [];
    }
  };

  return {
    loading,
    brands,
    Templates,
    goodsData,
    ticketsData,
    ticketTemplateInfo,
    getBrands,
    getExpressTemplates,
    uploadImage,
    saveTicketTemplate,
    getTicketTemplateById,
    searchGoods,
    getGoodsById,
    searchTicketTemplates,
    getSuppliers,
  };
}
