<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">城市資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="城市碼 ">
                    <el-input class="textInput" placeholder="請輸入城市碼 " v-model="queryCity.CityCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱">
                    <el-input class="textInput" placeholder="請輸入名稱" v-model="queryCity.Name" clearable>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="cityList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">城市代碼進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="城市碼 ">
                    <el-input class="textInput" placeholder="請輸入城市碼 " v-model="queryCity.CityCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="國碼">
                    <el-select v-model="queryCity.CountryCode" placeholder="請輸入國碼" clearable>
                      <el-option v-for="item in countryOption" :key="item.CountryCode" :label="item.Name" :value="item.CountryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="名稱">
                    <el-input class="textInput" placeholder="請輸入名稱" v-model="queryCity.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簡短說明">
                    <el-input class="textInput" placeholder="請輸入簡短說明" v-model="queryCity.DisplayText" clearable>
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
  import {
    getCityList,
    getCountryList
  } from '@/assets/js/iFarmer/manager/basicManager';
  import { city } from '@/assets/js/iFarmer/model/city.js';

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
      }
    },
    data: function() {
      return {
        dlgFullfilter: false,
        cityList: [],
        loadingText: null,
        queryCity: city(),
        countryOption: [],
        selectedRows: [],
        selectType: this.returnType == 'Single' ? this.returnType : 'multiple',
        table: {
          head: [
            {
              title: '城市碼 ',
              data: 'CityCode'
            },
            {
              title: '國碼 ',
              data: 'CountryLabel'
            },
            {
              title: '名稱',
              data: 'Name'
            },
            {
              title: '簡短說明',
              data: 'DisplayText'
            },
            {
              title: '狀態',
              data: 'StatusLabel'
            }
          ]
        }
      };
    },
    methods: {
      getCity(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getCityList(filter, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.cityList = response.Data;
            vueInstance.setOptionValue(vueInstance.cityList);
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.queryCity.CityCode != '')
          vueInstance.$set(filter, 'CityCode ', vueInstance.queryCity.CityCode);
        if (vueInstance.queryCity.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.queryCity.Name);

        vueInstance.getCity(filter);
      },
      fullFilter() {
        let filter = {};
        var vueInstance = this;
        if (vueInstance.queryCity.CityCode != '')
          vueInstance.$set(filter, 'CityCode', vueInstance.queryCity.CityCode);
        if (vueInstance.queryCity.CountryCode != '')
          vueInstance.$set(
            filter,
            'CountryCode',
            vueInstance.queryCity.CountryCode
          );
        if (vueInstance.queryCity.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.queryCity.Name);
        if (vueInstance.queryCity.DisplayText != '')
          vueInstance.$set(
            filter,
            'DisplayText',
            vueInstance.queryCity.DisplayText
          );

        vueInstance.getCity(filter);
        vueInstance.dlgFullfilter = false;
      },
      setOptionValue(selectList) {
        var vueInstance = this;
        for (var index = 0; index < selectList.length; index++) {
          selectList[index]['StatusLabel'] =
            selectList[index].Status == 0 ? '停用' : '啓用';
          selectList[index]['CountryLabel'] = '';

          let countryOption = $.grep(vueInstance.countryOption, function(r) {
            return r.CountryCode == selectList[index].CountryCode;
          });
          if (countryOption.length > 0)
            selectList[index]['CountryLabel'] = countryOption[0].Name;
          else selectList[index]['CountryLabel'] = '';
        }
      },
      getCountry() {
        var vueInstance = this;
        getCountryList({}, function(response) {
          if (response.IsSuccess) {
            vueInstance.countryOption = response.Data;
          }
        });
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.queryCity.Status = parseInt(command);
        }
      }
    },

    mounted() {
      this.getCountry();
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.cityList = [];
          this.queryCity = city();
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
          delete tmpObj.CountryLabel;
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
