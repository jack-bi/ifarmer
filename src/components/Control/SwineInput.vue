<template>
  <div>
    <loadingPage :loadingText="loadingText"></loadingPage>
    <el-input :id="inputID" v-model="srcEarNo" class="input-with-select" :disabled="isdisable" clearable>
      <el-button slot="append" icon="el-icon-search" @click="showQueryDialog" :disabled="isdisable"></el-button>
    </el-input>

    <div class="rfidBlock px-1" :title="swineID">RFID: {{swineID}}</div>

    <el-dialog :visible.sync="dlgQueryS" width="80%" :close-on-click-modal="false" append-to-body>
      <querySwine :reloading="dlgQueryS" :returnType="returnType" v-model="selectedRows" :filterCondition="defaultFilter" :defaultList="swineList">
        <el-button slot="actionBtn" type="primary" @click="setSwineID">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </querySwine>
    </el-dialog>

  </div>
</template>


<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import VSwineQ from '@/components/CommonQuery/VSwineQ';
  import {
    getSwineList,
    getSwineListLikeSrcEarNo,
    getSwineListLikeSrcEarNoInactive,
    getSwineListLikeSrcEarNoActive,
    getSwineListBySrcEarNoSwineState
  } from '@/assets/js/iFarmer/manager/swineManager';
  import { swine } from '@/assets/js/iFarmer/model/vSwine.js';
  export default {
    /*
      inputID: SwineInput ID 必填
      modelValue: ParentModel 對應欄位值 必填
      colName: 回傳的對應欄位名稱 必填
      disable: (true/false)
      filterCondition: 豬隻篩選條件(swineType、swineStateList、status)
      */
    props: [
      'filterCondition',
      'inputID',
      'colName',
      'disable',
      'defaultCode',
      'defaultEarNo',
      'swineStateList'
    ],
    data: function() {
      return {
        dlgQueryS: false,
        isdisable: this.disable != undefined ? this.disable : false,
        returnType: 'single',
        swineID: '',
        srcEarNo: '',
        defaultFilter:
          this.filterCondition != undefined ? this.filterCondition : {},
        swineList: [],
        selectedRows: [],
        loadingText: null
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
      getSwineLikeSrcEarNo(swineType, srcEarNo) {
        var vueInstance = this;
        if (
          vueInstance.srcEarNo != '' &&
          vueInstance.srcEarNo != undefined &&
          vueInstance.swineList.length == 0
        ) {
          vueInstance.loadingText = '資料搜尋中';
          getSwineListLikeSrcEarNo(swineType, srcEarNo, function(response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應耳號');
                vueInstance.returnSwine({});
              } else if (response.Data.length == 1)
                vueInstance.returnSwine(response.Data[0]);
              else {
                vueInstance.swineList = response.Data;
                vueInstance.dlgQueryS = true;
              }
            }
          });
        }
      },
      getSwineListBySrcEarNoSwineState(swineTypeID, swineState, srcEarNo) {
        var vueInstance = this;
        if (
          vueInstance.srcEarNo != '' &&
          vueInstance.srcEarNo != undefined &&
          vueInstance.swineList.length == 0
        ) {
          vueInstance.loadingText = '資料搜尋中';
          getSwineListBySrcEarNoSwineState(
            swineTypeID,
            srcEarNo,
            {
              swineState
            },
            function(response) {
              vueInstance.loadingText = null;
              if (response.IsSuccess) {
                if (response.Data.length == 0) {
                  vueInstance.showAlert('提示', '找不到對應耳號');
                  vueInstance.returnSwine({});
                } else if (response.Data.length == 1)
                  vueInstance.returnSwine(response.Data[0]);
                else {
                  vueInstance.swineList = response.Data;
                  vueInstance.dlgQueryS = true;
                }
              }
            }
          );
        }
      },
      getSwineLikeSrcEarNoInactive(swineType, srcEarNo) {
        var vueInstance = this;
        if (
          vueInstance.srcEarNo != '' &&
          vueInstance.srcEarNo != undefined &&
          vueInstance.swineList.length == 0
        ) {
          vueInstance.loadingText = '資料搜尋中';
          getSwineListLikeSrcEarNoInactive(swineType, srcEarNo, function(
            response
          ) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應耳號');
                vueInstance.returnSwine({});
              } else if (response.Data.length == 1)
                vueInstance.returnSwine(response.Data[0]);
              else {
                vueInstance.swineList = response.Data;
                vueInstance.dlgQueryS = true;
              }
            }
          });
        }
      },
      getSwineLikeSrcEarNoActive(swineType, srcEarNo) {
        var vueInstance = this;
        if (
          vueInstance.srcEarNo != '' &&
          vueInstance.srcEarNo != undefined &&
          vueInstance.swineList.length == 0
        ) {
          vueInstance.loadingText = '資料搜尋中';
          getSwineListLikeSrcEarNoActive(swineType, srcEarNo, function(response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應耳號');
                vueInstance.returnSwine({});
              } else if (response.Data.length == 1)
                vueInstance.returnSwine(response.Data[0]);
              else {
                vueInstance.swineList = response.Data;
                vueInstance.dlgQueryS = true;
              }
            }
          });
        }
      },
      returnSwine(swine) {
        var vueInstance = this;
        let name = this.colName != undefined ? this.colName : 'SwineID';
        if (swine.SrcEarNo != undefined) {
          vueInstance.srcEarNo = swine.SrcEarNo;
          vueInstance.swineID = swine.SwineID;
          vueInstance.$emit('selectSwine', name, swine);
        } else {
          vueInstance.srcEarNo = '';
          vueInstance.swineID = '';
          vueInstance.swineList = [];
          vueInstance.$emit('selectSwine', name, swine);
        }
      },
      setSwineID() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.returnSwine(vueInstance.selectedRows[0]);
          vueInstance.selectedRows = [];
          vueInstance.swineList = [];
          vueInstance.dlgQueryS = false;
        }
      },
      showQueryDialog() {
        if (!this.isdisable) this.dlgQueryS = true;
      }
    },
    mounted: function() {
      var vueInstance = this;
      let swineType =
        vueInstance.defaultFilter['swineType'] != undefined
          ? vueInstance.defaultFilter['swineType']
          : '';
      $('#' + vueInstance.inputID).keyup(function(event) {
        vueInstance.swineID = '';
        if (vueInstance.srcEarNo != '' && event.keyCode == 13) {
          if (vueInstance.defaultFilter['swineStateList'] != undefined)
            vueInstance.getSwineListBySrcEarNoSwineState(
              swineType,
              vueInstance.defaultFilter['swineStateList'],
              vueInstance.srcEarNo
            );
          else if (vueInstance.defaultFilter['status'] == 0)
            vueInstance.getSwineLikeSrcEarNoInactive(
              swineType,
              vueInstance.srcEarNo
            );
          else if (vueInstance.defaultFilter['status'] == 1)
            vueInstance.getSwineLikeSrcEarNoActive(
              swineType,
              vueInstance.srcEarNo
            );
          else vueInstance.getSwineLikeSrcEarNo(swineType, vueInstance.srcEarNo);
        }
      });
      $('#' + vueInstance.inputID).blur(function() {
        if (vueInstance.srcEarNo != '' && vueInstance.swineID == '') {
          if (vueInstance.defaultFilter['swineStateList'] != undefined)
            vueInstance.getSwineListBySrcEarNoSwineState(
              swineType,
              vueInstance.defaultFilter['swineStateList'],
              vueInstance.srcEarNo
            );
          else if (vueInstance.defaultFilter['status'] == 0)
            vueInstance.getSwineLikeSrcEarNoInactive(
              swineType,
              vueInstance.srcEarNo
            );
          else if (vueInstance.defaultFilter['status'] == 1)
            vueInstance.getSwineLikeSrcEarNoActive(
              swineType,
              vueInstance.srcEarNo
            );
          else vueInstance.getSwineLikeSrcEarNo(swineType, vueInstance.srcEarNo);
        }
      });

      this.swineID = this.defaultCode;
      this.srcEarNo = this.defaultEarNo;
      this.isdisable = this.disable != undefined ? this.disable : false;
      this.defaultFilter = this.filterCondition != undefined ? this.filterCondition : {};
    },
    watch: {
      srcEarNo() {
        if (this.srcEarNo == '') this.returnSwine({});
      },
      dlgQueryS() {
        if (!this.dlgQueryS && this.swineID == '') this.returnSwine({});
      },
      defaultCode() {
        this.swineID = this.defaultCode;
      },
      defaultEarNo() {
        this.srcEarNo = this.defaultEarNo;
      },
      disable() {
        this.isdisable = this.disable;
      },
      filterCondition() {
        this.defaultFilter = this.filterCondition;
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'querySwine': VSwineQ
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
