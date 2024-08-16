<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">資料查詢 Block</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <!--簡易查詢Block -->

                <!-- <div class="col-md-6 queryBlock">
                  <el-form-item label="文字輸入框">
                    <el-input class="textInput" placeholder="請輸入" v-model="" clearable>
                    </el-input>
                  </el-form-item>
                </div> -->

                <!-- <div class="col-md-6 queryBlock">
                  <el-form-item label="附按鈕輸入框">
                    <el-input v-model="" class="input-with-select" clearable>
                      <el-button slot="append" icon="el-icon-search" @click=""></el-button>
                    </el-input>
                  </el-form-item>
                </div> -->

                <!-- <div class="col-md-6 queryBlock">
                  <el-form-item label="日期選擇">
                    <el-date-picker placeholder="請選擇日期" v-model="" value-format="yyyy-MM-dd" clearable>
                    </el-date-picker>
                  </el-form-item>
                </div> -->

                <!--<div class="col-md-6 queryBlock">
                  <el-form-item label="下拉選單">
                    <el-select v-model="" placeholder="請選擇">
                      <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div> -->

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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="queryModel" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">進階查詢 Block</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <!--進階查詢Block-->
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
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  /* import {
      作業Model
    } from '@/assets/js/iFarmer/model/作業Model.js'
    import {
      Get Api
    } from "@/assets/js/iFarmer/manager/對應Manager";*/

  export default {
    model: {
      //外層Component傳入對應修改的array
      prop: 'selectedItems',
      event: 'change'
    },
    props: {
      selectedItems: {
        type: Array,
        default: function() {
          return [];
        }
      },
      reloading: {
        //判斷DataTable何時該執行刷新動作
        type: Boolean,
        default: function() {
          return false;
        }
      },
      returnType: {
        //判斷作業回傳資料為單筆或多筆
        type: String,
        default: function() {
          return 'multiple';
        }
      }
    },
    data: function() {
      return {
        loadingText: null,
        dlgFullfilter: false, //進階查詢顯示
        queryModel: [], //作業Model
        selectedRows: [], //取得DataTable勾選資料列
        selectType: this.returnType == 'Single' ? this.returnType : 'multiple', //控製DataTable單選或多選
        table: {
          //DataTable各Column對應欄位及標題
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
      getModelList(filter) {
        //Call api取得過濾後的資料
      },
      simpleFilter() {
        //簡易條件篩選
        vueInstance.getModelList(filter);
      },
      fullFilter() {
        //多條件篩選
        vueInstance.getModelList(filter);
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          /*將datatable上的選項欄位，轉換成對應文字
            selectList[index]["StatusLabel"] = (selectList[index].Status == 0) ? "停用" : "啓用";*/
        }
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.queryModel.Status = parseInt(command);
        }
      }
    },
    mounted() {},
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.swineChangeList = [];
          this.queryModel = getModel();
          this.$emit('change', []);
          this.dlgFullfilter = false;
        }
      },
      selectedRows: function() {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          delete tmpObj.StatusLabel; //刪除SetOption中多餘欄位
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
