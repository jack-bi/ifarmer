<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">豬隻查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="耳號">
                    <el-input class="textInput" placeholder="請輸入耳號" v-model="querySwine.SrcEarNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻類別">
                    <el-select v-model="swineTypeID" placeholder="請選擇豬隻類別" clearable :disabled="(defaultFilter.swineType != undefined)">
                      <el-option v-for="item in swinwTypeList" :key="item.SwineTypeID" :label="item.CName" :value="item.SwineTypeID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="棟捨">
                    <locationInput :filterCondition="{LocationLevel:3}" inputID="S_HouseLocationID" colName="HouseLocationID"
                      :defaultCode="HouseLocationID" :defaultName="HouseName" @selectLocation="setLocation" :disable="(defaultFilter.HouseName != undefined)">
                    </locationInput>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="欄位">
                    <locationInput :filterCondition="{LocationLevel:4}" inputID="S_LocationID" colName="LocationID"
                      :defaultCode="LocationID" :defaultName="LocationName" @selectLocation="setLocation" :disable="(defaultFilter.LocationName != undefined)">
                    </locationInput>
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
              :data="swineList" :orderIndex=3 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">豬隻進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6  queryBlock">
                  <el-form-item label="棟捨">
                    <locationInput :filterCondition="{LocationLevel:3}" inputID="F_HouseLocationID" colName="HouseLocationID"
                      :defaultCode="HouseLocationID" :defaultName="HouseName" @selectLocation="setLocation" :disable="(defaultFilter.HouseName != undefined)">
                    </locationInput>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="欄位">
                    <locationInput :filterCondition="{LocationLevel:4}" inputID="F_LocationID" colName="LocationID"
                      :defaultCode="LocationID" :defaultName="LocationName" @selectLocation="setLocation" :disable="(defaultFilter.LocationName != undefined)">
                    </locationInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="耳號">
                    <el-input class="textInput" placeholder="請輸入耳號" v-model="querySwine.SrcEarNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻類別">
                    <el-select v-model="swineTypeID" placeholder="請選擇豬隻類別" clearable :disabled="(defaultFilter.swineType != undefined)">
                      <el-option v-for="item in swinwTypeList" :key="item.SwineTypeID" :label="item.CName" :value="item.SwineTypeID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="RFID">
                    <el-input class="textInput" placeholder="請輸入RFID" v-model="querySwine.SwineID" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="批號">
                    <el-input class="textInput" placeholder="請輸入批號" v-model="batchNo" :disabled="(defaultFilter.batchNo != undefined)"
                      clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <!-- <div class="col-md-6 queryBlock">
                  <el-form-item label="批號">
                    <el-input class="textInput" placeholder="請輸入批號" v-model="querySwine.BatchNo" clearable>
                    </el-input>
                  </el-form-item>
                </div> -->
                <div class="col-md-6 queryBlock">
                  <el-form-item label="耳標號">
                    <el-input class="textInput" t placeholder="請輸入耳標號" v-model="querySwine.SrcEarTagID" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="生日">
                    <el-date-picker placeholder="請輸入生日" v-model="querySwine.BirthDate" value-format="yyyy-MM-dd"
                      clearable>
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="初始重量">
                    <el-input class="textInput" v-model="querySwine.InitWeight" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="乳頭數">
                    <el-input class="textInput" v-model="querySwine.TeatNo" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="父畜">
                    <el-input class="textInput" placeholder="請輸入父畜" v-model="querySwine.Father" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="母畜">
                    <el-input class="textInput" placeholder="請輸入欄母畜" v-model="querySwine.Mother" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="情期">
                    <el-input class="textInput" v-model="querySwine.Estrus" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="胎次">
                    <el-input class="textInput" v-model="querySwine.Parity" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻品種">
                    <el-select v-model="querySwine.SwineVarietyID" placeholder="請選擇豬隻品種" clearable>
                      <el-option v-for="item in swineVarietyList" :key="item.SwineVarietyID" :label="item.CName" :value="item.SwineVarietyID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻係別">
                    <el-select v-model="querySwine.SwineSeriesID" placeholder="請選擇豬隻係別" clearable>
                      <el-option v-for="item in swineSeriesList" :key="item.SwineSeriesID" :label="item.CName" :value="item.SwineSeriesID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻育種位階">
                    <el-select v-model="querySwine.SwineGenerationID" placeholder="請選擇豬隻育種位階" clearable>
                      <el-option v-for="item in swineGenerationList" :key="item.SwineGenerationID" :label="item.CName"
                        :value="item.SwineGenerationID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻階段">
                    <el-select v-model="swineStateID" placeholder="請選擇豬隻階段" :disabled="(defaultFilter.swineStateID != undefined)"
                      clearable>
                      <el-option v-for="item in swineStateList" :key="item.SwineStateID" :label="item.CName" :value="item.SwineStateID">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="殘次豬">
                    <el-select v-model="isDefective" placeholder="請選擇豬隻狀態" clearable :disabled="(defaultFilter.isDefective != undefined)">
                      <el-option v-for="item in defaultOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6  queryBlock">
                  <el-form-item label="豬隻狀態">
                    <el-select v-model="status" placeholder="請選擇豬隻狀態" clearable :disabled="(defaultFilter.status != undefined)">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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

  </div>

</template>

<script>
  import moment from 'moment';
  import LocationInput from '@/components/Control/LocationInput';
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import {
    swine
  } from '@/assets/js/iFarmer/model/vSwine.js';
  import {
    getSwineStatus,
    getDefault
  } from '@/assets/js/iFarmer/library/optionLib';

  import {
    getSwineList,
    getSwineListBySwineState
  } from '@/assets/js/iFarmer/manager/swineManager';
  import {
    getSwineTypeList,
    getSwineVarietyList,
    getSwineStateList,
    getSwineSeriesList,
    getSwineGenerationList
  } from '@/assets/js/iFarmer/manager/configManager';

  /*
       return-type: 還傳資料筆數(Single/Multiple
       filterCondition: 豬隻篩選條件(swineType、swineStateList、status)
       default-list: 預設顯示資料
      */
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
      defaultList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data: function () {
      return {
        dlgFullfilter: false,
        swineList: [],
        selectedRows: [],
        swineGenerationList: [],
        loadingText: null,
        swineSeriesList: [],
        swineVarietyList: [],
        swineStateList: [],
        swinwTypeList: [],
        querySwine: swine(),
        statusOptions: getSwineStatus(),
        defaultOptions: getDefault(),
        selectType: this.returnType == 'multiple' ? this.returnType : 'single',
        defaultFilter: this.filterCondition != undefined ? this.filterCondition : {},
        swineTypeID: this.filterCondition['swineType'] != undefined ?
          this.filterCondition['swineType'] : null,
        swineStateID: this.filterCondition['swineStateID'] != undefined ?
          this.filterCondition['swineStateID'] : null,
        swineStageID: this.filterCondition['swineStageID'] != undefined ?
          this.filterCondition['swineStageID'] : null,
        status: this.filterCondition['status'] != undefined ?
          parseInt(this.filterCondition['status']) : null,
        batchNo: this.filterCondition['batchNo'] != undefined ?
          this.filterCondition['batchNo'] : null,
        isDefective: this.filterCondition['isDefective'] != undefined ?
          this.filterCondition['isDefective'] : null,
        LocationID: '',
        LocationName: '',
        HouseLocationID: '',
        HouseName: '',
        table: {
          head: [{
              title: '耳號',
              data: 'SrcEarNo'
            },
            {
              title: '棟捨',
              data: 'HouseName'
            },
            {
              title: '實際位置',
              data: 'LocationName'
            },
            {
              title: '豬隻狀態',
              data: 'SwineStateName'
            },
            {
              title: '胎次',
              data: 'Parity'
            },
            {
              title: '情期',
              data: 'Estrus'
            },
            {
              title: '生日',
              data: 'BirthDate'
            },
            {
              title: '豬隻品種',
              data: 'SwineVarietyName'
            },
            {
              title: '豬隻係別',
              data: 'SwineSeriesName'
            },
            {
              title: '豬隻育種位階',
              data: 'SwineGenerationName'
            },
            {
              title: '初始重量',
              data: 'InitWeight'
            },
            {
              title: '父畜',
              data: 'Father'
            },
            {
              title: '母畜',
              data: 'Mother'
            },
            {
              title: '乳頭數',
              data: 'TeatNo'
            },
            {
              title: 'RFID',
              data: 'SwineID'
            },
            {
              title: '耳標號',
              data: 'SrcEarTagID'
            },
            {
              title: '批號',
              data: 'BatchNo'
            },
            {
              title: '場別代碼',
              data: 'SiteID'
            },
            {
              title: '殘次豬',
              data: 'IsDefectiveName'
            },
            {
              title: '豬隻狀態',
              data: 'StatusLabel'
            }
          ]
        }
      };
    },
    methods: {
      getSwine(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        if (vueInstance.defaultFilter['swineStateList'] != undefined) {
          getSwineListBySwineState({
              swineState: vueInstance.defaultFilter['swineStateList']
            },
            filter,
            function (response) {
              vueInstance.loadingText = null;
              if (response.IsSuccess) {
                vueInstance.swineList = response.Data;
                vueInstance.setOptionValue(vueInstance.swineList);
              }
            }
          );
        } else {
          getSwineList(filter, function (response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              vueInstance.swineList = response.Data;
              vueInstance.setOptionValue(vueInstance.swineList);
            }
          });
        }
      },
      getSwineType() {
        var vueInstance = this;
        getSwineTypeList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.swinwTypeList = response.Data;
          }
        });
      },
      getSwineGeneration() {
        var vueInstance = this;
        getSwineGenerationList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.swineGenerationList = response.Data;
          }
        });
      },
      getSwineSeries() {
        var vueInstance = this;
        getSwineSeriesList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.swineSeriesList = response.Data;
          }
        });
      },
      getSwineState() {
        var vueInstance = this;
        getSwineStateList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.swineStateList = response.Data;
          }
        });
      },
      getSwineVariety() {
        var vueInstance = this;
        getSwineVarietyList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.swineVarietyList = response.Data;
          }
        });
      },
      setOptionValue(selectList) {
        var vueInstance = this;
        for (var index = 0; index < selectList.length; index++) {
          if (selectList[index].Status == 0)
            selectList[index]['StatusLabel'] = '未啓用';
          else if (selectList[index].Status == 1)
            selectList[index]['StatusLabel'] = '啓用';
          else if (selectList[index].Status == 99)
            selectList[index]['StatusLabel'] = '死淘';
          else selectList[index]['StatusLabel'] = '';


          if (selectList[index].IsDefective == 0)
            selectList[index]['IsDefectiveName'] = '否';
          else if (selectList[index].IsDefective == 1)
            selectList[index]['IsDefectiveName'] = '是';
          else selectList[index]['IsDefectiveName'] = '';
          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['ExecDate'])
            ) == '1970-01-01'
          )
            selectList[index]['ExecDateLable'] = null;
          else {
            selectList[index]['ExecDateLable'] = moment(
              selectList[index].ExecDate
            ).format('YYYY-MM-DD HH:mm:00');
          }
        }
      },
      setLocation(colName, obj) {
        var vueInstance = this;
        if (colName == 'HouseLocationID') {
          vueInstance.HouseLocationID = obj.LocationID;
          vueInstance.HouseName = obj.Name;
        } else if (colName == 'LocationID') {
          vueInstance.LocationID = obj.LocationID;
          vueInstance.LocationName = obj.Name;
        }
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.swineTypeID != '')
          vueInstance.$set(filter, 'swineTypeID', vueInstance.swineTypeID);
        if (vueInstance.querySwine.SrcEarNo != '')
          vueInstance.$set(filter, 'srcEarNo', vueInstance.querySwine.SrcEarNo);
        if (vueInstance.LocationID != '')
          vueInstance.$set(filter, 'LocationID', vueInstance.LocationID);
        if (vueInstance.HouseLocationID != '')
          vueInstance.$set(
            filter,
            'HouseLocationID',
            vueInstance.HouseLocationID
          );

        if (vueInstance.filterCondition['status'] == undefined)
          vueInstance.$set(filter, 'status', 1);
        else
          vueInstance.$set(filter, 'status', vueInstance.filterCondition['status']);

        if (vueInstance.swineStageID != '')
          vueInstance.$set(filter, 'swineStageID', vueInstance.swineStageID);

        if (vueInstance.swineStateID != '')
          vueInstance.$set(filter, 'swineStateID', vueInstance.swineStateID);

        if (vueInstance.filterCondition['batchNo'] != undefined)
          vueInstance.$set(filter, 'batchNo', vueInstance.filterCondition['batchNo']);

        if (vueInstance.filterCondition['isDefective'] != undefined)
          vueInstance.$set(filter, 'isDefective', vueInstance.filterCondition['isDefective']);

        if (vueInstance.filterCondition['WorkCenterCode'] != undefined)
          vueInstance.$set(filter, 'WorkCenterCode', vueInstance.filterCondition['WorkCenterCode']);

        vueInstance.getSwine(filter);
      },
      fullFilter() {
        let filter = {};
        var vueInstance = this;

        if (vueInstance.LocationID != '')
          vueInstance.$set(filter, 'LocationID', vueInstance.LocationID);

        if (vueInstance.querySwine.HouseLocationID != '')
          vueInstance.$set(filter, 'HouseLocationID', vueInstance.HouseLocationID);

        if (vueInstance.querySwine.SwineID != '')
          vueInstance.$set(filter, 'swineID', vueInstance.querySwine.SwineID);

        if (vueInstance.batchNo != '')
          vueInstance.$set(filter, 'batchNo', vueInstance.batchNo);

        if (vueInstance.querySwine.SrcEarNo != '')
          vueInstance.$set(filter, 'srcEarNo', vueInstance.querySwine.SrcEarNo);

        if (vueInstance.swineTypeID != '')
          vueInstance.$set(filter, 'swineTypeID', vueInstance.swineTypeID);

        if (vueInstance.querySwine.SrcEarTagID != '')
          vueInstance.$set(filter, 'srcEarTagID', vueInstance.querySwine.SrcEarTagID);

        if (vueInstance.querySwine.SwineVarietyID != '')
          vueInstance.$set(filter, 'swineVarietyID', vueInstance.querySwine.SwineVarietyID);

        if (vueInstance.querySwine.SwineSeriesID != '')
          vueInstance.$set(filter, 'swineSeriesID', vueInstance.querySwine.SwineSeriesID);

        if (vueInstance.querySwine.SwineGenerationID != '')
          vueInstance.$set(filter, 'swineGenerationID', vueInstance.querySwine.SwineGenerationID);

        if (vueInstance.querySwine.BirthDate != '')
          vueInstance.$set(filter, 'birthDate', vueInstance.querySwine.BirthDate);

        if (vueInstance.querySwine.InitWeight != '')
          vueInstance.$set(filter, 'initWeight', vueInstance.querySwine.InitWeight);

        if (vueInstance.querySwine.TeatNo != '')
          vueInstance.$set(filter, 'teatNo', vueInstance.querySwine.TeatNo);

        if (vueInstance.querySwine.Father != '')
          vueInstance.$set(filter, 'father', vueInstance.querySwine.Father);

        if (vueInstance.querySwine.Mother != '')
          vueInstance.$set(filter, 'mother', vueInstance.querySwine.Mother);

        if (vueInstance.swineStateID != '')
          vueInstance.$set(filter, 'swineStateID', vueInstance.swineStateID);

        if (vueInstance.querySwine.Parity != '')
          vueInstance.$set(filter, 'parity', vueInstance.querySwine.Parity);

        if (vueInstance.querySwine.Estrus != '')
          vueInstance.$set(filter, 'estrus', vueInstance.querySwine.Estrus);

        if (vueInstance.status !== '')
          vueInstance.$set(filter, 'status', vueInstance.status);

        if (vueInstance.swineStageID != '')
          vueInstance.$set(filter, 'swineStageID', vueInstance.swineStageID);

        if (vueInstance.isDefective != '')
          vueInstance.$set(filter, 'isDefective', vueInstance.isDefective);

        if (vueInstance.filterCondition['WorkCenterCode'] != undefined)
          vueInstance.$set(filter, 'WorkCenterCode', vueInstance.filterCondition['WorkCenterCode']);

        vueInstance.getSwine(filter);
        vueInstance.dlgFullfilter = false;
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else if (this.filterCondition['status'] == undefined) {
          vueInstance.status = parseInt(command);
        }
      }
    },
    mounted() {
      this.getSwineType();
      this.getSwineVariety();
      this.getSwineGeneration();
      this.getSwineSeries();
      this.getSwineState();
      this.swineList = this.defaultList != undefined ? this.defaultList : [];
      this.setOptionValue(this.swineList);
      this.HouseName = this.filterCondition['HouseName'];
      this.HouseLocationID = this.filterCondition['HouseLocationID'];
      this.LocationID = this.filterCondition['LocationID'];
      this.LocationNmae = this.filterCondition['LocationNmae'];
    },
    watch: {
      reloading() {
        if (this.reloading) {
          this.swineList = [];
          this.setOptionValue(this.swineList);
          this.querySwine = swine();
          this.$emit('change', []);
          this.dlgFullfilter = false;
        }
      },
      defaultList() {
        this.swineList = this.defaultList;
        this.setOptionValue(this.swineList);
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
      filterCondition() {
        this.defaultFilter = this.filterCondition;
        this.swineTypeID = this.filterCondition['swineType'];
        this.status = parseInt(this.filterCondition['status']);
        this.HouseName = this.filterCondition['HouseName'];
        this.HouseLocationID = this.filterCondition['HouseLocationID'];
        this.LocationID = this.filterCondition['LocationID'];
        this.LocationNmae = this.filterCondition['LocationNmae'];
        this.swineStageID = this.filterCondition['swineStageID'];
        this.swineStateID = this.filterCondition['swineStateID'];
        this.batchNo = this.filterCondition['batchNo'];
        this.isDefective = this.defaultFilter['isDefective'];
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'locationInput': LocationInput
    }
  };

</script>
