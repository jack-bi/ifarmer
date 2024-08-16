<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">料件單位資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="單位別">
                    <el-input class="textInput" placeholder="請輸入單位別" v-model="queryItemUnit.UnitCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱">
                    <el-input class="textInput" placeholder="請輸入名稱" v-model="queryItemUnit.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryItemUnit.Status" placeholder="請選擇狀態" clearable>
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="col-md-4" style="text-align: right;">
            <el-button type="primary" @click="simpleFilter()">
              <i class="el-icon-search">&nbsp;</i>查詢
            </el-button>
            <slot name="actionBtn"></slot>
          </div>
          <div class="col-md-12  pt-2">
            <data-table v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="itemUnitList"
              :orderIndex=1 :orderBy="'desc'"></data-table>
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
    getItemUnitList
  } from "@/assets/js/iFarmer/manager/configManager";
  import {
    itemUnit
  } from '@/assets/js/iFarmer/model/itemUnit.js'
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
    },
    data: function () {
      return {
        loadingText: null,
        itemUnitList: [],
        queryItemUnit: itemUnit(),
        selectedRows: [],
        companyOption: [],
        statusOptions: getStatus(),
        selectType: (this.returnType == "Single") ? this.returnType : "multiple",
        table: {
          head: [{
              title: "單位別",
              data: "UnitCode"
            },
            {
              title: "公司碼",
              data: "CompCode"
            },
            {
              title: "名稱",
              data: "Name"
            },
            {
              title: "狀態",
              data: "StatusLabel"
            },
            {
              title: "備註",
              data: "Remark"
            }
          ]
        },
      };
    },
    methods: {
      getItemUnit(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = "資料搜尋中";
        getItemUnitList(filter, function (response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.itemUnitList = response.Data;
            vueInstance.setOptionValue(vueInstance.itemUnitList);
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryItemUnit.UnitCode != "")
          vueInstance.$set(filter, 'UnitCode', vueInstance.queryItemUnit.UnitCode);
        if (vueInstance.queryItemUnit.Name != "")
          vueInstance.$set(filter, 'name', vueInstance.queryItemUnit.Name);
        if (vueInstance.queryItemUnit.Status !== "")
          vueInstance.$set(filter, 'status', vueInstance.queryItemUnit.Status);

        vueInstance.getItemUnit(filter);
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          selectList[index]["StatusLabel"] = (selectList[index].Status == 0) ? "停用" : "啓用";
        }
      },
      querySelected(command) {
        var vueInstance = this;
        if (command != -1) {
          vueInstance.queryItemUnit.Status = parseInt(command);
        }
      }
    },

    mounted() {
    },
    watch: {
      reloading: function () {
        if (this.reloading) {
          this.itemUnitList = [];
          this.queryItemUnit = itemUnit();
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
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable
    }
  };

</script>
