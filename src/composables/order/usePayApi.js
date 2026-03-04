import { SendPayTicketOrderPayNotify, PrepareIssueOrderInvoice } from "@/api/order.js";
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
export function usePayApi() {
    // 响应式数据
    const loading = ref(false);

    /**
     * 给兑换券的支付订单的支付人推送支付通知
     * @param {Object} OrderId - 订单id
     * @returns {Promise<Object>} - 结果
     */
    const SendPayTicketOrderPayNotifyApi = async (id) => {
        try {
            loading.value = true;
            const res = await SendPayTicketOrderPayNotify({
                OrderId: id
            });
            loading.value = false;
            if (res.Code == 200) {
                return res;
            } else {
                ElMessage.error(res.Message || '推送失败');
                return null;
            }
        } catch (error) {
            loading.value = false;
            ElMessage.error('推送失败');
            return null;
        }
    };

    /**
     * 准备给订单开票，此时锁定订单的开票信息，不允许修改
     * @param {Object} OrderId - 订单id
     * @returns {Promise<Object>} - 结果
     */
    const PrepareIssueOrderInvoiceApi = async (id) => {
        try {
            loading.value = true;
            const res = await PrepareIssueOrderInvoice({
                OrderId: id,
            });
            loading.value = false;
            if (res.Code == 200) {
                return res;
            } else {
                ElMessage.error(res.Message || '操作失败');
                return null;
            }
        } catch (error) {
            loading.value = false;
            ElMessage.error('操作失败');
            return null;
        }
    };
    return {
        loading,
        SendPayTicketOrderPayNotifyApi,
        PrepareIssueOrderInvoiceApi
    };
}