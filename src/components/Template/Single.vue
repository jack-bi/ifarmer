<template>
  <div class="row">
    <div class="col-padding col-md-4">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">Info Block</div>
            <div class="col-8" style="text-align: right">
              <el-button-group>
                <el-button type="buttonSave" @click="initWork" icon="el-icon-plus" size="mini" circle></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <el-form :model="objModel" :rules="rules" ref="objModel" :label-position="'left'" label-width="100px">
          <!--畫書輸入區塊，請放置元件於此 -->
        </el-form>
        <div class="row">
          <div class="col-12" style="text-align: right;">
            <actionComponent :loadingText="loadingText" @deleteEvent="deleteModel" @saveEvent="save"></actionComponent>
          </div>
        </div>
      </el-card>
    </div>
    <div class="col-md-8 col-padding">
      <queryComponent :reloading="queryReload" :returnType="'Single'" v-model="selectedRows">
        <el-button slot="actionBtn" type="primary" @click="setModel">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryComponent>
    </div>
  </div>
</template>

<script>
  import FormAction from "@/components/Control/FormAction"; //儲存及刪除按鈕Component
  import {
    command
  } from '@/assets/js/iFarmer/enum/command.js'
  import store from "@/store"
  /* import {
     作業Model
   } from '@/assets/js/iFarmer/model/作業Model.js'
   import {
     Post Api
   } from "@/assets/js/iFarmer/manager/對應Manager";*/

  export default {
    data: function () {
      return {
        loginAccount: this.$store.getters.userProfile.AccountNo,//取得登入者帳號(用於寫入CreateID、ModifyID)
        loadingText: null, //控製Loading Page顯示
        queryReload: false, //控製datatable 清除紀錄
        objModel: {}, //作業Model
        selectedRows: [], //取得查詢畫麵回傳資料列表
        rules: { //ElementUi 驗整欄位內容
        }
      };
    },
    methods: {
      showAlert(type, msg) {
        var vueInstance = this;
        if(type)
          vueInstance.$notify.success({
            title: "提示",
            message: msg
          });
        else
          vueInstance.$notify.warning({
            title: "警告",
            message: msg
          });
      },
      setModel() { //取得查詢回傳資料，並asign給作業Model
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.objModel = Object.assign({}, vueInstance.selectedRows[0]);
        }
      },
      initWork() { //畫麵初始化
        var vueInstance = this;
        vueInstance.objModel = getobjModel();
        vueInstance.$refs["objModel"].resetFields();
      },
      save() {
        var vueInstance = this;
        vueInstance.loadingText = "資料處理中";
        vueInstance.queryReload = false;

        if (vueInstance.objModel.ID != "")
          vueInstance.objModel.ModifiedUserID = vueInstance.loginAccount;
        else {
          vueInstance.objModel.CreatedUserID = vueInstance.loginAccount;
        }

        postApi(
          [{
            ID: vueInstance.objModel.ID,
            SeqNo: 1,
            Name: "作業資料表名稱",
            Command: (vueInstance.objModel.ID != "") ? command.Update : command.Create,
            Entity: vueInstance.objModel
          }],
          function (response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              vueInstance.initWork;
              vueInstance.showAlert(true, "資料儲存成功");
              vueInstance.queryReload = true;
            } else
              vueInstance.showAlert(false, response.ExceptionMessage);
          })
      },
      deleteModel() {
        var vueInstance = this;
        vueInstance.loadingText = "資料處理中";
        vueInstance.queryReload = false;
        postApi(
          [{
            ID: vueInstance.objModel.ID,
            SeqNo: 1,
            Name: "作業資料表名稱",
            Command: command.Delete,
            Entity: vueInstance.objModel.ID
          }],
          function (response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              vueInstance.queryReload = true;
              vueInstance.showAlert(true, "資料刪除成功");
            } else
              vueInstance.showAlert(false, response.ExceptionMessage);
          })
      },
    },
    mounted() {
      this.initWork();
    },
    components: {
      // 'queryComponent': queryComponent,
      'actionComponent': FormAction,
    }
  };

</script>
