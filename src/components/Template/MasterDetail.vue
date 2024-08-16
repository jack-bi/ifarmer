<template>
  <div class="row">
    <div class="col-md-4 col-padding">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">Master Block</div>
            <div class="col-8" style="text-align: right">
              <el-button-group>
                <el-button type="buttonSave" @click="createMaster" icon="el-icon-plus" size="mini" circle></el-button>
                <el-button type="success" icon="el-icon-search" size="mini" circle @click="dlgQueryM = true"></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <el-form :model="MasterModel" :rules="masterRules" ref="MasterModel" :label-position="'left'" label-width="80px">

        </el-form>
        <div class="row">
          <div class="col-12" style="text-align: right;">
            <actionComponent :loadingText="loadingText" @deleteEvent="deleteAll" @saveEvent="save"></actionComponent>
          </div>
        </div>
      </el-card>
    </div>
    <div class="col-md-8 col-padding">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">Detail Block</div>
            <div class="col-8" style="text-align: right">
              <el-button-group>
                <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="editDetail()" v-show="(MasterModel.Code != null && MasterModel.Code !='') && selectedRows.length === 0"></el-button>
                <el-button type="success" icon="el-icon-edit" size="mini" circle @click="editDetail()" v-show="(MasterModel.Code != null && MasterModel.Code !='') && selectedRows.length != 0"></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="'Single'" :columns="table.head" :data="detailList" :orderIndex=1 :orderBy="'desc'"></data-table>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgQueryM" width="80%" :close-on-click-modal="false">
      <queryMasterModelComponent :reloading="dlgQueryM" :returnType="'Single'" v-model="selectedMasterRows">
        <el-button slot="actionBtn" type="primary" @click="setMaster">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryMasterModelComponent>
    </el-dialog>

    <el-dialog :title="detailEditTitle" :visible.sync="dlgEditD" width="60%" :close-on-click-modal="false">
      <div class="row">
        <el-form :model="detail" :rules="detailRules" ref="detail" :label-position="'left'" label-width="80px">

        </el-form>
      </div>
      <div class="col-12" style="text-align: right">
        <el-button size="small" type="buttonNext" @click="createNextDetail()">下一筆</el-button>
        <el-button size="small" type="buttonSave" @click="saveDetail()">儲存</el-button>
        <el-button size="small" type="warning" @click="deleteDetail()">刪除</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import datatable from '@/components/Control/DataTable';
  import FormAction from '@/components/Control/FormAction';
  import { command } from '@/assets/js/iFarmer/enum/command.js';

  export default {
    data: function() {
      return {
        dlgQueryM: false,
        dlgEditD: false,
        loadingText: null,
        MasterModel: {},
        selectedRows: [],
        detailEditTitle: '',
        selectedMasterRows: [],
        detailList: [],
        detail: {},
        masterRules: {},
        detailRules: {},
        table: {
          head: [
            {
              title: '欄位標題',
              data: '欄位名稱'
            }
          ]
        }
      };
    },
    methods: {
      showAlert(type, msg) {
        var vueInstance = this;
        if (type)
          vueInstance.$notify.success({
            title: '提示',
            message: msg
          });
        else
          vueInstance.$notify.warning({
            title: '警告',
            message: msg
          });
      },
      setMaster() {
        var vueInstance = this;
        if (vueInstance.selectedMasterRows.length > 0) {
          vueInstance.MasterModel = vueInstance.selectedMasterRows[0];
          vueInstance.selectedMasterRows = [];
          vueInstance.dlgQuery = false;
        }
      },
      getDetail(filter) {
        //選取Master後，取得對應Detail
      },
      createMaster() {},
      editDetail() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length === 0) {
          vueInstance.detailEditTitle = '新增Detail資料';
        } else {
          vueInstance.detailEditTitle = '維護Detail資料';
        }
        vueInstance.dlgEditD = true;
      },
      createNextDetail() {},
      saveDetail() {},
      deleteDetail() {},
      addTransactionList(name, command, entity) {
        var vueInstance = this;
        let trans = {};
        vueInstance.$set(trans, 'ID', entity.ID);
        vueInstance.$set(trans, 'SeqNo', vueInstance.transactionList.length + 1);
        vueInstance.$set(trans, 'Name', name);
        vueInstance.$set(trans, 'Command', command); //0:新增、1:修改、2:刪除
        vueInstance.$set(trans, 'Entity', entity);

        vueInstance.transactionList.push(trans);
      },
      save() {
        //回傳Transaction List至api進行資料處理
        var vueInstance = this;
        vueInstance.loadingText = '資料處理中';
        PostApi(vueInstance.transactionList, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.showAlert(true, '資料儲存成功');
          } else vueInstance.showAlert(false, response.ExceptionMessage);
        });
      },
      deleteAll() {
        //回傳Transaction List至api進行資料處理
        var vueInstance = this;
        vueInstance.loadingText = '資料處理中';
        PostApi(vueInstance.transactionList, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.showAlert(true, '資料刪除成功');
          } else vueInstance.showAlert(false, response.ExceptionMessage);
        });
      }
    },
    mounted() {
      this.createMaster();
    },
    components: {
      // 'queryMasterModelComponent': MasterQueryComponent,
      'data-table': datatable,
      'actionComponent': FormAction
    }
  };
</script>
