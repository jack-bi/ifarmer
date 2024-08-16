<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">儲存條件資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="儲存條件碼">
                    <el-input class="textInput" placeholder="請輸入儲存條件碼" v-model="queryItemStorage.StorageCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱">
                    <el-input class="textInput" placeholder="請輸入名稱" v-model="queryItemStorage.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼">
                    <el-select v-model="compCode" placeholder="請選擇公司碼"
                      clearable :disabled="(compCodeFilter.compCode != undefined || compCodeFilter.compCode != null)">
                      <el-option v-for="item in companyOption" :key="item.ID" :label="item.Name" :value="item.CompCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryItemStorage.Status" placeholder="請選擇狀態" clearable>
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="col-md-4" style="text-align: right;">
            <el-button split-button type="primary" @click="simpleFilter()" @command="querySelected">
              <i class="el-icon-search">&nbsp;</i>查詢
            </el-button>
            <slot name="actionBtn"></slot>
          </div>
          <div class="col-md-12  pt-2">
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head"
              :data="itemStorageList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
  import LoadingPage from "@/components/Control/LoadingPage";
  import datatable from "@/components/Control/DataTable";
  import {
    getItemStorageList
  } from "@/assets/js/iFarmer/manager/configManager";
  import {
    getCompanyList,
  } from "@/assets/js/iFarmer/manager/OrganizationManager";
  import {
    itemStorage
  } from '@/assets/js/iFarmer/model/itemStorage.js'
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
      compCodeFilter: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    data: function () {
      return {
        loadingText: null,
        itemStorageList: [],
        queryItemStorage: itemStorage(),
        selectedRows: [],
        companyOption: [],
        statusOptions: getStatus(),
        selectType: (this.returnType == "Single") ? this.returnType : "multiple",
        compCode: (this.compCodeFilter["compCode"] != undefined) ? this.compCodeFilter["compCode"] :null,
        table: {
          head: [{
              title: "儲存條件碼",
              data: "StorageCode"
            },
            {
              title: "公司碼",
              data: "CompCode"
            },
            {
              title: "名稱",
              data: "Name"
            }, {
              title: "狀態",
              data: "StatusLabel"
            }
          ]
        },
      };
    },
    methods: {
      getItemStorage(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = "資料搜尋中";
        getItemStorageList(filter, function (response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.itemStorageList = response.Data;
            vueInstance.setOptionValue(vueInstance.itemStorageList);
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryItemStorage.StorageCode != "")
          vueInstance.$set(filter, 'StorageCode', vueInstance.queryItemStorage.StorageCode);
        if (vueInstance.queryItemStorage.Name != "")
          vueInstance.$set(filter, 'name', vueInstance.queryItemStorage.Name);
        if (vueInstance.queryItemStorage.Status !== "")
          vueInstance.$set(filter, 'status', vueInstance.queryItemStorage.Status);

        vueInstance.getItemStorage(filter);
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {

          selectList[index]["StatusLabel"] = (selectList[index].Status == 0) ? "停用" : "啓用";
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
      querySelected(command) {
        var vueInstance = this;
        if (command != -1) {
          vueInstance.queryItemStorage.Status = parseInt(command);
        }
      }
    },

    mounted() {
      this.getCompany();
    },
    watch: {
      reloading: function () {
        if (this.reloading) {
          this.itemStorageList = [];
          this.queryItemStorage = itemStorage();
          this.$emit('change', []);
        }
      },
      selectedRows: function () {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          delete tmpObj.StatusLabel;
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      },
      compCodeFilter() {
        this.compCode = this.compCodeFilter["compCode"];
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable
    }
  };
</script>
