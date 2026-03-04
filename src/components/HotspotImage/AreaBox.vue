<template>
  <div
    class="areaBox"
    :style="{
      width: areaInit.areaWidth * ratioWidth + 'px',
      height: areaInit.areaHeight * ratioHeight + 'px',
      left: areaInit.starX * ratioWidth + 'px',
      top: areaInit.starY * ratioHeight + 'px',
    }"
    @dblclick="editBoxShow = false"
    @mousedown.left.stop="mouseDown($event)"
    @mouseup.left.stop="mouseUp($event)"
  >
    <span class="promptText">{{ title }}</span>
    <!--删除-->
    <div class="del" @click.stop="del()" />
    <!--形变点-->
    <div
      class="shape"
      @mousedown.left.stop="shapeDown($event)"
      @mouseup.left.stop="mouseUp($event)"
    />
    <!--编辑框-->
    <div v-show="editBoxShow" class="editBox" @mousedown.stop=""></div>
  </div>
</template>

<script>
export default {
  name: "AreaBox",
  props: {
    areaInit: {
      type: Object,
      default: () => {},
    },
    ratioHeight: {
      type: String,
      default: "1",
    },
    ratioWidth: {
      type: String,
      default: "1",
    },

    title: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      editBoxShow: false,
      search: "小黄人",
      promptText: "双击设置热区",
      // box操作初始点
      move: {
        // 拖动
        startX: 0,
        starY: 0,
        // 形变
        start1X: 0,
        start1Y: 0,
      },
      // 编辑链接的信息
      // 0 -> 代表默认
      urlMessage: {
        // 0 -> 选择商品；1 -> 输入链接
        methods: 1,
        select: "_blank",
        url: "",
        // 如果在选择商品页面对应的ID,标记已选
        sign: null,
      },
      // 选择商品的表单数据
      tableData: [],
    };
  },
  mounted() {},
  methods: {
    // 删除
    del() {
      this.$emit("DelAreaBox", this.id);
    },
    // 开始拖动
    mouseDown(e) {
      this.starX = e.clientX;
      this.starY = e.clientY;
      if (!document.onmousemove) {
        const initX = this.areaInit.starX;
        const initY = this.areaInit.starY;
        document.onmousemove = (ev) => {
          this.areaInit.starX = initX + ev.clientX - this.starX;
          this.areaInit.starY = initY + ev.clientY - this.starY;
        };
      }
    },
    // 结束拖动/变形
    mouseUp() {
      document.onmousemove = null;
    },
    // 形变开始
    shapeDown(e) {
      this.star1X = e.clientX;
      this.star1Y = e.clientY;
      if (!document.onmousemove) {
        const initX = this.areaInit.areaWidth;
        const initY = this.areaInit.areaHeight;
        document.onmousemove = (ev) => {
          this.areaInit.areaWidth = initX + ev.clientX - this.star1X;
          this.areaInit.areaHeight = initY + ev.clientY - this.star1Y;
        };
      }
    },
  },
};
</script>

<style scoped lang="less" ref="stylesheet/less">
.areaBox {
  position: absolute;
  background: rgba(#2980b9, 0.3);
  border: 0.7px dashed #34495e;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #34495e;
  font-size: 14px;
  cursor: move;

  .promptText {
    overflow: hidden;
    display: inline;
    max-width: 100%;
    max-height: 100%;
    text-align: center;
    font-weight: 600;
    color: #f56c6c;
  }

  .del {
    width: 10px;
    height: 10px;
    background: #bdc3c7;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate3d(50%, -50%, 0);
    cursor: default;
  }

  .del:hover {
    background: #ecf0f1;
  }

  .shape {
    position: absolute;
    width: 7px;
    height: 7px;
    background: transparent;
    right: 0;
    bottom: 0;
    transform: translate3d(50%, 50%, 0);
    cursor: nwse-resize;
  }

  .editBox {
    position: fixed;
    display: block;
    min-width: 100%;
    min-height: 100%;
    z-index: 999;
    cursor: default;
    background: rgba(#2c3e50, 0.8);
    top: 0;
    left: 0;
    animation: fadeIn 0.5s;

    .editCase {
      width: 50%;
      /*height: 100%;*/
      border-radius: 5px;
      overflow: hidden;
      background: #ecf0f1;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      display: flex;
      flex-direction: column;

      .caseTitle {
        height: 30px;
        line-height: 30px;
        padding-left: 7px;
        background: #409eff;
        color: #ecf0f1;
        position: relative;

        .close {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #bdc3c7;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate3d(-80%, -50%, 0);
        }

        .close:hover {
          background: #ecf0f1;
        }
      }

      .caseContent {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 15px 15px 25px;

        .urlMethod {
          display: flex;
          height: 50px;
          align-items: center;

          > div {
            width: 100px;
            height: 27px;
            border: 0.7px solid #409eff;
            text-align: center;
            line-height: 27px;
            transition: all 0.5s;
          }

          > div:first-child {
            border-right: 0;
          }

          .active {
            background: #409eff;
            color: #ecf0f1;
          }
        }

        .selectBox {
          display: flex;
          height: 30px;
          align-items: center;

          .openWay {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;

            .dot {
              width: 12px;
              height: 12px;
              border: 0.7px solid #409eff;
              border-radius: 50%;
              margin-right: 3px;
            }

            .active {
              background: #409eff;
              transition: all 0.5s;
            }
          }
        }

        .contentBox {
          flex: 1;
          animation: fadeIn 0.5s;

          .searchBox {
            display: flex;
            align-items: center;
            height: 40px;

            input {
              outline: none;
              width: 200px;
              height: 30px;
              border: 0.7px solid #409eff;
              border-radius: 3px;
              padding-left: 5px;
            }

            .urlInput {
              width: 80%;
            }

            .btn {
              width: 70px;
              height: 30px;
              border-radius: 3px;
              background: #409eff;
              color: #ecf0f1;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 10px;
            }
          }

          .handle {
            margin-bottom: 70px;
          }

          .searchList {
            margin-bottom: 30px;
            background: #fff;
          }
        }

        .btnBox {
          display: flex;
          justify-content: flex-end;

          > div {
            width: 70px;
            height: 30px;
            border-radius: 3px;
            background: #409eff;
            color: #ecf0f1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          > div:first-child {
            margin-right: 7px;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
