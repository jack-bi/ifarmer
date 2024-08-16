<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">倉儲區域查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼" prop="CompCode">
                    <el-input v-model="queryWarehouseZone.CompCode" placeholder="請選擇公司碼" class="input-with-select" clearable readonly :disabled="(filterCondition.CompCode != undefined)">
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryCompany = true" :disabled="(filterCondition.CompCode != undefined)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉儲碼" prop="WarehouseCode">
                    <el-input v-model="queryWarehouseZone.WarehouseCode" placeholder="請輸入倉儲碼" clearable :disabled="(filterCondition.WarehouseCode != undefined)">
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryWarehouse = true" :disabled="(filterCondition.WarehouseCode != undefined)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉儲區域碼">
                    <el-input class="textInput" placeholder="請輸入倉儲區域碼" v-model="queryWarehouseZone.WarehouseZoneCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryWarehouseZone.Status" placeholder="請選擇狀態" clearable>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="warehouseZoneList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">倉儲區域進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼" prop="CompCode">
                    <el-input v-model="queryWarehouseZone.CompCode" placeholder="請選擇公司碼" class="input-with-select" clearable readonly :disabled="(filterCondition.CompCode != undefined)">
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryCompany = true" :disabled="(filterCondition.CompCode != undefined)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉儲碼" prop="WarehouseCode">
                    <el-input v-model="queryWarehouseZone.WarehouseCode" placeholder="請輸入倉儲碼" clearable :disabled="(filterCondition.WarehouseCode != undefined)">
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryWarehouse = true" :disabled="(filterCondition.WarehouseCode != undefined)"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryWarehouseZone.Status" placeholder="請選擇狀態" clearable>
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="倉儲區域碼" prop="WarehouseZoneCode">
                    <el-input v-model="queryWarehouseZone.WarehouseZoneCode" placeholder="請輸入倉儲區域碼" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱" prop="Name">
                    <el-input v-model="queryWarehouseZone.Name" placeholder="請輸入名稱" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簡稱" prop="Abbreviation">
                    <el-input v-model="queryWarehouseZone.Abbreviation" placeholder="請輸入簡稱" clearable></el-input>
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
    <el-dialog :visible.sync="dlgQueryCompany" width="80%" :close-on-click-modal="false">
      <queryCompany :reloading="dlgQueryCompany" :returnType="'Single'" v-model="selectedCompRows">
        <el-button slot="actionBtn" type="primary" @click="setCompany">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryCompany>
    </el-dialog>
    <el-dialog :visible.sync="dlgQueryWarehouse" width="80%" :close-on-click-modal="false">
      <queryWarehouse :reloading="dlgQueryWarehouse" :returnType="'Single'" v-model="selectedCompRows">
        <el-button slot="actionBtn" type="primary" @click="setWarehouse">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryWarehouse>
    </el-dialog>
  </div>
</template>

<script>
  import LoadingPage from "@/components/Control/LoadingPage";
  import datatable from "@/components/Control/DataTable";
  import WarehouseQ from '@/components/MDL07/MA0702/MA070201Q'
  import CompanyQ from '@/components/ADM01/ADM0101/ADM010101Q';
  import {
    warehouseZone
  } from '@/assets/js/iFarmer/model/warehouseZone.js'

  import {
    getWarehouseList,
    getWarehouseZoneList
  } from "@/assets/js/iFarmer/manager/configManager.js";
  import {
    getCompanyList
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
  import {
    getStatus
  } from "@/assets/js/iFarmer/library/optionLib";


  export default {
    model: {
      prop: "selectedItems",
      event: "change"
    },
    props: {
      selectedItems: {
        type: Array,
        default: function() {
          return [];
        }
      },
      reloading: {
        type: Boolean,
        default: function() {
          return false;
        }
      },
      returnType: {
        type: String,
        default: function() {
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
    data: function() {
      return {
        dlgFullfilter: false,
        loadingText: null,
        warehouseList: [],
        warehouseZoneList: [],
        selectedRows: [],
        selectedCompRows: [],
        selectType: (this.returnType == "Single") ? this.returnType : "multiple",
        statusOptions: getStatus(),
        companyOption: [],
        dlgQueryWarehouse: false,
        dlgQueryCompany: false,
        queryWarehouseZone: warehouseZone(),
        table: {
          head: [{
              title: "倉儲區域碼",
              data: "WarehouseZoneCode"
            },
            {
              title: "公司碼",
              data: "CompName"
            },
            {
              title: "倉儲碼",
              data: "WarehouseName"
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
              title: "備註",
              data: "Remark"
            },
            {
              title: "狀態",
              data: "StatusLabel"
            }
          ]
        },
      };
    },
    methods: {
      getWarehouse(filter) {
        var vueInstance = this;
        vueInstance.warehouseList = [];
        getWarehouseList(filter, function(response) {
          if (response.IsSuccess) {
            vueInstance.warehouseList = response.Data;
          }
        });
      },
      getWarehouseZone(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = "資料搜尋中";
        getWarehouseZoneList(filter, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.warehouseZoneList = response.Data;
            vueInstance.setOptionValue(vueInstance.warehouseZoneList);
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
      setCompany() {
        var vueInstance = this;
        if (vueInstance.selectedCompRows.length > 0) {
          vueInstance.queryWarehouseZone.CompCode = vueInstance.selectedCompRows[0].CompCode;
          vueInstance.selectedCompRows = [];
          vueInstance.dlgQueryCompany = false;
        }
      },
      setWarehouse() {
        var vueInstance = this;
        if (vueInstance.selectedCompRows.length > 0) {
          vueInstance.queryWarehouseZone.WarehouseCode = vueInstance.selectedCompRows[0].WarehouseCode;
          vueInstance.selectedCompRows = [];
          vueInstance.dlgQueryWarehouse = false;
        }
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryWarehouseZone.CompCode != "")
          vueInstance.$set(filter, 'CompCode', vueInstance.queryWarehouseZone.CompCode);
        if (vueInstance.queryWarehouseZone.WarehouseCode != "")
          vueInstance.$set(filter, 'WarehouseCode', vueInstance.queryWarehouseZone.WarehouseCode);
        if (vueInstance.queryWarehouseZone.WarehouseZoneCode != "")
          vueInstance.$set(filter, 'WarehouseZoneCode', vueInstance.queryWarehouseZone.WarehouseZoneCode);
        if (vueInstance.queryWarehouseZone.Status !== "")
          vueInstance.$set(filter, 'Status', vueInstance.queryWarehouseZone.Status);

        vueInstance.getWarehouseZone(filter);
      },
      fullFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryWarehouseZone.WarehouseZoneCode != "")
          vueInstance.$set(filter, 'WarehouseZoneCode', vueInstance.queryWarehouseZone.WarehouseZoneCode);
        if (vueInstance.queryWarehouseZone.CompCode != "")
          vueInstance.$set(filter, 'CompCode', vueInstance.queryWarehouseZone.CompCode);
        if (vueInstance.queryWarehouseZone.WarehouseCode != "")
          vueInstance.$set(filter, 'WarehouseCode', vueInstance.queryWarehouseZone.WarehouseCode);
        if (vueInstance.queryWarehouseZone.Name != "")
          vueInstance.$set(filter, 'Name', vueInstance.queryWarehouseZone.Name);
        if (vueInstance.queryWarehouseZone.Abbreviation != "")
          vueInstance.$set(filter, 'Abbreviation', vueInstance.queryWarehouseZone.Abbreviation);
        if (vueInstance.queryWarehouseZone.Status !== "")
          vueInstance.$set(filter, 'Status', vueInstance.queryWarehouseZone.Status);

        vueInstance.getWarehouseZone(filter);
        vueInstance.dlgFullfilter = false;
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          selectList[index]["StatusLabel"] = (selectList[index].Status == 0) ? "停用" : "啓用";

          let comp = $.grep(this.companyOption, function(r) {
            return r.CompCode == selectList[index]["CompCode"];
          });
          if (comp.length > 0) {
            selectList[index]["CompName"] = comp[0].Name;
          } else {
            selectList[index]["CompName"] = '';
          }

          let warehouse = $.grep(this.warehouseList, function(r) {
            return r.CompCode == selectList[index]["CompCode"] && r.WarehouseCode == selectList[index]["WarehouseCode"];
          });
          if (warehouse.length > 0) {
            selectList[index]["WarehouseName"] = warehouse[0].Name;
          } else {
            selectList[index]["WarehouseName"] = '';
          }
        }
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.warehouseZoneList.Status = parseInt(command);
        }
      }
    },
    mounted() {
      this.queryWarehouseZone.CompCode = this.filterCondition['CompCode'];
      this.queryWarehouseZone.WarehouseCode = this.filterCondition['WarehouseCode'];
      this.getCompany();
      this.getWarehouse({});
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.warehouseZoneList = [];
          this.warehouseZone = warehouseZone();
          this.$emit('change', []);
          this.dlgFullfilter = false;
        }
      },
      selectedRows: function() {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          delete tmpObj.StatusLabel;
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      },
      filterCondition() {
        this.queryWarehouseZone.CompCode = this.filterCondition['CompCode'];
        this.queryWarehouseZone.WarehouseCode = this.filterCondition['WarehouseCode'];
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'queryWarehouse': WarehouseQ,
      'queryCompany': CompanyQ,
    }
  };
</script>
