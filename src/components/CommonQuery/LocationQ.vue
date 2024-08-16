<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">位置查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="位置型態">
                    <el-select size="medium" v-model="queryLocation.LocationLevel" width="200" :disabled="(filterCondition.LocationLevel != undefined)">
                      <el-option v-for="option in locationOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="locationList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">位置進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="位置型態">
                    <el-select size="medium" v-model="queryLocation.LocationLevel" width="200" :disabled="(filterCondition.LocationLevel != undefined)">
                      <el-option v-for="option in locationOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="場別代碼">
                    <el-input class="textInput" placeholder="請輸入場別代碼" v-model="queryLocation.SiteCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="場別名稱">
                    <el-input class="textInput" placeholder="請輸入場別名稱" v-model="queryLocation.SiteName" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="區代碼">
                    <el-input class="textInput" placeholder="請輸入區代碼" v-model="queryLocation.ZoneCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="區名稱">
                    <el-input class="textInput" placeholder="請輸入區名稱" v-model="queryLocation.ZoneName" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="捨代碼">
                    <el-input class="textInput" placeholder="請輸入捨代碼" v-model="queryLocation.HouseCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="捨名稱">
                    <el-input class="textInput" placeholder="請輸入捨名稱" v-model="queryLocation.HouseName" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="欄位代碼">
                    <el-input class="textInput" placeholder="請輸入欄位代碼" v-model="queryLocation.PigstyCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="欄位名稱">
                    <el-input class="textInput" placeholder="請輸入欄位名稱" v-model="queryLocation.PigstyName" clearable>
                    </el-input>
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
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import { location } from '@/assets/js/iFarmer/model/location.js';
  import { getLocationList } from '@/assets/js/iFarmer/manager/locationManager';

  export default {
    model: {
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
        type: Boolean,
        default: function() {
          return false;
        }
      },
      returnType: {
        type: String,
        default: function() {
          return 'multiple';
        }
      },
      defaultList: {
        type: Array,
        default: function() {
          return [];
        }
      },
      filterCondition: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    data: function() {
      return {
        dlgFullfilter: false,
        locationList: [],
        selectedRows: [],
        queryLocation: location(),
        houseLocationID: '',
        locationLevel: null,
        loadingText: null,
        selectType: this.returnType == 'multiple' ? this.returnType : 'single',
        locationOptions: [
          {
            label: '場',
            value: 1
          },
          {
            label: '區',
            value: 2
          },
          {
            label: '棟捨',
            value: 3
          },
          {
            label: '欄位',
            value: 4
          }
        ],
        table: {
          head: [
            {
              title: '棟捨名稱',
              data: 'HouseName'
            },
            {
              title: '棟捨位置碼',
              data: 'HouseLocationCode'
            },
            {
              title: '欄位名稱',
              data: 'PigstyName'
            },
            {
              title: '欄位置碼',
              data: 'PigstyLocationCode'
            },
            {
              title: '區代碼',
              data: 'ZoneCode'
            },
            {
              title: '區名稱',
              data: 'ZoneName'
            },
            {
              title: '區位置碼',
              data: 'ZoneLocationCode'
            },
            {
              title: '場別ID',
              data: 'SiteID'
            },
            {
              title: '場代碼',
              data: 'SiteCode'
            },
            {
              title: '場別名稱',
              data: 'SiteName'
            },
            {
              title: '場位置碼',
              data: 'SiteLocationCode'
            }
          ]
        }
      };
    },
    methods: {
      getLocation(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getLocationList(filter, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.locationList = response.Data;
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryLocation.LocationLevel != '')
          vueInstance.$set(
            filter,
            'locationLevel',
            vueInstance.queryLocation.LocationLevel
          );
        if (vueInstance.houseLocationID != '')
          vueInstance.$set(
            filter,
            'houseLocationID',
            vueInstance.houseLocationID
          );

        if (vueInstance.filterCondition['LocationTypeCode'] != undefined)
          vueInstance.$set(
            filter,
            'locationTypeCode',
            vueInstance.filterCondition['LocationTypeCode']
          );

        vueInstance.getLocation(filter);
      },
      fullFilter() {
        var vueInstance = this;
        let filter = {};

        if (vueInstance.queryLocation.LocationLevel != '')
          vueInstance.$set(
            filter,
            'locationLevel',
            vueInstance.queryLocation.LocationLevel
          );
        if (vueInstance.queryLocation.SiteCode != '')
          vueInstance.$set(
            filter,
            'siteCode',
            vueInstance.queryLocation.SiteCode
          );
        if (vueInstance.queryLocation.SiteName != '')
          vueInstance.$set(
            filter,
            'siteName',
            vueInstance.queryLocation.SiteName
          );
        if (vueInstance.queryLocation.ZoneCode != '')
          vueInstance.$set(
            filter,
            'zoneCode',
            vueInstance.queryLocation.ZoneCode
          );
        if (vueInstance.queryLocation.ZoneName != '')
          vueInstance.$set(
            filter,
            'zoneName',
            vueInstance.queryLocation.ZoneName
          );
        if (vueInstance.queryLocation.HouseCode != '')
          vueInstance.$set(
            filter,
            'houseCode',
            vueInstance.queryLocation.HouseCode
          );
        if (vueInstance.queryLocation.HouseName != '')
          vueInstance.$set(
            filter,
            'houseName',
            vueInstance.queryLocation.HouseName
          );
        if (vueInstance.queryLocation.PigstyCode != '')
          vueInstance.$set(
            filter,
            'pigstyCode',
            vueInstance.queryLocation.PigstyCode
          );
        if (vueInstance.queryLocation.PigstyName != '')
          vueInstance.$set(
            filter,
            'pigstyName',
            vueInstance.queryLocation.PigstyName
          );
        if (vueInstance.houseLocationID != '')
          vueInstance.$set(
            filter,
            'houseLocationID',
            vueInstance.houseLocationID
          );

        if (vueInstance.filterCondition['LocationTypeCode'] != undefined)
          vueInstance.$set(
            filter,
            'locationTypeCode',
            vueInstance.filterCondition['LocationTypeCode']
          );

        vueInstance.getLocation(filter);
        vueInstance.dlgFullfilter = false;
      },
      querySelected(command) {
        this.dlgFullfilter = true;
      },
      returnSelectValue() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.setOptionValue(vueInstance.selectedRows);
          vueInstance.$emit('selectList', vueInstance.selectedRows);
          vueInstance.selectedRows = [];
          vueInstance.locationList = [];
        }
      }
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.locationList = [];
          this.queryLocation = location();
          this.$emit('change', []);
          this.dlgFullfilter = false;
          this.queryLocation.LocationLevel = this.filterCondition[
            'LocationLevel'
          ];
        }
      },
      selectedRows: function() {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      },
      defaultList() {
        this.locationList = this.defaultList;
      },
      filterCondition() {
        this.queryLocation.LocationLevel = this.filterCondition['LocationLevel'];
        this.houseLocationID =
          this.filterCondition['HouseLocationID'] != undefined
            ? this.filterCondition['HouseLocationID']
            : '';
      }
    },
    mounted() {
      this.locationList = this.defaultList != undefined ? this.defaultList : [];
      this.queryLocation.LocationLevel = this.filterCondition['LocationLevel'];
      this.houseLocationID =
        this.filterCondition['HouseLocationID'] != undefined
          ? this.filterCondition['HouseLocationID']
          : '';
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable
    }
  };
</script>
