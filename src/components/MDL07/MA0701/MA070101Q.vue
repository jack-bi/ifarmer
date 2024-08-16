<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">料件資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件編號">
                    <el-input class="textInput" placeholder="請輸入料件編號" v-model="queryItem.ItemNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件型態">
                    <el-select v-model="queryItem.ItemTypeCode" placeholder="請選擇料件型態" clearable
                      :disabled="(filterCondition.ItemTypeCode != undefined)">
                      <el-option v-for="item in itemTypeOptions" :key="item.ItemTypeCode" :label="item.Name"
                        :value="item.ItemTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryItem.Status" placeholder="請選擇狀態" clearable :disabled="IsStatusOn">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                        :value="item.value">
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head"
              :data="itemList" :orderIndex=1 :orderBy="'desc'" :reSetting="itemList.length>0"></data-table>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">料件資料進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼">
                    <el-input v-model="queryItem.CompCode" placeholder="請輸入公司碼" class="input-with-select" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryCompany = true"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="儲存條件">
                    <el-input v-model="queryItem.StorageCode" placeholder="請輸入儲存條件" class="input-with-select" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryStorage = true"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件型態">
                    <el-select v-model="queryItem.ItemTypeCode" clearable placeholder="請選擇料件型態"
                      :disabled="filterCondition.ItemTypeCode != undefined">
                      <el-option v-for="item in itemTypeOptions" :key="item.ItemTypeCode" :label="item.Name"
                        :value="item.ItemTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="豬隻狀態" prop="SwineStateID">
                    <el-select v-model="queryItem.SwineStateID" placeholder="請選擇豬隻狀態"
                      :disabled="filterCondition.SwineStateID != undefined" clearable>
                      <el-option v-for="item in swineStateOptions" :key="item.SwineStateID" :label="item.CName"
                        :value="item.SwineStateID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="物態">
                    <el-select v-model="queryItem.State" placeholder="請選擇物態" clearable>
                      <el-option v-for="option in stateList" :key="option.State" :label="option.label"
                        :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="大分類碼">
                    <el-select v-model="queryItem.TopCategoryCode" placeholder="請選擇大分類碼" clearable
                      :disabled="filterCondition.TopCategoryCode != undefined">
                      <el-option v-for="category in itemTopCategoryOptions" :key="category.ID" :label="category.Name"
                        :value="category.TopCategoryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="中分類碼">
                    <el-select v-model="queryItem.MiddleCategoryCode" placeholder="請選擇中分類碼" clearable
                      :disabled="filterCondition.MiddleCategoryCode != undefined">
                      <el-option v-for="category in itemMiddleCategoryOptions" :key="category.ID" :label="category.Name"
                        :value="category.MiddleCategoryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="小分類碼">
                    <el-select v-model="queryItem.BottomCategoryCode" placeholder="請選擇小分類碼" clearable
                      :disabled="filterCondition.BottomCategoryCode != undefined">
                      <el-option v-for="category in itemBottomCategoryOptions" :key="category.ID" :label="category.Name"
                        :value="category.BottomCategoryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件編號">
                    <el-input v-model="queryItem.ItemNo" placeholder="請輸入料件編號" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件名稱">
                    <el-input v-model="queryItem.Name" placeholder="請輸入料件名稱" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="料件規格">
                    <el-input v-model="queryItem.ItemSpecification" autosize placeholder="請輸入料件規格"></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="狀態">
                    <el-select v-model="queryItem.Status" placeholder="請選擇狀態" clearable :disabled="IsStatusOn">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                        :value="item.value">
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

    <el-dialog :visible.sync="dlgQueryStorage" width="80%" :close-on-click-modal="false">
      <queryStorage :reloading="dlgQueryStorage" :returnType="'Single'" v-model="selectedStorageRows">
        <el-button slot="actionBtn" type="primary" @click="setStorage">
          <i class="el-icon-back">&nbsp;</i>確認
        </el-button>
      </queryStorage>
    </el-dialog>

    <el-dialog :visible.sync="dlgQueryCompany" width="80%" :close-on-click-modal="false">
      <queryCompany :reloading="dlgQueryCompany" :returnType="'Single'" v-model="selectedCompRows">
        <el-button slot="actionBtn" type="primary" @click="setCompany">
          <i class="el-icon-back">&nbsp;</i>確認
        </el-button>
      </queryCompany>
    </el-dialog>
  </div>
</template>

<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import ItemStorageQ from '@/components/MDL07/MA0701/MA070102Q';
  import CompanyQ from '@/components/ADM01/ADM0101/ADM010101Q';

  import {
    getItemCategoryList,
    getItemList,
    getItemTypeList,
    getSwineStateList
  } from '@/assets/js/iFarmer/manager/configManager';
  import {
    getStatus
  } from '@/assets/js/iFarmer/library/optionLib.js'

  import {
    item
  } from '@/assets/js/iFarmer/model/item.js'
  import {
    getData
  } from '@/assets/js/iFarmer.v2/manager/genericManager';
  import {
    activateStatus
  } from '@/assets/js/iFarmer.v2/enum/activateStatus.js';

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
      filterCondition: {
        type: Object,
        default: function () {
          return {};
        }
      },
      defaultItemType: {
        type: String,
        default: '-1'
      },
      defaultList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      IsStatusOn: {
        type: Boolean,
        default: function () {
          return false;
        }
      }
    },
    data: function () {
      return {
        statusCode: activateStatus,
        statusOptions: getStatus(),
        dlgFullfilter: false,
        loadingText: null,
        dlgQueryStorage: false,
        dlgQueryCompany: false,
        itemList: [],
        selectedRows: [],
        selectedCompRows: [],
        selectedStorageRows: [],

        itemTypeOptions: [],
        swineStateOptions: [],
        itemTopCategoryOptions: [],
        itemMiddleCategoryOptions: [],
        itemBottomCategoryOptions: [],

        selectType: (this.returnType == 'multiple') ? this.returnType : 'single',
        queryItem: item(),
        stateList: [{
            label: '固態',
            value: 1
          },
          {
            label: '液態',
            value: 2
          },
          {
            label: '氣態',
            value: 3
          }
        ],
        table: {
          head: [{
              title: '料件編號',
              data: 'ItemNo'
            },
            {
              title: '料件名稱',
              data: 'Name'
            },
            {
              title: '料件型態',
              data: 'ItemTypeName'
            },
            {
              title: '豬隻狀態',
              data: 'SwineStateName'
            },
            {
              title: '計量單位',
              data: 'UOMName'
            },
            {
              title: '料件規格',
              data: 'ItemSpecification'
            },
            {
              title: '物態',
              data: 'StateName'
            },
            {
              title: '儲存條件',
              data: 'StorageName'
            },
            {
              title: '精液容量',
              data: 'PackVolume'
            },
            {
              title: '精液濃度',
              data: 'Concentration'
            },
            {
              title: '精液精子數量',
              data: 'Concentration'
            },
            {
              title: '大分類名稱',
              data: 'TopCategoryName'
            },
            {
              title: '中分類名稱',
              data: 'MiddleCategoryName'
            },
            {
              title: '小分類名稱',
              data: 'BottomCategoryName'
            },
            {
              title: '公司名稱',
              data: 'CompanyName'
            }
          ]
        },
      };
    },
    methods: {
      getItem(filter) {
        var vi = this;
        vi.selectedRows = [];
        vi.loadingText = '資料搜尋中';
        getData('VItem', filter, function (response) {
          vi.loadingText = null;
          if (response) {
            vi.itemList = vi.getUnique(response, 'ID');
            vi.setOptionValue(vi.itemList);
          }
        });
      },

      getItemType() {
        var vi = this;
        getItemTypeList({}, function (response) {
          if (response.IsSuccess) {
            vi.itemTypeOptions = response.Data;
          }
        });
      },
      setOptionValue(selectList) {
        var vi = this;
        for (var index = 0; index < selectList.length; index++) {
          let state = $.grep(vi.stateList, function (r) {
            return r.value == selectList[index].State;
          });
          if (state.length > 0)
            selectList[index]['StateName'] = state[0].label;
          else
            selectList[index]['StateName'] = '';
        }
      },
      setCompany() {
        var vi = this;
        if (vi.selectedCompRows.length > 0) {
          vi.queryItem.CompCode = vi.selectedCompRows[0].CompCode;
          vi.selectedCompRows = [];

          vi.dlgQueryCompany = false;
        }
      },

      setStorage() {
        var vi = this;
        if (vi.selectedStorageRows.length > 0) {
          vi.queryItem.StorageCode = vi.selectedStorageRows[0].StorageCode;
          vi.selectedStorageRows = [];
          vi.dlgQueryStorage = false;
        }
      },
      simpleFilter() {
        var vi = this;
        let filter = {};
        if (vi.queryItem.ItemNo != '')
          vi.$set(filter, 'itemNo', vi.queryItem.ItemNo);
        if (vi.queryItem.ItemTypeCode != '')
          vi.$set(filter, 'itemTypeCode', vi.queryItem.ItemTypeCode);
        if (vi.queryItem.Status !== '')
          vi.$set(filter, 'status', vi.queryItem.Status);

        if (vi.filterCondition['TopCategoryCode'] != undefined)
          vi.$set(filter, 'TopCategoryCode', vi.filterCondition['TopCategoryCode']);

        if (vi.filterCondition['MiddleCategoryCode'] != undefined)
          vi.$set(filter, 'MiddleCategoryCode', vi.filterCondition['MiddleCategoryCode']);

        if (vi.filterCondition['BottomCategoryCode'] != undefined)
          vi.$set(filter, 'BottomCategoryCode', vi.filterCondition['BottomCategoryCode']);

        if (vi.filterCondition['SwineStateID'] != undefined)
          vi.$set(filter, 'SwineStateID', vi.filterCondition['SwineStateID']);

        if (vi.filterCondition['SwineTypeID'] != undefined)
          vi.$set(filter, 'SwineTypeID', vi.filterCondition['SwineTypeID']);

        vi.getItem(filter);
      },

      fullFilter() {
        var vi = this;
        let filter = {};
        if (vi.queryItem.ItemNo != '')
          vi.$set(filter, 'itemNo', vi.queryItem.ItemNo);
        if (vi.queryItem.ItemTypeCode != '')
          vi.$set(filter, 'itemTypeCode', vi.queryItem.ItemTypeCode);
        if (vi.queryItem.Name != '')
          vi.$set(filter, 'Name', vi.queryItem.Name);
        if (vi.queryItem.StorageCode != '')
          vi.$set(filter, 'StorageCode', vi.queryItem.StorageCode);

        if (vi.queryItem.TopCategoryCode !== '')
          vi.$set(filter, 'TopCategoryCode', vi.queryItem.TopCategoryCode);

        if (vi.queryItem.MiddleCategoryCode !== '')
          vi.$set(filter, 'MiddleCategoryCode', vi.queryItem.MiddleCategoryCode);

        if (vi.queryItem.BottomCategoryCode !== '')
          vi.$set(filter, 'BottomCategoryCode', vi.queryItem.BottomCategoryCode);

        if (vi.queryItem.State !== '')
          vi.$set(filter, 'State', vi.queryItem.State);

        if (vi.queryItem.Status !== '')
          vi.$set(filter, 'status', vi.queryItem.Status);

        if (vi.queryItem.SwineStateID !== '')
          vi.$set(filter, 'SwineStateID', vi.queryItem.SwineStateID);

        if (vi.filterCondition['SwineTypeID'] != undefined)
          vi.$set(filter, 'SwineTypeID', vi.filterCondition['SwineTypeID']);

        vi.getItem(filter);
        vi.dlgFullfilter = false;
      },
      querySelected(command) {
        var vi = this;
        if (command == -1) {
          vi.dlgFullfilter = true;
        } else {
          vi.queryItem.Status = parseInt(command);
        }
      },
      getItemTopCategory() {
        var vi = this;
        let filter = {};
        getData('ItemTopCategory', filter, function (response) {
          if (response) {
            vi.itemTopCategoryOptions = response;
          }
        });
      },
      getItemMiddleCategory() {
        var vi = this;
        let filter = {};
        getData('ItemMiddleCategory', filter, function (response) {
          if (response) {
            vi.itemMiddleCategoryOptions = response;
          }
        });
      },
      getItemBottomCategory() {
        var vi = this;
        let filter = {};
        getData('ItemBottomCategory', filter, function (response) {
          if (response) {
            vi.itemBottomCategoryOptions = response;
          }
        });
      },
      getSwineState() {
        var vi = this;
        getSwineStateList({}, function (response) {
          if (response.IsSuccess) {
            vi.swineStateOptions = response.Data;
          }
        });
      },
      getFilter() {
        this.queryItem.ItemTypeCode = (this.filterCondition['ItemTypeCode']!=null)?this.filterCondition['ItemTypeCode']:'';
        this.queryItem.SwineTypeID = (this.filterCondition['SwineTypeID']!=null)?this.filterCondition['SwineTypeID']:'';
        this.queryItem.SwineStateID = (this.filterCondition['SwineStateID']!=null)?this.filterCondition['SwineStateID']:'';
        this.queryItem.TopCategoryCode = (this.filterCondition['TopCategoryCode']!=null)?this.filterCondition['TopCategoryCode']:'';
        this.queryItem.MiddleCategoryCode = (this.filterCondition['MiddleCategoryCode']!=null)?this.filterCondition['MiddleCategoryCode']:'';
        this.queryItem.BottomCategoryCode =(this.filterCondition['BottomCategoryCode']!=null)?this.filterCondition['BottomCategoryCode']:'';
        this.queryItem.Status = this.statusCode.Active;
      },
    },
    watch: {
      reloading: function () {
        if (this.reloading) {
          this.itemList = [];
          this.queryItem = item();
          this.$emit('change', []);
          this.dlgFullfilter = false;
          this.getFilter();
        }
      },
      selectedRows: function () {
        var vi = this;
        let returnList = [];
        vi.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      },
      defaultList() {
        this.itemList = this.defaultList;
        this.setOptionValue(this.itemList);
      },
      filterCondition() {
        this.getFilter();
      }
    },
    computed: {},
    mounted() {
      this.getItemTopCategory();
      this.getItemMiddleCategory();
      this.getItemBottomCategory();
      this.getItemType();
      this.getSwineState();
      this.getFilter();
      if (this.defaultList != undefined) {
        this.itemList = this.defaultList;
        this.setOptionValue(this.itemList);
      } else
        this.itemList = [];
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'queryStorage': ItemStorageQ,
      'queryCompany': CompanyQ,
    }
  };

</script>
