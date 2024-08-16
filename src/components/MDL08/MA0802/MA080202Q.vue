<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">採購作業查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購日期">
                    <el-date-picker placeholder="請選擇採購日期" v-model="queryPurchaseOrder.PurchaseDate" clearable value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購單號">
                    <el-input v-model="queryPurchaseOrder.FormID" placeholder="請輸入採購單號" class="input-with-select" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簽核狀態">
                    <el-select v-model="approveStatus" placeholder="請選擇簽核狀態" :disabled="ApproveStatusCondition != undefined" clearable>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="queryPurchaseOrderList" :orderIndex=1 :orderBy="'desc'" :isReadOnly="isReadOnly"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">採購作業進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購日期" prop="PurchaseDate">
                    <el-date-picker placeholder="請選擇採購日期" v-model="queryPurchaseOrder.PurchaseDate" clearable value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購單號">
                    <el-input v-model="queryPurchaseOrder.FormID" placeholder="請輸入採購單號" class="input-with-select" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購人" prop="PurchaseEmpNo">
                    <employeeInput :filterCondition="{}" inputID="PurchaseEmpNo" colName="PurchaseEmpNo" :defaultCode="queryPurchaseOrder.PurchaseEmpNo" :defaultName="queryPurchaseOrder.PurchaseName" @selectEmp="setEmployee">
                    </employeeInput>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="採購類別" prop="PurchaseTypeCode">
                    <el-select v-model="queryPurchaseOrder.PurchaseTypeCode" placeholder="請選擇採購類別" clearable>
                      <el-option v-for="item in PurchaseTypeList" :key="item.PurchaseTypeCode" :label="item.Name" :value="item.PurchaseTypeCode"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="供應商" prop="SupplierNo">
                    <el-input v-model="queryPurchaseOrder.SupplierName" class="input-with-select" @change="setSupplier" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="dlgQuerySupplier = true"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="簽核狀態">
                    <el-select v-model="approveStatus" placeholder="請選擇簽核狀態" :disabled="ApproveStatusCondition != undefined" clearable>
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

    <el-dialog :visible.sync="dlgQuerySupplier" width="80%" :close-on-click-modal="false" append-to-body>
      <querySupplier :reloading="dlgQuerySupplier" :returnType="'Single'" v-model="selectedSupplierRows">
        <el-button slot="actionBtn" type="primary" @click="setSupplier">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </querySupplier>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import EmployeeInput from '@/components/Control/EmployeeInput';
  import SupplierQ from '@/components/MDL08/MA0801/MA080101Q';
  import {
    getApproveStatus
  } from '@/assets/js/iFarmer.v2/library/optionLib';
  import {
    purchaseOrder
  } from '@/assets/js/iFarmer/model/purchaseOrder.js';
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
      isReadOnly: {
        type: Boolean,
        default: function() {
          return false;
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
      }
    },
    data: function() {
      return {
        timeOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        dlgFullfilter: false,
        dlgQuerySupplier: false,
        loadingText: null,
        selectedRows: [],
        selectType: this.returnType == 'Single' ? this.returnType : 'multiple',
        queryPurchaseOrderList: [],
        selectedSupplierRows: [],
        PurchaseTypeList: [],
        queryPurchaseOrder: purchaseOrder(),
        ApproveStatusOption: getApproveStatus(),
        status: [3],
        approveStatus: 'N',
        table: {
          head: [{
              title: '採購單號',
              data: 'FormID'
            },
            {
              title: '採購日期',
              data: 'PurchaseDateName'
            },
            {
              title: '採購類別',
              data: 'PurchaseTypeName'
            },
            {
              title: '採購人',
              data: 'RequestEmpName'
            },
            {
              title: '供應商',
              data: 'SupplierName'
            },
            {
              title: '需求日',
              data: 'RequiredDateName'
            },
            {
              title: '預計付款日',
              data: 'EstimatedPayDateName'
            },
            {
              title: '錶單狀態',
              data: 'StatusName'
            }
          ]
        }
      };
    },
    methods: {
      getPurchaseOrder(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getData('VPurchaseOrder', filter, function(response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.queryPurchaseOrderList = response;
            vueInstance.setOptionValue(vueInstance.queryPurchaseOrderList);
          }
        });
      },
      getPurchaseType(filter) {
        var vueInstance = this;
        vueInstance.PurchaseTypeList = [];

        getData('PurchaseType', filter, function(response) {
          if (response) {
            vueInstance.PurchaseTypeList = response;
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.status.length > 0)
          vueInstance.$set(filter, 'Status', vueInstance.status);

        if (vueInstance.queryPurchaseOrder.PurchaseDate != null) {
          vueInstance.$set(filter, 'PurchaseDate', vueInstance.queryPurchaseOrder.PurchaseDate);
        }

        if (vueInstance.queryPurchaseOrder.PurchaseEmpNo != '') {
          vueInstance.$set(filter, 'PurchaseEmpNo', vueInstance.queryPurchaseOrder.PurchaseEmpNo);
        }

        if (vueInstance.queryPurchaseOrder.FormID !== '')
          vueInstance.$set(filter, 'FormID', vueInstance.queryPurchaseOrder.FormID);

        if (vueInstance.approveStatus != '') {
          vueInstance.$set(filter, 'ApproveStatus', vueInstance.approveStatus);

        }

        vueInstance.getPurchaseOrder(filter);
      },
      fullFilter() {
        let filter = {};
        var vueInstance = this;
        if (vueInstance.status.length > 0)
          vueInstance.$set(filter, 'Status', vueInstance.status);

        if (vueInstance.queryPurchaseOrder.PurchaseDate != null) {
          vueInstance.$set(filter, 'PurchaseDate', vueInstance.queryPurchaseOrder.PurchaseDate);
        }
        if (vueInstance.queryPurchaseOrder.PurchaseEmpNo != '') {
          vueInstance.$set(filter, 'PurchaseEmpNo', vueInstance.queryPurchaseOrder.PurchaseEmpNo);
        }
        if (vueInstance.queryPurchaseOrder.FormID !== '')
          vueInstance.$set(filter, 'FormID', vueInstance.queryPurchaseOrder.FormID);

        if (vueInstance.queryPurchaseOrder.PurchaseTypeCode != '') {
          vueInstance.$set(filter, 'PurchaseTypeCode', vueInstance.queryPurchaseOrder.PurchaseTypeCode);
        }
        if (vueInstance.queryPurchaseOrder.SupplierNo != '') {
          vueInstance.$set(filter, 'SupplierNo', vueInstance.queryPurchaseOrder.SupplierNo);
        }
        if (vueInstance.approveStatus != '') {
          vueInstance.$set(filter, 'ApproveStatus', vueInstance.approveStatus);
        }

        vueInstance.getPurchaseOrder(filter);
        vueInstance.dlgFullfilter = false;
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.status = command;
        }
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {

          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['PurchaseDate'])
            ) == '1970-01-01'
          )
            selectList[index]['PurchaseDateName'] = null;
          else {
            selectList[index]['PurchaseDateName'] = moment(
              selectList[index].PurchaseDate
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
          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['EstimatedPayDate'])
            ) == '1970-01-01'
          )
            selectList[index]['EstimatedPayDateName'] = null;
          else {
            selectList[index]['EstimatedPayDateName'] = moment(
              selectList[index].EstimatedPayDate
            ).format('YYYY-MM-DD');
          }
        }
      },
      setEmployee(item, obj) {
        this.$set(this.queryPurchaseOrder, "PurchaseEmpNo", obj.EmpNo);
        this.$set(this.queryPurchaseOrder, "PurchaseName", obj.Name);
        this.$set(this.queryPurchaseOrder, "CompCode", this.loginCompCode);
      },
      setSupplier() {
        var vueInstance = this;
        if (vueInstance.selectedSupplierRows.length > 0) {
          vueInstance.queryPurchaseOrder.SupplierNo = vueInstance.selectedSupplierRows[0].SupplierNo;
          vueInstance.queryPurchaseOrder.SupplierName = vueInstance.selectedSupplierRows[0].Name;
          vueInstance.selectedSupplierRows = [];
          vueInstance.dlgQuerySupplier = false;
        }
      }
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.queryPurchaseOrderList = [];
          this.queryPurchaseOrder = purchaseOrder();
          this.$emit('change', []);
          this.dlgFullfilter = false;
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
      'queryPurchaseOrder.SupplierName': {
        immediate: true,
        handler() {
          if (this.queryPurchaseOrder.SupplierName == '' || this.queryPurchaseOrder.SupplierName == undefined) {
            this.queryPurchaseOrder.SupplierNo = undefined;
          }
        },
      },
      'queryPurchaseOrder.PurchaseTypeCode': {
        immediate: true,
        handler() {
          if (this.queryPurchaseOrder.PurchaseTypeCode == '' || this.queryPurchaseOrder.PurchaseTypeCode == undefined) {
            this.queryPurchaseOrder.PurchaseTypeCode = undefined;
          }
        },
      },
      ApproveStatusCondition() {
        this.approveStatus = this.ApproveStatusCondition != undefined ? this.ApproveStatusCondition : this.approveStatusCode.Pending;
      }
    },
    mounted() {
      this.getPurchaseType({});
      this.approveStatus = this.ApproveStatusCondition != undefined ? this.ApproveStatusCondition : this.approveStatusCode.Pending;
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable,
      'employeeInput': EmployeeInput,
      'querySupplier': SupplierQ
    }
  };
</script>
