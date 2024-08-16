<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">請購作業查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">

                <div class="col-md-6 queryBlock">
                  <el-form-item label="請購日">
                    <el-date-picker placeholder="請輸入請購日期" v-model="queryPurchaseRequest.RequestDate" :picker-options="timeOptions" clearable value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購類別">
                    <el-select v-model="queryPurchaseRequest.PurchaseTypeCode" placeholder="請選擇採購類別" :disabled="PurchaseTypeCondition != undefined">
                      <el-option v-for="item in PurchaseTypeList" :key="item.PurchaseTypeCode" :label="item.Name" :value="item.PurchaseTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簽核狀態">
                    <el-select v-model="approveStatus" placeholder="請選擇簽核狀態" :disabled="ApproveStatusCondition != undefined">
                      <el-option v-for="option in ApproveStatusOption" :key="option.value" :label="option.label" :value="option.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <statusMultiSelect v-model="status" :defaultValue="status" :reSetting="reloading" :statusCode="this.statusCode" :statusOptions="statusOptions"
                    :statusCondition="this.StatusCondition">
                  </statusMultiSelect>
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
            <data-table v-if="ItemTable !== null" v-model="selectedRows" :selectionMode="selectType" :columns="ItemTable.head" :data="queryPurchaseRequestItemList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">請購作業進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="請購日">
                    <el-date-picker placeholder="請輸入請購日期" v-model="queryPurchaseRequest.RequestDate" :picker-options="timeOptions" clearable value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <el-form-item label="請購人">
                    <employeeInput :filterCondition="{}" inputID="RequestEmpNo" colName="RequestEmpNo" :defaultCode="queryPurchaseRequest.RequestEmpNo" :defaultName="queryPurchaseRequest.RequestEmpName" @selectEmp="setEmployee">
                    </employeeInput>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購類別">
                    <el-select v-model="queryPurchaseRequest.PurchaseTypeCode" placeholder="請選擇採購類別" :disabled="PurchaseTypeCondition != undefined">
                      <el-option v-for="item in PurchaseTypeList" :key="item.PurchaseTypeCode" :label="item.Name" :value="item.PurchaseTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <el-form-item label="簽核狀態">
                    <el-select v-model="approveStatus" placeholder="請選擇簽核狀態" :disabled="ApproveStatusCondition != undefined">
                      <el-option v-for="option in ApproveStatusOption" :key="option.value" :label="option.label" :value="option.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <statusMultiSelect v-model="status" :defaultValue="status" :reSetting="reloading" :statusCode="this.statusCode" :statusOptions="statusOptions"
                    :statusCondition="this.StatusCondition">
                  </statusMultiSelect>
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
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import ItemInput from '@/components/Control/ItemInput';
  import EmployeeInput from '@/components/Control/EmployeeInput';
  import {
    getApproveStatus
  } from '@/assets/js/iFarmer.v2/library/optionLib';
  import {
    purchaseRequest
  } from '@/assets/js/iFarmer/model/purchaseRequest.js';
  import {
    getData
  } from '@/assets/js/iFarmer.v2/manager/genericManager';
  import {
    mixinERP
  } from '@/assets/js/iFarmer.v2/mixin/erpMixin';

  export default {
    mixins: [mixinERP],
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
      ApproveStatusCondition: {
        type: String,
        default: function() {
          return undefined;
        }
      },
      StatusCondition: {
        type: Array,
        default: function () {
          return [];
        }
      },
      PurchaseTypeCondition: {
        type: String,
        default: function() {
          return undefined;
        }
      }
    },
    data: function() {
      return {
        timeOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        dlgFullfilter: false,
        loadingText: null,
        selectType: this.returnType == 'Single' ? this.returnType : 'multiple',
        queryPurchaseRequestList: [],
        queryPurchaseRequestItemList: [],
        selectedRows: [],
        PurchaseTypeList: [],
        queryPurchaseRequest: purchaseRequest(),
        ApproveStatusOption: getApproveStatus(),
        status: [3],
        approveStatus: 'N',
        ItemTable: {
          head: [{
              title: '請購單號',
              data: 'FormID'
            }, {
              title: '請購日',
              data: 'RequestDateName'
            }, {
              title: '請購人',
              data: 'RequestEmpName'
            }, {
              title: '料件',
              data: 'ItemName'
            },
            {
              title: '指定批號',
              data: 'LotNo'
            },
            {
              title: '請購數量',
              data: 'Qty'
            },
            {
              title: '請購單位',
              data: 'UOMName'
            },
            {
              title: '未稅單價',
              data: 'UntaxedCurrPrice'
            },
            {
              title: '未稅金額',
              data: 'UntaxedCurrAmt'
            },
            {
              title: '已採購數量',
              data: 'PurchaseQty'
            }
          ]
        },
      };
    },
    methods: {
      getPurchaseType(filter) {
        var vueInstance = this;
        vueInstance.PurchaseTypeList = [];

        getData('PurchaseType', filter, function(response) {
          if (response) {
            vueInstance.PurchaseTypeList = response;
          }
        });
      },
      getPurchaseRequest(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.queryPurchaseRequestItemList = [];
        vueInstance.loadingText = '資料搜尋中';
        getData('VPurchaseRequest', filter, function(response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.queryPurchaseRequestList = response;
            vueInstance.setOptionValue(vueInstance.queryPurchaseRequestList);

            vueInstance.queryPurchaseRequestList.forEach(function(val, idx, array) {
              vueInstance.getPurchaseRequestItem({
                FormID: val.FormID,
                CanBeSelect: 1,
                Status: [vueInstance.statusCode.Unprocessed, vueInstance.statusCode.Processing]
              });
            });
          }
        });
      },
      getPurchaseRequestItem(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getData('VPurchaseRequestItem', filter, function(response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.queryPurchaseRequestItemList = vueInstance.queryPurchaseRequestItemList.concat(response);
            vueInstance.setOptionValue(vueInstance.queryPurchaseRequestItemList);
          }
        });
      },

      simpleFilter() {
        var vueInstance = this;
        let filter = {};

        if (vueInstance.queryPurchaseRequest.RequestDate != null)
          vueInstance.$set(filter, 'RequestDate', vueInstance.queryPurchaseRequest.RequestDate);

        if (vueInstance.queryPurchaseRequest.PurchaseTypeCode !== '')
          vueInstance.$set(filter, 'PurchaseTypeCode', vueInstance.queryPurchaseRequest.PurchaseTypeCode);

        if (vueInstance.approveStatus != '') {
          vueInstance.$set(filter, 'ApproveStatus', vueInstance.approveStatus);
        }

        if (vueInstance.status.length > 0)
          vueInstance.$set(filter, 'Status', vueInstance.status);

        vueInstance.getPurchaseRequest(filter);
      },
      fullFilter() {
        var vueInstance = this;
        let filter = {};

        if (vueInstance.queryPurchaseRequest.RequestDate != null)
          vueInstance.$set(filter, 'RequestDate', vueInstance.queryPurchaseRequest.RequestDate);

        if (vueInstance.queryPurchaseRequest.RequestEmpNo !== '')
          vueInstance.$set(filter, 'RequestEmpNo', vueInstance.queryPurchaseRequest.RequestEmpNo);

        if (vueInstance.queryPurchaseRequest.PurchaseTypeCode !== '')
          vueInstance.$set(filter, 'PurchaseTypeCode', vueInstance.queryPurchaseRequest.PurchaseTypeCode);

        if (vueInstance.approveStatus != '') {
          vueInstance.$set(filter, 'ApproveStatus', vueInstance.approveStatus);
        }

        if (vueInstance.status.length > 0)
          vueInstance.$set(filter, 'Status', vueInstance.status);

        vueInstance.getPurchaseRequest(filter);
        vueInstance.dlgFullfilter = false;
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {

          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['RequestDate'])
            ) == '1970-01-01'
          )
            selectList[index]['RequestDateName'] = null;
          else {
            selectList[index]['RequestDateName'] = moment(
              selectList[index].RequestDate
            ).format('YYYY-MM-DD');
          }
          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['RequiredDate'])
            ) == '1970-01-01'
          )
            selectList[index]['RequiredDateName'] = null;
          else {
            selectList[index]['RequiredDateName'] = moment(
              selectList[index].RequiredDate
            ).format('YYYY-MM-DD');
          }
        }
      },

      setEmployee(item, obj) {
        this.$set(this.queryPurchaseRequest, 'RequestEmpNo', obj.EmpNo);
        this.$set(this.queryPurchaseRequest, 'RequestEmpName', obj.Name);
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.queryPurchaseRequest.Status = command;
        }
      }
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.queryPurchaseRequestList = [];
          this.queryPurchaseRequestItemList = [];
          this.queryPurchaseRequest = purchaseRequest();
          this.$emit('change', []);
          this.dlgFullfilter = false;
          this.approveStatus = this.ApproveStatusCondition != undefined ? this.ApproveStatusCondition : this.approveStatusCode.Pending;
          if (this.PurchaseTypeCondition != undefined)
            this.queryPurchaseRequest.PurchaseTypeCode = this.PurchaseTypeCondition;
        }
      },
      selectedRows: function() {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          returnList.push(tmpObj);
        });
        if (returnList.length > 0)
          this.$emit('change', returnList);
      },
      ApproveStatusCondition: {
        immediate: true,
        handler() {
          this.approveStatus = this.ApproveStatusCondition;
        }
      },
      PurchaseTypeCondition: {
        immediate: true,
        handler() {
          this.queryPurchaseRequest.PurchaseTypeCode = this.PurchaseTypeCondition;
        }
      }
    },
    mounted: function() {
      this.getPurchaseType({
        Status: this.statusCode.Active
      });
      this.approveStatus = this.ApproveStatusCondition;
      this.queryPurchaseRequest.PurchaseTypeCode = this.PurchaseTypeCondition;
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'ItemInput': ItemInput,
      'employeeInput': EmployeeInput
    }
  };
</script>
