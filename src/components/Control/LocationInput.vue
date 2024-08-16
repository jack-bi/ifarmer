<template>
  <div>
    <loadingPage :loadingText="loadingText"></loadingPage>

    <el-input :id="inputID" v-model="locationName" class="input-with-select" :disabled="isdisable" clearable>
      <el-button slot="append" icon="el-icon-search" @click="showQueryDialog" :disabled="isdisable"></el-button>
    </el-input>

    <div class="rfidBlock px-1" :title="locationID">代碼: {{locationID}}</div>

    <el-dialog :visible.sync="dlgQueryLocation" width="80%" :close-on-click-modal="false" append-to-body>
      <queryLocation :reloading="dlgQueryLocation" :returnType="returnType" v-model="selectedRows" :filterCondition="filterCondition" :defaultList="locationList">
        <el-button slot="actionBtn" type="primary" @click="setLocation">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryLocation>
    </el-dialog>

  </div>
</template>


<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import LocationQ from '@/components/CommonQuery/LocationQ';
  import { getLocationListByName } from '@/assets/js/iFarmer/manager/locationManager';

  export default {
    /*
      inputID: SwineInput ID 必填
      defaultValue: ParentModel 對應欄位值 必填
      colName: 回傳的對應欄位名稱 必填
      disable: (true/false)
      */
    props: [
      'filterCondition',
      'inputID',
      'colName',
      'disable',
      'defaultCode',
      'defaultName'
    ],
    data: function() {
      return {
        dlgQueryLocation: false,
        loadingText: null,
        isdisable: this.disable != undefined ? this.disable : false,
        returnType: 'single',
        locationName: '',
        locationID: '',
        locationList: [],
        selectedRows: []
      };
    },
    methods: {
      showAlert(title, msg) {
        var vueInstance = this;
        vueInstance.$notify.warning({
          title: title,
          message: msg
        });
      },
      getLocation(locationName) {
        var vueInstance = this;
        if (
          vueInstance.locationName != '' &&
          vueInstance.locationName != undefined &&
          vueInstance.locationList.length == 0
        ) {
          let filter =
            vueInstance.filterCondition != undefined
              ? vueInstance.filterCondition
              : {};
          vueInstance.loadingText = '資料搜尋中';
          getLocationListByName(locationName, filter, function(response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              if (response.Data.length == 0) {
                vueInstance.showAlert('提示', '找不到對應位置名稱');
                vueInstance.locationName = '';
                vueInstance.returnLocationlocationList({});
              } else if (response.Data.length == 1)
                vueInstance.returnLocation(response.Data[0]);
              else {
                vueInstance.locationList = response.Data;
                vueInstance.dlgQueryLocation = true;
              }
            }
          });
        }
      },
      setLocation() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.returnLocation(vueInstance.selectedRows[0]);
          vueInstance.selectedRows = [];
          vueInstance.locationList = [];
          vueInstance.dlgQueryLocation = false;
        }
      },
      returnLocation(location) {
        var vueInstance = this;
        let name = this.colName != undefined ? this.colName : 'LocationID';

        if (location.LocationID != undefined) {
          vueInstance.locationID = location.LocationID;
          vueInstance.locationName = location.Name;
          vueInstance.$emit('selectLocation', name, location);
        } else {
          vueInstance.locationID = '';
          vueInstance.locationName = '';
          vueInstance.locationList = [];
          vueInstance.$emit('selectLocation', name, location);
        }
      },
      showQueryDialog() {
        if (!this.isdisable) this.dlgQueryLocation = true;
      }
    },
    mounted: function() {
      var vueInstance = this;
      $('#' + vueInstance.inputID).keyup(function(event) {
        vueInstance.locationID = '';
        if (vueInstance.locationName != '' && event.keyCode == 13) {
          vueInstance.getLocation(vueInstance.locationName);
        }
      });
      $('#' + vueInstance.inputID).blur(function() {
        if (vueInstance.locationName != '' && vueInstance.locationID == '')
          vueInstance.getLocation(vueInstance.locationName);
      });
      this.locationID = this.defaultCode;
      this.locationName = this.defaultName;
      this.isdisable = this.disable != undefined ? this.disable : false;
    },
    watch: {
      defaultCode() {
        this.locationID = this.defaultCode;
      },
      defaultName() {
        this.locationName = this.defaultName;
      },
      disable() {
        this.isdisable = this.disable;
      },
      locationName() {
        if (this.locationName == '')
          this.returnLocation({
            LocationID: null,
            Name: null
          });
      },
      dlgQueryLocation() {
        if (!this.dlgQueryLocation && this.locationID == '')
          this.returnLocation({
            LocationID: null,
            Name: null
          });
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'queryLocation': LocationQ
    }
  };
</script>

<style>
  .el-form-label-left .el-form-item__label {
    text-align: center;
  }

  .rfidBlock {
    line-height: 20px;
    font-size: 12px;
  }
</style>
