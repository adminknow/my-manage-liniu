<template>
  <el-row class="card-box">
    <el-col :span="5">
      <div class="card">
        <el-row>
          <el-col :span="11">
            <div class="card-img">
              <img
                style="width: 65px; height: 65px"
                src="../../assets/imgs/img-order1.png"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="card-text">
              <div
                class="card-text-desc"
                v-if="loginUser.UnitName == '礼牛网'"
              >
                本年已建
              </div>
              <div class="card-text-desc" v-else>本期已建</div>
              <div class="card-text-number">
                {{ statData.this_year_create_cnt || "0" }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="5" :offset="1">
      <div class="card">
        <el-row>
          <el-col :span="11">
            <div class="card-img">
              <img
                style="width: 65px; height: 65px"
                src="../../assets/imgs/img-order3.png"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="card-text">
              <div
                class="card-text-desc"
                v-if="loginUser.UnitName == '礼牛网'"
              >
                本年已兑
              </div>
              <div class="card-text-desc" v-else>本期已兑</div>
              <div class="card-text-number">
                {{ statData.this_year_exchange_cnt || "0" }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="5" :offset="1">
      <div class="card">
        <el-row>
          <el-col :span="11">
            <div class="card-img">
              <img
                style="width: 65px; height: 65px"
                src="../../assets/imgs/img-order4.png"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="card-text">
              <div class="card-text-desc">今日销售</div>
              <div class="card-text-number">
                {{ statData.today_sale_cnt || "0" }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="5" :offset="1">
      <div class="card">
        <el-row>
          <el-col :span="11">
            <div class="card-img">
              <img
                style="width: 65px; height: 65px"
                src="../../assets/imgs/img-order4.png"
              />
            </div>
          </el-col>
          <el-col :span="13">
            <div class="card-text">
              <div class="card-text-desc">今日已兑</div>
              <div class="card-text-number">
                {{ statData.today_exchange_cnt || "0" }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import Cookie from "js-cookie"

// Props
const props = defineProps({
  statData: {
    type: Object,
    default: () => ({
      this_year_create_cnt: "0",
      this_year_exchange_cnt: "0", 
      today_exchange_cnt: "0",
      today_sale_cnt: "0"
    })
  }
})

// Data
const loginUser = JSON.parse(Cookie.get("User"))
</script>

<style scoped>
.card-box {
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-img {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 65px;
}

.card-img img {
  cursor: pointer;
}

.card-text {
  height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.card-text-desc {
  color: #797979;
  font-size: 14px;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.card-text-number {
  color: #f56c6c;
  font-weight: 600;
  font-size: 24px;
}
</style>