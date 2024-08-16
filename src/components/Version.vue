<template>
  <div class="row">
    <div class="col-padding col-md-12">
      <el-card>

        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">版本資訊</div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">

            <el-collapse v-model="activeNames" @change="handleChange" accordion>
              <el-collapse-item title="✓ 版本號 : V2.1.0003 PO日期: 2018/12/19" name="V2.1.0003">
                <div class="main-title">一、報表</div>
                <div class="main-title">1. RP020209 母豬分娩斷奶情況分析</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>修正查詢欄位判斷</div>

                <div class="main-title">2. RP020210 生産日報表</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>修改時間區間查詢判斷</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>WebAPI轉V2</div>

                <div class="main-title">二、專業用藥調整，調整專業用藥可選取的專業診療單內容相關檔案</div>
                <div class="main-title">三、調整仔豬移欄作業，移出時變更SwineState為保育豬</div>
                <div class="main-title">四、調整移欄作業，有變更豬隻狀態時(待産移轉、仔豬轉保育)改為移出時變更</div>
                <div class="main-title">五、除了有變更豬隻狀態的移欄作業，其餘移欄不産生SwineStatusChangeHistory</div>
              </el-collapse-item>

              <el-collapse-item title="  版本號 : V2.1.0001 PO日期: 2018/12/04" name="V2.1.0001">
                <div class="main-title">一、新增功能</div>
                <div class="main-title">1. 批量捨數據維護功能</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>使用者可透該批量建立捨欄，快速建立新增的棟捨</div>

                <div class="main-title">2. 批量欄數據維護功能:</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>使用者可透該批量建立捨欄，快速建立新增的欄位</div>

                <div class="main-title">3. 批量死淘作業:</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>死淘作業新增銷售的選項，用戶可透過批量死淘功能，執行商品豬銷售</div>

                <div class="main-title">4. 新增報錶:</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>位置豬隻存欄明細錶</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>料塔耗用明細錶</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>群體餵飼紀錄明細錶</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>個體餵飼紀錄明細錶</div>

                <div class="main-title">二、功能修正</div>
                <div class="main-title">1. 修正仔豬批號規則</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>依分娩棟捨序號進行批號區分</div>
                <div class="main-content"><i class="el-icon-caret-right"></i>新增棟捨維護時，依LocationTypeCode進行分娩棟捨序號寫入</div>

              </el-collapse-item>
            </el-collapse>
          </div>
        </div>

      </el-card>
    </div>


  </div>
</template>
<style type=text/css>
    .main-title{padding:10px 0 2px}
    .main-content{padding:2px 20px}
</style>

<script>
  export default {
    data() {
      return {
        activeNames: ["V2.1.0003"],
      };
    },
    methods: {
      handleChange(val) {}
    }
  };

</script>
