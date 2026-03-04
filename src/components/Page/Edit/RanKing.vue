<template>
  <div class="product-content1">
    <div class="top-set">商品排行</div>

    <div class="css-title">
      <p class="tit">样式设置</p>
      <el-form-item label="标题名称">
        <el-input style="width:80%" v-model="list.options.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="标题颜色">
        <el-color-picker v-model="list.options.color" show-alpha />
      </el-form-item>
      <el-form-item label="标题大小">
        <el-input style="width:80%" v-model="list.options.fontsize" placeholder="数字">
          <template #append>px</template>
        </el-input>
      </el-form-item>
      <el-form-item label="价格颜色">
        <el-color-picker v-model="list.options.priceColor" show-alpha />
      </el-form-item>
      <el-form-item label="显示原价">
        <el-radio-group v-model="originalPriceText" @change="onOriginalPriceChange">
          <el-radio-button label="是" />
          <el-radio-button label="否" />
        </el-radio-group>
      </el-form-item>
    </div>

    <div class="css-title">
      <p class="tit">商品列表 <span>（可拖动排序）</span></p>
    </div>

    <el-button class="add-btn button1 button-float" @click="openGoodsModal">添加商品</el-button>

    <template v-if="hasData">
      <draggable v-model="list.data" tag="ul" item-key="GoodsId" draggable="li" class="list">
        <li class="item" v-for="(item, idx) in list.data" :key="item.GoodsId || idx">
          <el-row>
            <el-col :span="20" :offset="1">
              <el-tooltip effect="dark" :content="item.GoodsCode + '-' + item.GoodsTitle" placement="top"
                :show-after="300">
                <div style="width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  {{ item.GoodsCode + '-' + item.GoodsTitle }}
                </div>
              </el-tooltip>

            </el-col>
            <el-col :span="2">
              <el-icon :size="20" @click="deleteItem(idx)" style="cursor:pointer;">
                <Delete />
              </el-icon>
            </el-col>
          </el-row>
        </li>
      </draggable>
      <div class="size">共 {{ list.data.length }} 个商品 (最多 10 个)</div>
    </template>
    <el-empty v-else description="暂无商品" />

    <GoodsModal :GoodsVisible="GoodsVisible" :list="list" @CloseVisible="CloseVisible" @ConFirm="ConFirm" />
  </div>
</template>

<script>
import { ref, defineComponent, computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import GoodsModal from '@/components/Modal/GoodsModal.vue';

export default defineComponent({
  name: 'RanKing',
  components: { draggable: VueDraggableNext, GoodsModal },
  props: {
    data: { type: Object, required: false }
  },
  setup(props) {
    const list = ref(props.data || {
      data: [],
      options: {
        title: '商品排行',
        color: '#333333',
        fontsize: '14',
        priceColor: '#ff0000',
        originalPrice: 0, // 0 不显示 1 显示
      }
    });
    const GoodsVisible = ref(false);

    const originalPriceText = ref(list.value.options.originalPrice === 1 ? '是' : '否');
    const hasData = computed(() => list.value.data && list.value.data.length > 0);
    const onOriginalPriceChange = (val) => {
      list.value.options.originalPrice = val === '是' ? 1 : 0;
    }
    function deleteItem(index) {
      list.value.data.splice(index, 1);
    }

    function openGoodsModal() {
      GoodsVisible.value = true;
    }

    function ConFirm(selListData) {
      list.value.data = (selListData || []).slice(0, 10);
      GoodsVisible.value = false;
    }

    function CloseVisible(v) {
      GoodsVisible.value = v;
    }

    return {
      list,
      GoodsVisible,
      onOriginalPriceChange,
      originalPriceText,
      hasData,
      deleteItem,
      openGoodsModal,
      ConFirm,
      CloseVisible
    };
  }
});
</script>

<style lang="less">
.product-content1 {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: overlay;

  .tit {
    text-align: left;
    font-size: 14px;
    color: #666;
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ddd;
  }

  .size {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-bottom: 0;
  }

  .add-btn {
    width: calc(100% - 30px);
    height: 34px;
    line-height: 34px;
    padding: 0;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 5px;
  }

  .list {
    padding: 12px;
    margin: 0;
    overflow-x: hidden;

    .item {
      width: 100%;
      border-radius: 6px;
      margin: 4px;
      list-style: none;
      transition: all 0.3s;

      &:hover {
        cursor: grab;
      }
    }
  }
}
</style>