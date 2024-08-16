<template>
  <div>
    <loadingPage :loadingText="loadingText"></loadingPage>

    <el-input :id="inputID" v-model="empName" class="input-with-select" :disabled="isdisable" clearable>
      <el-button slot="append" icon="el-icon-search" @click="showQueryDialog" :disabled="isdisable"></el-button>
    </el-input>

    <div class="rfidBlock px-1" :title="empNo">編號: {{empNo}}</div>

    <el-dialog :visible.sync="dlgQuery" width="80%" :close-on-click-modal="false" append-to-body>
      <queryEmp :reloading="dlgQuery" :returnType="returnType" v-model="selectedRows" :filterCondition="filterCondition" :defaultList="empList">
        <el-button slot="actionBtn" type="primary" @click="setEmpNo">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryEmp>
    </el-dialog>

  </div>
</template>


<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import EmployeeQ from '@/components/CommonQuery/EmployeeQ';
  import { getEmployeeListByName } from '@/assets/js/iFarmer/manager/OrganizationManager';
  export default {
    /*
      inputID: SwineInput ID 必填
      defaultValue: ParentModel 對應欄位值 必填
      setItem: 回傳的對應欄位名稱 必填
      disable: (true/false)
      filterCondition: 其他過濾條件
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
        dlgQuery: false,
        isdisable: this.disable != undefined ? this.disable : false,
        returnType: 'single',
        empNo: '',
        empName: '',
        empList: [],
        loadingText: null,
        selectedRows: []
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
      getEmp(empName) {
        var vueInstance = this;
        if (
          vueInstance.empName != '' &&
          vueInstance.empName != undefined &&
          vueInstance.empList.length == 0
        ) {
          let filter =
            vueInstance.filterCondition != undefined
              ? vueInstance.filterCondition
              : {};
          vueInstance.loadingText = '資料搜尋中';
          getEmployeeListByName(empName, filter, function(response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應員工編號');
                vueInstance.returnEmp({});
              } else if (response.Data.length == 1)
                vueInstance.returnEmp(response.Data[0]);
              else {
                vueInstance.empList = response.Data;
                vueInstance.dlgQuery = true;
              }
            }
          });
        }
      },
      returnEmp(emp) {
        var vueInstance = this;
        let col = this.colName != undefined ? this.colName : 'ExecEmpNo';
        if (emp.Name != undefined) {
          vueInstance.empName = emp.Name;
          vueInstance.empNo = emp.EmpNo;
          vueInstance.$emit('selectEmp', col, emp);
        } else {
          vueInstance.empList = [];
          vueInstance.empName = '';
          vueInstance.empNo = '';
          vueInstance.$emit('selectEmp', col, emp);
        }
      },
      setEmpNo() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.returnEmp(vueInstance.selectedRows[0]);
          vueInstance.selectedRows = [];
          vueInstance.empList = [];
          vueInstance.dlgQuery = false;
        }
      },
      showQueryDialog() {
        if (!this.isdisable) this.dlgQuery = true;
      }
    },
    mounted: function() {
      var vueInstance = this;
      $('#' + vueInstance.inputID).keyup(function(event) {
        vueInstance.empNo = '';
        if (vueInstance.empName != '' && event.keyCode == 13) {
          vueInstance.getEmp(vueInstance.empName);
        }
      });
      $('#' + vueInstance.inputID).blur(function() {
        if (vueInstance.empName != '' && vueInstance.empNo == '')
          vueInstance.getEmp(vueInstance.empName);
      });
      this.empNo = this.defaultCode;
      this.empName = this.defaultName;
      this.isdisable = this.disable != undefined ? this.disable : false;
    },
    watch: {
      empName() {
        if (this.empName == '') this.returnEmp({});
      },
      defaultCode() {
        this.empNo = this.defaultCode;
      },
      defaultName() {
        this.empName = this.defaultName;
      },
      dlgQuery() {
        if (!this.dlgQuery && this.empNo == '') this.returnEmp({});
      },
      disable() {
        this.isdisable = this.disable;
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'queryEmp': EmployeeQ
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
