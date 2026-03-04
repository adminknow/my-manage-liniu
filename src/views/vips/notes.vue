<template>
  <div class="container">
    <div class="handle-box">
      <el-form label-width="1px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.search_keyword"
                clearable
                placeholder="请输入标题"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                v-model="query.search.tag_id"
                clearable
                placeholder="请选择标签"
                style="width: 100%"
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.TagName"
                  :label="item.TagName"
                  :value="item.TagId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-select
                clearable
                style="width: 100%"
                v-model="query.search.note_status"
                placeholder="请选择状态"
              >
                <el-option label="审核中" value="1"> </el-option>
                <el-option label="审核未通过" value="3"> </el-option>
                <el-option label="发布中" value="10"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleApprove()"
                >批量审批
              </el-button>
              <el-button
                class="button1 button-float"
                round
                @click="handleSearch()"
              >
                <el-icon> <Search /> </el-icon
                >&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="">
              <el-input
                v-model="query.search.vip_name"
                clearable
                placeholder="请输入会员姓名"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="">
              <el-input
                v-model="query.search.vip_cell"
                clearable
                placeholder="请输入会员电话"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1"> </el-col>
          <el-col :span="6" :offset="1">
            <div class="button-mgl">
              <el-button
                class="button2 button-float"
                round
                @click="handleSearch()"
                >批量下架
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="card-container">
      <div
        class="notes-card"
        v-for="(item, index) in tableData"
        :key="index"
        @click.stop="openDialog($event, item.NoteCover, item.NoteId)"
      >
        <img :src="item.NoteCover" alt="Card Image" class="card-image" />
        <div class="notes-checkbox">
          <el-checkbox
            v-model="item.checkboxValue"
            @click.stop
            label=""
            size="large"
          />
        </div>
        <p class="notes-title line_ellipsis">{{ item.NoteTitle }}</p>
        <div style="width: 100%; height: 10px"></div>
        <el-row class="notes-content">
          <img
            :src="item.VipHeadimgurl"
            style="width: 10%; border-radius: 50%; position: relative"
          />
          <p style="margin-left: 4%; font-size: 13px; width: 64%">
            {{ item.VipName }}
          </p>
          <div class="notes-like">
            <img
              src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/like.png"
              style="width: 15px; height: 15px"
            />
            <span style="font-size: 11px; padding-left: 2px">{{
              item.FavoriteCnt
            }}</span>
          </div>
        </el-row>
      </div>
      <!-- 更多卡片 -->
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="->,total, sizes, prev, pager, next"
        v-model:currentPage="query.PageStartRow"
        v-model:page-size="query.PageRowCount"
        :page-sizes="[15, 50, 100]"
        :total="pageTotal"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>
    <div class="dialog" v-if="showMask" @click="closeDialog" ref="dialogRef">
      <div class="dialog-content" ref="dialogContentRef" @click.stop>
        <div class="left-container" :style="{ width: mediaWidth + 'px' }">
          <el-carousel
            :style="{ width: mediaWidth + 'px' }"
            v-if="NoteInfo.NoteConfigJson"
          >
            <el-carousel-item
              v-for="item in NoteInfo.NoteConfigJson.TopRotationImages"
              :key="item"
            >
              <img class="img-carousel" :src="item" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="right-container">
          <div class="author-container">
            <div class="author-wrapper">
              <div class="info">
                <img
                  style="width: 40px; height: 40px; border-radius: 100%"
                  :src="NoteInfo.VipHeadimgurl"
                />
                <span class="line_ellipsi" style="padding-left: 12px">{{
                  NoteInfo.VipName
                }}</span>
              </div>
            </div>
          </div>
          <div class="note-scroller">
            <div class="note-content">
              <div style="width: 100%; height: 2px"></div>
              <div class="title">{{ NoteInfo.NoteTitle }}</div>
              <div class="detail-desc">{{ NoteInfo.NoteContent }}</div>
              <p>
                <span
                  v-for="(item, index) in NoteInfo.Tags"
                  :key="index"
                  style="margin-right: 2px; color: #13386c; cursor: pointer"
                  >{{ "#" + item.Name }}&nbsp;&nbsp;</span
                >
              </p>
              <div class="bottom-container">
                <span
                  data-v-cd6ca71e=""
                  class="date"
                  selected-disabled-search=""
                  >编辑于 {{ NoteInfo.CreateTimeDate }} 上海</span
                >
              </div>
            </div>
            <div class="divider"></div>
            <div class="comments-el">
              <div class="comments-container">
                <div class="total">共 {{ NoteInfo.CommentCnt }} 条评论</div>
                <div class="list-container">
                  <div
                    class="parent-comment"
                    v-for="(item, index) in NoteInfo.Commentes"
                    :key="index"
                  >
                    <div class="comment-item">
                      <div class="comment-inner-container">
                        <div class="avatar">
                          <img
                            :src="item.Headimg ? item.Headimg : HeaderImg"
                            style="
                              width: 40px;
                              height: 40px;
                              border-radius: 100%;
                            "
                          />
                        </div>
                        <div class="right">
                          <div class="author-wrapper">
                            <div class="author">
                              {{ item.Nickname ? item.Nickname : "游客" }}
                            </div>
                          </div>
                          <div class="right-content">{{ item.Content }}</div>
                          <div data-v-3fb0d96e="" class="info">
                            <div class="date">
                              <span>{{ item.HTime }}</span>
                            </div>
                            <div class="interactions">
                              <div class="like">
                                <img
                                  src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/like.png"
                                  style="width: 16px; height: 16px"
                                />
                                <span style="margin-left: 3px">{{
                                  item.LoveCnt
                                }}</span>
                              </div>
                              <div class="reply">
                                <img
                                  src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/comment.png?v=1"
                                  style="width: 16px; height: 16px"
                                /><span style="margin-left: 3px">{{
                                  item.CommentCnt
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="reply-container"
                      v-if="item.SubCommentes.length > 0"
                    >
                      <div class="list-container">
                        <div
                          class="comment-item"
                          v-for="(itemSub, indexSub) in item.SubCommentes"
                          :key="indexSub"
                        >
                          <div class="comment-inner-container">
                            <div class="avatar">
                              <img
                                :src="
                                  itemSub.Headimg ? itemSub.Headimg : HeaderImg
                                "
                                style="
                                  width: 23px;
                                  height: 23px;
                                  border-radius: 100%;
                                "
                              />
                            </div>
                            <div class="right">
                              <div class="author-wrapper">
                                <div class="author">
                                  {{
                                    itemSub.Nickname ? itemSub.Nickname : "游客"
                                  }}
                                </div>
                              </div>
                              <div class="right-content">
                                {{ itemSub.Content }}
                              </div>
                              <div data-v-3fb0d96e="" class="info">
                                <div class="date">
                                  <span>{{ itemSub.HTime }}</span>
                                </div>
                                <div class="interactions">
                                  <div class="like">
                                    <img
                                      src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/like.png"
                                      style="width: 16px; height: 16px"
                                    />
                                    <span style="margin-left: 3px">{{
                                      itemSub.LoveCnt
                                    }}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="comment">
            <div class="interactions engage-bar">
              <div class="engage-bar-container">
                <div
                  class="engage-bar-approve"
                  v-if="NoteInfo.NoteStatus == 1"
                  @click="noteApprove(NoteInfo.NoteId, 'approve')"
                >
                  审批
                </div>
                <div
                  class="engage-bar-remove"
                  v-if="NoteInfo.NoteStatus != 2"
                  @click="noteApprove(NoteInfo.NoteId, 'remove')"
                >
                  下架
                </div>
                <div
                  class="engage-bar-remove"
                  v-else="NoteInfo.NoteStatus == 2"
                >
                  已下架
                </div>
                <div class="m-like">
                  <img
                    src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/m-like.png?v=3"
                    style="width: 20px; height: 20px"
                  />
                  <div class="m-span">{{ NoteInfo.LoveCnt }}</div>
                </div>
                <div class="m-like m-collect">
                  <img
                    src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/m-collect.png?v=6"
                    style="width: 20px; height: 20px"
                  />
                  <div class="m-span">{{ NoteInfo.FavoriteCnt }}</div>
                </div>
                <div class="m-like m-comment">
                  <img
                    src="https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/m-comment.png?v=6"
                    style="width: 20px; height: 20px"
                  />
                  <div class="m-span">{{ NoteInfo.CommentCnt }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <delDialog
      ref="editor"
      :IDs="NotesIDs"
      :OpType="modalType"
      :BillType="'BJ'"
      :Visible="ModalVisible"
      @RefreshData="RefreshData"
      @CloseVisible="CloseVisible"
    >
    </delDialog>
  </div>
</template>
<script setup>
const HeaderImg =
  "https://zytest15.oss-cn-shanghai.aliyuncs.com/liniu/miniprogram-new/tourist.jpg";
import delDialog from "@/components/common/del_dialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { SearchNotes, GetNote } from "../../api/vip.js";
import { GetTagListByGroupId } from "../../api/shopApi.js";

const store = useStore();
const router = useRouter();
const query = reactive({
  search: {
    note_status: "1",
    search_keyword: "",
    vip_name: "",
    vip_cell: "",
  },
  PageStartRow: 1,
  PageRowCount: 15,
});

const tableLoading = ref(false);
const tableData = ref([]);
const pageTotal = ref(0);

const init = async () => {
  getData();
  GetTagListByGroupIdApi();
};

// 获取表格数据
const getData = async () => {
  tableLoading.value = true;
  let res = await SearchNotes({
    PageStartRow: (query.PageStartRow - 1) * query.PageRowCount,
    PageRowCount: query.PageRowCount,
    SearchCondition: query.search,
  });
  tableLoading.value = false;
  if (res.Code == 200) {
    if (res.DataMap.Data) {
      res.DataMap.Data.forEach((row) => {
        row.checkboxValue = false;
      });
      tableData.value = res.DataMap.Data;
    } else {
      tableData.value = [];
    }
    pageTotal.value = res.DataMap.ToalCount;
  }
};
const NoteInfo = ref({});
const GetNoteApi = async (ID) => {
  let res = await GetNote({
    NoteId: ID,
  });
  if (res.Code == 200) {
    if (res.DataMap.NoteConfig) {
      res.DataMap.NoteConfigJson = JSON.parse(res.DataMap.NoteConfig);
    } else {
      res.DataMap.NoteConfigJson = {};
    }
    res.DataMap.CreateTimeDate = res.DataMap.CreateTime.split(" ")[0]; //取日期
    NoteInfo.value = res.DataMap;
  }
};
// 查询操作
const handleSearch = () => {
  query.PageStartRow = 1;
  getData();
};
// 分页导航
const handlePageChange = (val) => {
  query.PageStartRow = val;
  getData();
};
const handleSizeChange = (val) => {
  query.PageRowCount = val;
  getData();
};
//批量审批
const handleApprove = () => {
  let chooseID = [];
  tableData.value.forEach((row) => {
    if (row.checkboxValue) {
      chooseID.push(row.NoteId);
    }
  });
  if (chooseID.length == 0) {
    ElMessage.error("请先选择数据");
    return;
  }
  modalType.value = "BJApprove"; //审批
  ModalVisible.value = true;
  NotesIDs.value = chooseID;
};

//删除单条笔记
const Del = (NoteId) => {
  NotesIDs.value = [];
  NotesIDs.value.push(NoteId);
  modalType.value = "BJDel"; //审批
  ModalVisible.value = true;
};
//下架
const Remove = (NoteId) => {
  NotesIDs.value = [];
  NotesIDs.value.push(NoteId);
  modalType.value = "BJRemove"; //审批
  ModalVisible.value = true;
};
//针对单个审批
const noteApprove = (NoteId, type) => {
  if (type == "remove") {
    //下架
    NotesIDs.value = [];
    NotesIDs.value.push(NoteId);
    modalType.value = "BJRemove"; //审批
    ModalVisible.value = true;
  }
  if (type == "approve") {
    let chooseID = [];
    chooseID.push(NoteId);
    modalType.value = "BJApprove"; //审批
    ModalVisible.value = true;
    NotesIDs.value = chooseID;
  }
};
////////////////////////////////////////////////////////////////
//下拉标签查询
const tagList = ref([]);
const GetTagListByGroupIdApi = async () => {
  let res = await GetTagListByGroupId({
    GroupId: 4,
  });
  if (res.Code == 200) {
    tagList.value = res.DataMap;
  }
};
////////////////////////////////////////////////////////////////
//批量操作
const multipleSelection = ref([]);
const NotesIDs = ref([]);
const modalType = ref("");
const ModalVisible = ref(false);
const RefreshData = () => {
  //列表刷新
  handleSearch();
};
const CloseVisible = (isBoolean) => {
  showMask.value = false;
  ModalVisible.value = isBoolean;
};
////////////////////////////////////////////////////////////////
const showMask = ref(false);
const loadImg = (imgValue) => {
  const maxImageHeight = window.innerHeight - 64;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgValue;
    img.onload = (e) => {
      const realWidth = (maxImageHeight / e.target.height) * e.target.width;
      resolve({
        realWidth,
        realHeight: maxImageHeight,
      });
    };
  });
};

const mediaWidth = ref();
const showImgValue = ref("");
const zoom = ref();
let firstInfo = {},
  lastInfo = {},
  dialogNode = null,
  maskNode = null,
  convertY = 0,
  convertX = 0;
const openDialog = async (e, img, NoteId) => {
  showImgValue.value = img;
  // F：记录初始状态的位置，首先为实现该效果，弹窗的初始位置需与卡片重叠，且左侧图片的大小刚好与卡片中的图片大小一致
  firstInfo = e.target.getBoundingClientRect();
  // 点击弹窗，获取当前图片的实际宽高，此处是因为小红书内容弹窗左侧的图片的宽高是动态计算的，所以需要动态获取
  const { realWidth, realHeight } = await loadImg(img);
  mediaWidth.value = realWidth;
  // 展示弹窗，获取弹窗的最终状态的位置
  showMask.value = true;
  GetNoteApi(NoteId);
  nextTick(() => {
    dialogNode = document.querySelector(".dialog-content");
    maskNode = document.querySelector(".dialog");
    // L：记录弹窗的最终态的位置和大小信息
    lastInfo = dialogNode.getBoundingClientRect();

    // I：计算弹窗初始态和最终态的位移差和缩放的比例，并设置到弹窗上
    // 卡片图片与弹窗图片保持一致，所以缩放比例就是卡片图片的宽度与弹窗图片宽度的比例
    // 然后通过计算位移将弹窗移动到卡片的位置
    zoom.value = firstInfo.width / mediaWidth.value;
    convertX = firstInfo.x - lastInfo.x;
    convertY = firstInfo.y - lastInfo.y;

    // P: 设置弹窗到初始状态
    // 注意这里的一个技巧：将缩放放置到translate的前面，这样计算位移就不需要考虑缩放后产生的位移差了
    dialogNode.style.transform = `translate(calc(-50% + ${convertX}px), calc(-50% + ${convertY}px)) scale(${zoom.value}) `;
    dialogNode.style.transformOrigin = "left top";

    // P：下一帧取消回到初始状态的动画效果，则恢复到最终态
    requestAnimationFrame(() => {
      // 最后一定要再次设置元素的宽度，否则关闭弹窗时的宽度过渡不生效
      dialogNode.style.transition = "transform 0.4s, width 0.4s";
      dialogNode.style.width = lastInfo.width + "px";
      dialogNode.style.transform = "";
      maskNode.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    });
  });
};

const closeDialog = () => {
  // F: 记录初始状态
  const dialogFirstInfo = dialogNode.getBoundingClientRect();
  // L：设置到最终态
  dialogNode.style.left = firstInfo.x + "px";
  dialogNode.style.top = firstInfo.y + "px";
  dialogNode.style.transition = "none";
  dialogNode.style.width = mediaWidth.value + "px";
  dialogNode.style.overflow = "hidden";
  dialogNode.style.transform = `scale(${zoom.value})`;

  nextTick(() => {
    // F: 记录最终态
    const dialogLastInfo = dialogNode.getBoundingClientRect();
    // I: 计算位移
    const convertX = dialogFirstInfo.x - dialogLastInfo.x;
    const convertY = dialogFirstInfo.y - dialogLastInfo.y;
    // P：恢复到初始位置
    dialogNode.style.width = dialogFirstInfo.width + "px";
    dialogNode.style.overflow = "visible";
    dialogNode.style.transform = `translate(${convertX}px, ${convertY}px) scale(1)`;
    // 下一帧过渡到最终状态
    requestAnimationFrame(() => {
      dialogNode.style.transition = "transform 0.4s, width 0.4s";
      dialogNode.style.width = mediaWidth.value + "px";
      dialogNode.style.overflow = "hidden";
      dialogNode.style.transform = `scale(${zoom.value})`;
      maskNode.style.backgroundColor = "transparent";
    });

    dialogNode.addEventListener("transitionend", () => {
      // 动画结束后移除弹窗
      showMask.value = false;
    });
  });
};
////////////////////////////////////////////////////////////////
init();
watch(
  () => router.currentRoute.value,
  (data) => {
    let isRenovate = 0;
    store.state.tags.tagsList.forEach((row) => {
      if (row.title == "笔记管理") {
        isRenovate = 1;
      }
    });
    if (
      store.state.tags.pageSaerch.Search == 1 &&
      isRenovate == 1 &&
      store.state.tags.pageSaerch.titlePage == "笔记管理"
    ) {
      handleSearch();
      store.commit("tags/setPageSaerch", { Search: 0, titlePage: "" });
    }
  }
);
////////////////////////////////////////////////////////////////
</script>
<style>
.left-container .el-carousel__container {
  height: 100% !important;
}
</style>
<style scoped lang="less">
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 26px; /* 项目之间的间距 */
  padding: 16px;
  width: 100%;
}

.notes-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 268px;
  width: calc(16% - 26px); /* 每行三个卡片，减去间距 */
  transition: transform 0.3s ease; /* 鼠标悬停时的动画效果 */
  .notes-checkbox {
    position: absolute;
    bottom: 52px;
    left: 4px;
    z-index: 99;
  }
}

.notes-card:hover {
  cursor: pointer;
  transform: translateY(-5px); /* 鼠标悬停时稍微向上移动 */
}

.card-image {
  width: 100%;
  height: 180px; /* 根据需要调整高度 */
  object-fit: cover;
}
.notes-title {
  padding-left: 32px;
}
.notes-content {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.notes-like {
  width: 22%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 响应式设计 */
@media (max-width: 1400px) {
  .notes-card {
    width: calc(25% - 26px); /* 每行两个卡片 */
  }
}
@media (max-width: 1200px) {
  .notes-card {
    width: calc(33.33% - 26px); /* 每行三个卡片 */
  }
}
@media (max-width: 768px) {
  .notes-card {
    width: calc(50% - 26px); /* 每行两个卡片 */
  }
}

@media (max-width: 480px) {
  .notes-card {
    width: 100%; /* 每行一个卡片 */
  }
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  transition: background-color 0.4s;
  z-index: 100;
  .dialog-content {
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    height: calc(100% - 64px);
    background-color: #fff;
    border-radius: 20px;
    overflow: visible;
    .left-container {
      display: flex;
      justify-content: center;
      flex-shrink: 0;
      flex-grow: 0;
      height: 100%;
      border-radius: 20px 0 0 20px;
      overflow: hidden;
      .img-carousel {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
    .right-container {
      width: 340px;
      height: 100%;
      flex-shrink: 0;
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: 0 20px 20px 0;
      overflow: hidden;
      .author-container {
        padding: 12px;
        border-bottom: solid 1px rgba(0, 0, 0, 0.08);
        .author-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;

          height: 100%;
          border-bottom: 1px solid transparent;
          .info {
            display: flex;
            align-items: center;
            overflow: hidden;
            .interactions {
              display: flex;
              margin-left: -2px;
              .reply {
                padding: 0 4px;
                margin-left: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              }
            }
          }
        }
      }
      .note-scroller {
        transition: scroll 0.4s;
        overflow-y: scroll;
        flex-grow: 1;
        .note-content {
          padding: 0 16px 16px 16px;
          color: #333;
          .title {
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 18px;
            line-height: 140%;
          }
          .detail-desc {
            margin: 0;
            font-weight: 400;
            font-size: 16px;
            line-height: 150%;
            color: #333;
            white-space: pre-wrap;
            overflow-wrap: break-word;
          }
          .bottom-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 12px;
            .date {
              font-size: 14px;
              line-height: 120%;
              color: rgba(51, 51, 51, 0.6);
            }
          }
        }
        .divider {
          margin: 0 16px;
          list-style: none;
          height: 0;
          border-color: rgba(0, 0, 0, 0.08);
          border-style: solid;
          border-width: 1px 0 0;
        }
        .comments-el {
          position: relative;
          .comments-container {
            padding: 16px;
            .total {
              font-size: 14px;
              color: rgba(51, 51, 51, 0.6);
              margin-bottom: 12px;
            }
            .list-container {
              position: relative;
              .parent-comment {
                margin-bottom: 16px;
                .comment-item {
                  position: relative;
                  display: flex;
                  padding: 8px;
                  .comment-inner-container {
                    position: relative;
                    display: flex;
                    z-index: 1;
                    width: 100%;
                    flex-shrink: 0;
                    .avatar {
                      flex: 0 0 auto;
                    }
                    .right {
                      margin-left: 12px;
                      display: flex;
                      flex-direction: column;
                      font-size: 14px;
                      flex-grow: 1;
                      .author-wrapper {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .author {
                          display: flex;
                          align-items: center;
                        }
                      }
                      .right-content {
                        margin-top: 4px;
                        line-height: 140%;
                        color: #333;
                        .note-text {
                        }
                      }
                      .info {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        font-size: 12px;
                        line-height: 16px;
                        color: rgba(51, 51, 51, 0.6);
                        .date {
                          margin: 8px 0;
                        }
                        .interactions {
                          display: flex;
                          margin-left: -2px;
                          .like {
                            display: flex;
                            justify-content: center;
                          }
                          .reply {
                            padding: 0 4px;
                            margin-left: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                          }
                        }
                      }
                    }
                  }
                }
                .reply-container {
                  margin-left: 52px;
                  .list-container {
                    position: relative;
                  }
                }
              }
            }
          }
        }
      }
      .comment {
        .interactions.engage-bar {
          padding: 16px 0 0 16px;
          padding-bottom: env(safe-area-inset-bottom);
          flex-basis: unset;
          height: unset;
        }
        .interactions {
          flex-shrink: 0;
          padding: 25px 25px 0 25px;
          height: 142px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          flex-basis: 130px;
          z-index: 1;
          .engage-bar-container {
            width: 100%;
            position: relative;
            display: flex;
            padding-bottom: 20px;
            justify-content: flex-end;
            .m-like {
              display: flex;
              justify-content: center;
              margin-right: 20px;
              .m-span {
                font-size: 16px;
                margin-left: 6px;
              }
            }
            .engage-bar-approve {
              position: absolute;
              left: 0;
              color: #f56c6c;
              cursor: pointer;
            }
            .engage-bar-remove {
              position: absolute;
              left: 40px;
              color: #f56c6c;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
