<template>
  <div>
    <loadingPage :loadingText="loadingText"></loadingPage>

    <el-input :id="inputID" v-model="itemName" class="input-with-select" :disabled="isdisable" clearable>
      <el-button slot="append" icon="el-icon-search" @click="showQueryDialog" :disabled="isdisable"></el-button>
    </el-input>

    <div class="rfidBlock px-1" :title="itemNo">ItemNo: {{itemNo}}</div>

    <el-dialog :visible.sync="dlgQueryItem" width="80%" :close-on-click-modal="false" append-to-body>
      <queryItem :reloading="dlgQueryItem" :returnType="returnType" v-model="selectedItemRows" :filterCondition="filterCondition" :IsStatusOn="true" :defaultList="itemList">
        <el-button slot="actionBtn" type="primary" @click="setItemNo">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryItem>
    </el-dialog>

  </div>
</template>


<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import ItemQ from '@/components/MDL07/MA0701/MA070101Q';
  import { getItemListByName } from '@/assets/js/iFarmer/manager/configManager';
  export default {
    /*
      inputID: SwineInput ID 必填
      defaultValue: ParentModel 對應欄位值 必填
      setItem: 回傳的對應欄位名稱 必填
      disable: (true/false)
      */
    props: [
      'filterCondition',
      'inputID',
      'disable',
      'defaultCode',
      'defaultName',
      'colName'
    ],
    data: function() {
      return {
        dlgQueryItem: false,
        isdisable: this.disable != undefined ? this.disable : false,
        returnType: 'single',
        itemNo: '',
        itemName: '',
        itemList: [],
        loadingText: null,
        selectedItemRows: []
      };
    },
    methods: {
      showAlert(title, msg) {
        var vueInstance = this;
        vueInstance.$notify.warning({
          title: title,
          message: msg
        });
      },
      getItem(itemName) {
        var vueInstance = this;
        if (
          vueInstance.itemName != '' &&
          vueInstance.itemName != undefined &&
          vueInstance.itemList.length == 0
        ) {
          let filter =
            vueInstance.filterCondition != undefined
              ? vueInstance.filterCondition
              : {};
          vueInstance.loadingText = '資料搜尋中';
          getItemListByName(itemName, filter, function(response) {
            vueInstance.loadingText = null;
            console.log(response)
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應物件名稱');
                vueInstance.returnItem({});
              } else if (response.Data.length == 1)
                vueInstance.returnItem(response.Data[0]);
              else {
                vueInstance.itemList = response.Data;
                vueInstance.dlgQueryItem = true;
              }
            }
          });
        }
      },
      returnItem(item) {
        var vueInstance = this;
        let col = this.colName != undefined ? this.colName : 'ItemNo';
        if (item.Name != undefined) {
          vueInstance.itemName = item.Name;
          vueInstance.itemNo = item.ItemNo;
          vueInstance.$emit('selectItem', col, item);
        } else {
          vueInstance.itemList = [];
          vueInstance.itemName = '';
          vueInstance.itemNo = '';
          vueInstance.$emit('selectItem', col, item);
        }
      },
      setItemNo() {
        var vueInstance = this;
        if (vueInstance.selectedItemRows.length > 0) {
          vueInstance.returnItem(vueInstance.selectedItemRows[0]);
          vueInstance.selectedItemRows = [];
          vueInstance.itemList = [];
          vueInstance.dlgQueryItem = false;
        }
      },
      showQueryDialog() {
        if (!this.isdisable) this.dlgQueryItem = true;
      }
    },
    mounted: function() {
      var vueInstance = this;
      $('#' + vueInstance.inputID).keyup(function(event) {
        vueInstance.itemNo = '';
        if (vueInstance.itemName != '' && event.keyCode == 13) {
          vueInstance.getItem(vueInstance.itemName);
        }
      });
      $('#' + vueInstance.inputID).blur(function() {
        if (vueInstance.itemName != '' && vueInstance.itemNo == '')
          vueInstance.getItem(vueInstance.itemName);
      });
      this.itemNo = this.defaultCode;
      this.itemName = this.defaultName;
      this.isdisable = this.disable != undefined ? this.disable : false;
    },
    watch: {
      defaultCode() {
        this.itemNo = this.defaultCode;
      },
      defaultName() {
        this.itemName = this.defaultName;
      },
      disable() {
        this.isdisable = this.disable;
      },
      itemName() {
        if (this.itemName == '') this.returnItem({});
      },
      dlgQueryItem() {
        if (!this.dlgQueryItem && this.itemNo == '') this.returnItem({});
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'queryItem': ItemQ
    }
  };
</script>

<style>
  .el-form-label-left .el-form-item__label {
    text-align: center;
  }

  .rfidBlock {
    line-height: 20px;
    font-size: 12px;
  }
</style>
