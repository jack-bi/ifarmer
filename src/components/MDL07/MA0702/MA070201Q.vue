<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">倉儲資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司">
                    <el-select v-model="queryWarehouse.CompCode" placeholder="請選擇公司" clearable>
                      <el-option v-for="item in companyOption" :key="item.ID" :label="item.Name" :value="item.CompCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉管主管">
                    <employeeInput :filterCondition="{}" inputID="WarehouseManager" colName="WarehouseManager" :defaultCode="queryWarehouse.WarehouseManager"
                      :defaultName="queryWarehouse.WarehouseOperatorName" @selectEmp="setEmployee">
                    </employeeInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉管人員">
                    <employeeInput :filterCondition="{}" inputID="WarehouseOperator" colName="WarehouseOperator" :defaultCode="queryWarehouse.WarehouseOperator"
                      :defaultName="queryWarehouse.WarehouseOperatorName" @selectEmp="setEmployee1">
                    </employeeInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryWarehouse.Status" placeholder="請選擇狀態" clearable>
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="warehouseList"
              :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">倉儲資料進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
              <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司">
                    <el-select v-model="queryWarehouse.CompCode" placeholder="請選擇公司" clearable>
                      <el-option v-for="item in companyOption" :key="item.ID" :label="item.Name" :value="item.CompCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉管主管">
                    <employeeInput :filterCondition="{}" inputID="WarehouseManager" colName="WarehouseManager" :defaultCode="queryWarehouse.WarehouseManager"
                      :defaultName="queryWarehouse.WarehouseOperatorName" @selectEmp="setEmployee">
                    </employeeInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉管人員">
                    <employeeInput :filterCondition="{}" inputID="WarehouseOperator" colName="WarehouseOperator" :defaultCode="queryWarehouse.WarehouseOperator"
                      :defaultName="queryWarehouse.WarehouseOperatorName" @selectEmp="setEmployee1">
                    </employeeInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryWarehouse.Status" placeholder="請選擇狀態" clearable>
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉儲碼">
                    <el-input v-model="queryWarehouse.WarehouseCode" placeholder="請輸入倉儲碼" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱">
                    <el-input v-model="queryWarehouse.Name" placeholder="請輸入名稱" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簡稱">
                    <el-input v-model="queryWarehouse.Abbreviation" placeholder="請輸入簡稱" clearable></el-input>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <el-form-item label="預設倉儲區">
                    <el-input v-model="queryWarehouse.DefaultZone" placeholder="請輸入預設倉儲區" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="預設倉儲儲位" prop="DefaultBin">
                    <el-input v-model="queryWarehouse.DefaultBin" placeholder="請輸入預設倉儲儲位" clearable></el-input>
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

  </div>
</template>

<script>
import LoadingPage from "@/components/Control/LoadingPage";
import datatable from "@/components/Control/DataTable";
import EmployeeInput from '@/components/Control/EmployeeInput';
import {
  getEmployeeList,
  getCompanyList
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
import {
  getWarehouseList
} from "@/assets/js/iFarmer/manager/configManager";
import {
  warehouse
} from '@/assets/js/iFarmer/model/warehouse.js'
import {
  getStatus
} from '@/assets/js/iFarmer/library/optionLib.js'

  export default {
    model: {
      prop: "selectedItems",
      event: "change"
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
          return "multiple";
        }
      },
      filterCondition: {
        type: Object,
        default: function() {
          return {};
        }
      },
    },
    data: function () {
      return {
        statusOptions: getStatus(),
        queryWarehouse: warehouse(),

        dlgFullfilter: false,
        loadingText : null,
        warehouseList: [],
        selectedRows: [],
        selectedCompRows: [],
        employeeOption: [],
        companyOption: [],

        selectType: (this.returnType == "Single") ? this.returnType : "multiple",
        table: {
          head: [{
          title: "倉儲碼",
          data: "WarehouseCode"
        },
        {
          title: "公司",
          data: "CompName"
        },
        {
          title: "名稱",
          data: "Name"
        },
        {
          title: "簡稱",
          data: "Abbreviation"
        },
        {
          title: "倉管主管",
          data: "WarehouseManagerName"
        },
        {
          title: "倉管人員",
          data: "WarehouseOperatorName"
        },
        {
          title: "預設倉儲區",
          data: "DefaultZone"
        },
        {
          title: "預設倉儲儲位",
          data: "DefaultBin"
        },
        {
          title: "狀態",
          data: "StatusLabel"
        }]
        },
      };
    },
    methods: {
      setEmployee(item, obj) {
        this.$set(this.queryWarehouse, 'WarehouseManager', obj.EmpNo);
        this.$set(this.queryWarehouse, 'WarehouseManagerName', obj.Name);
      },
      setEmployee1(item, obj) {
        this.$set(this.queryWarehouse, 'WarehouseOperator', obj.EmpNo);
        this.$set(this.queryWarehouse, 'WarehouseOperatorName', obj.Name);
      },
      getWarehouse(filter) {
        var vi = this;
        vi.selectedRows = [];
        vi.loadingText = "資料搜尋中";
        getWarehouseList(filter, function (response) {
          vi.loadingText = null;
        if (response.IsSuccess) {
            vi.warehouseList = response.Data;
            vi.setOptionValue(vi.warehouseList);
          }
        });
      },
      getCompany() {
        var vi = this;
        getCompanyList({}, function(response) {
          if (response.IsSuccess) {
            vi.companyOption = response.Data;
          }
        });
      },
      getEmployee() {
        var vi = this;
        getEmployeeList({}, function(response) {
          if (response.IsSuccess) {
            vi.employeeOption = response.Data;
          }
        });
      },
      simpleFilter() {
        var vi = this;
        let filter = {};
        if (vi.queryWarehouse.CompCode != "")
          vi.$set(filter, 'CompCode', vi.queryWarehouse.CompCode);

        if (vi.queryWarehouse.WarehouseManager != "")
          vi.$set(filter, 'WarehouseManager', vi.queryWarehouse.WarehouseManager);

        if (vi.queryWarehouse.WarehouseOperator != "")
          vi.$set(filter, 'WarehouseOperator', vi.queryWarehouse.WarehouseOperator);

        if (vi.queryWarehouse.Status !== "")
          vi.$set(filter, 'Status', vi.queryWarehouse.Status);

        vi.getWarehouse(filter);
      },
      fullFilter() {
        let filter = {}
        var vi = this;

        if (vi.queryWarehouse.CompCode != "")
          vi.$set(filter, 'CompCode', vi.queryWarehouse.CompCode);
        if (vi.queryWarehouse.WareHouseCode != "")
          vi.$set(filter, 'WareHouseCode', vi.queryWarehouse.WareHouseCode);
        if (vi.queryWarehouse.Name != "")
          vi.$set(filter, 'Name', vi.queryWarehouse.Name);
        if (vi.queryWarehouse.Abbreviation != "")
          vi.$set(filter, 'Abbreviation', vi.queryWarehouse.Abbreviation);
        if (vi.queryWarehouse.WarehouseManager != "")
          vi.$set(filter, 'WarehouseManager', vi.queryWarehouse.WarehouseManager);
        if (vi.queryWarehouse.WarehouseOperator != "")
          vi.$set(filter, 'WarehouseOperator', vi.queryWarehouse.WarehouseOperator);
        if (vi.queryWarehouse.DefaultZone != "")
          vi.$set(filter, 'DefaultZone', vi.queryWarehouse.DefaultZone);
        if (vi.queryWarehouse.DefaultBin != "")
          vi.$set(filter, 'DefaultBin', vi.queryWarehouse.DefaultBin);
        if (vi.queryWarehouse.Status !== "")
          vi.$set(filter, 'Status', vi.queryWarehouse.Status);

        vi.getWarehouse(filter);
        vi.dlgFullfilter = false;
      },
      setOptionValue(selectList) {
        var vi = this;
        for (var index = 0; index < selectList.length; index++) {

          selectList[index]['StatusLabel'] =
            selectList[index].Status == 0 ? '停用' : '啓用';

          let company = $.grep(vi.companyOption, function(r) {
            return r.CompCode == selectList[index].CompCode;
          });
          if (company.length > 0) selectList[index]['CompName'] = company[0].Name;
          else selectList[index]['CompName'] = '';

          let employee = $.grep(vi.employeeOption, function(r) {
            return r.EmpNo == selectList[index].WarehouseManager;
          });
          if (employee.length > 0)
            selectList[index]['WarehouseManagerName'] = employee[0].Name;
          else selectList[index]['WarehouseManagerName'] = '';

          let employee2 = $.grep(vi.employeeOption, function(r) {
            return r.EmpNo == selectList[index].WarehouseOperator;
          });
          if (employee2.length > 0)
            selectList[index]['WarehouseOperatorName'] = employee2[0].Name;
          else selectList[index]['WarehouseOperatorName'] = '';

        }
      },
      querySelected(command) {
        var vi = this;
        if (command == -1) {
          vi.dlgFullfilter = true;
        } else {
          vi.warehouseList.Status = parseInt(command);
        }
      }
    },
    mounted() {
      if (this.filterCondition['CompCode']) {
        this.queryWarehouse.CompCode = this.filterCondition['CompCode'];
      } else {
        this.queryWarehouse.CompCode = undefined;
      }
      this.getCompany();
      this.getEmployee();
    },
    watch: {
      reloading: function () {
        if (this.reloading) {
          this.warehouseList = [];
          this.warehouse = warehouse();
          this.$emit('change', []);
          this.dlgFullfilter = false;
        }
      },
      selectedRows: function () {
        var vi = this;
        let returnList=[];
        vi.selectedRows.forEach(element => {
          let tmpObj=jQuery.extend(true, {}, element);
          delete tmpObj.StatusLabel;
          delete tmpObj.CompName;
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'employeeInput': EmployeeInput,
    }
  };

</script>
