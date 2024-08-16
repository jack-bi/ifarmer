<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">員工資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="員工編號">
                    <el-input class="textInput" placeholder="請輸入編號" v-model="queryEmployee.EmpNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="員工姓名">
                    <el-input class="textInput" placeholder="請輸入姓名" v-model="queryEmployee.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="col-md-4" style="text-align: right;">
            <el-dropdown split-button type="primary" @click="simpleFilter()" @command="querySelected">
              <i class="el-icon-search">&nbsp;</i>查詢
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command=-1>進階查詢</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <slot name="actionBtn"></slot>
          </div>
          <div class="col-md-12  pt-2">
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head"
              :data="employeeList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">員工資料進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="員工編號">
                    <el-input class="textInput" placeholder="請輸入編號" v-model="queryEmployee.EmpNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="員工姓名">
                    <el-input class="textInput" placeholder="請輸入姓名" v-model="queryEmployee.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="使用者帳號">
                    <el-input placeholder="點選放大鏡選擇帳號" v-model="queryEmployee.AccountNo" class="input-with-select"
                      clearable>
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryU = true"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼">
                    <el-select v-model="queryEmployee.CompCode" placeholder="請選擇公司碼" clearable>
                      <el-option v-for="item in companyOption" :key="item.ID" :label="item.Name" :value="item.CompCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="部門碼">
                    <el-select v-model="queryEmployee.DeptCode" placeholder="請選擇部門碼" clearable>
                      <el-option v-for="item in departOption" :key="item.ID" :label="item.Name" :value="item.DeptCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="預設">
                    <el-select v-model="queryEmployee.IsDefault" placeholder="請選擇是否為預設">
                      <el-option v-for="item in defaultOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="col-md-4" style="text-align: right;">
            <el-button type="primary" @click="fullFilter()"><i class="el-icon-search">&nbsp;</i>查詢</el-button>
          </div>
        </div>
      </el-card>
    </el-dialog>

    <el-dialog :visible.sync="dlgQueryU" width="80%" :close-on-click-modal="false" append-to-body>
      <queryUserAccount :query-type="dlgQueryU" :return-type="'Single'" v-model="accountList">
        <el-button slot="actionBtn" type="primary" @click="setUserAccount">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryUserAccount>
    </el-dialog>

  </div>

</template>

<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import UserAccountQ from '@/components/CommonQuery/UserAccountQ';
  import {
    getEmployeeList,
    getCompanyList,
    getDepartmentList
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
  import {
    employee
  } from '@/assets/js/iFarmer/model/employee.js';
  import {
    getStatus,
    getDefault
  } from '@/assets/js/iFarmer/library/optionLib';

  export default {
    model: {
      prop: 'selectedItems',
      event: 'change'
    },
    props: {
      selectedItems: {
        type: Array,
        default: function () {
          return [];
        }
      },
      reloading: {
        type: Boolean,
        default: function () {
          return false;
        }
      },
      returnType: {
        type: String,
        default: function () {
          return 'multiple';
        }
      },
      defaultList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      filterCondition: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data: function () {
      return {
        dlgFullfilter: false,
        dlgQueryU: false,
        employeeList: [],
        companyOption: [],
        departOption: [],
        selectedRows: [],
        accountList: [],
        loadingText: null,
        selectType: this.returnType == 'multiple' ? this.returnType : 'single',
        queryEmployee: employee(),
        statusOptions: getStatus(),
        defaultOptions: getDefault(),
        table: {
          head: [{
              title: '員工編號',
              data: 'EmpNo'
            },
            {
              title: '員工姓名',
              data: 'Name'
            },
            {
              title: '員工帳號',
              data: 'AccountNo'
            },
            {
              title: '公司代碼',
              data: 'CompCode'
            },
            {
              title: '部門代碼',
              data: 'DeptCode'
            },
            {
              title: '是否預設',
              data: 'DefaultLabel'
            },
            {
              title: '員工狀態',
              data: 'StatusLabel'
            }
          ]
        }
      };
    },
    methods: {
      getEmployee(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getEmployeeList(filter, function (response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.employeeList = response.Data;
            vueInstance.setOptionValue(vueInstance.employeeList);
          }
        });
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          selectList[index]['StatusLabel'] =
            selectList[index].Status == 0 ? '停用' : '啓用';
          selectList[index]['DefaultLabel'] =
            selectList[index].IsDefault == true ? '是' : '否';
        }
      },
      getCompany() {
        var vueInstance = this;
        getCompanyList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.companyOption = response.Data;
          }
        });
      },
      getDepartment() {
        var vueInstance = this;
        getDepartmentList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.departOption = response.Data;
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryEmployee.EmpNo != '')
          vueInstance.$set(filter, 'empNo', vueInstance.queryEmployee.EmpNo);
        if (vueInstance.queryEmployee.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.queryEmployee.Name);
        vueInstance.$set(filter, 'status', vueInstance.queryEmployee.Status);
        vueInstance.getEmployee(filter);
      },
      fullFilter() {
        let filter = {};
        var vueInstance = this;
        if (vueInstance.queryEmployee.EmpNo != '')
          vueInstance.$set(filter, 'empNo', vueInstance.queryEmployee.EmpNo);
        if (vueInstance.queryEmployee.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.queryEmployee.Name);
        if (vueInstance.queryEmployee.CompCode != '')
          vueInstance.$set(
            filter,
            'CompCode',
            vueInstance.queryEmployee.CompCode
          );
        if (vueInstance.queryEmployee.DeptCode != '')
          vueInstance.$set(
            filter,
            'deptCode',
            vueInstance.queryEmployee.DeptCode
          );
        if (vueInstance.queryEmployee.AccountNo != '')
          vueInstance.$set(
            filter,
            'accountNo',
            vueInstance.queryEmployee.AccountNo
          );
        vueInstance.$set(
          filter,
          'isDefault',
          vueInstance.queryEmployee.IsDefault
        );
        vueInstance.$set(filter, 'status', vueInstance.queryEmployee.Status);
        vueInstance.getEmployee(filter);
        vueInstance.dlgFullfilter = false;
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.queryEmployee.Status = parseInt(command);
        }
      },
      setUserAccount(obj) {
        var vueInstance = this;
        if (vueInstance.accountList.length > 0) {
          vueInstance.queryEmployee.AccountNo = vueInstance.accountList[0].AccountNo;
          vueInstance.dlgQueryU = false;
        }
      }
    },
    mounted() {
      this.getCompany();
      this.getDepartment();
      if (this.defaultList != undefined) {
        this.employeeList = this.defaultList;
        this.setOptionValue(this.employeeList);
      } else this.employeeList = [];
    },
    watch: {
      reloading() {
        if (this.reloading) {
          this.employeeList = [];
          this.setOptionValue(this.employeeList);
          this.queryEmployee = employee();
          this.$emit('change', []);
          this.dlgFullfilter = false;
        }
      },
      defaultList() {
        this.employeeList = this.defaultList;
        this.setOptionValue(this.employeeList);
      },
      selectedRows: function () {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          delete tmpObj.StatusLabel;
          delete tmpObj.DefaultLabel;
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'queryUserAccount': UserAccountQ
    }
  };

</script>
