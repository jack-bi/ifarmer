<template>
  <div class="row">
    <div class="col-md-4 col-padding">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">採購作業</div>
            <div class="col-8" style="text-align: right" v-if="this.isModify">
              <el-button-group>
                <el-button type="buttonSave" @click="initMaster()" icon="el-icon-plus" size="mini" circle></el-button>
                <el-button type="success" icon="el-icon-search" size="mini" circle @click="dlgQueryC = true">
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <el-tabs v-model="masterTab" type="card">
          <el-tab-pane label="基本資料" name="first">
            <el-form :model="master" :rules="masterRules" ref="master1" :label-position="'left'" label-width="80px">
              <el-form-item label="採購日期" prop="PurchaseDate">
                <el-date-picker placeholder="請選擇採購日期" v-model="master.PurchaseDate" clearable value-format="yyyy-MM-dd"
                  :picker-options="timeOptions" :disabled="this.pageReadOnly">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="採購類別" prop="PurchaseTypeCode">
                <el-select v-model="master.PurchaseTypeCode" placeholder="請選擇採購類別"
                  :disabled="this.pageReadOnly || master.Status != undefined">
                  <el-option v-for="item in purchaseTypeOption" :key="item.PurchaseTypeCode" :label="item.Name"
                    :value="item.PurchaseTypeCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="採購人" prop="PurchaseEmpNo">
                <employeeInput :filterCondition="{}" inputID="PurchaseEmpNo" colName="PurchaseEmpNo"
                  :defaultCode="master.PurchaseEmpNo" :defaultName="master.RequestEmpName" :disable="this.pageReadOnly"
                  @selectEmp="setEmployee">
                </employeeInput>
              </el-form-item>
              <el-form-item label="供應商" prop="SupplierNo">
                <el-input v-model="master.SupplierName" class="input-with-select" @change="setSupplier" clearable
                  :disabled="this.pageReadOnly" readonly>
                  <el-button slot="append" icon="el-icon-search" @click="dlgQuerySupplier = true"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="需求日" prop="RequiredDate">
                <el-date-picker placeholder="請選擇需求日" v-model="master.RequiredDate" clearable value-format="yyyy-MM-dd"
                  :picker-options="endDatePicker" :disabled="this.pageReadOnly">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="採購說明" prop="Remark">
                <el-input type="textarea" autosize placeholder="請輸入採購說明" v-model="master.Remark"
                  :disabled="this.pageReadOnly">
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="帳務資訊" name="second">
            <el-form :model="master" :rules="masterRules" ref="master2" :label-position="'left'" label-width="80px">
              <el-form-item label="付款條件" prop="PaymentCode">
                <el-select v-model="master.PaymentCode" placeholder="請選擇付款條件" :disabled="this.pageReadOnly">
                  <el-option v-for="item in paymentTermOption" :key="item.PaymentCode" :label="item.Name"
                    :value="item.PaymentCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="預計付款日" prop="EstimatedPayDate">
                <el-date-picker placeholder="請選擇預計付款日" v-model="master.EstimatedPayDate" clearable
                  value-format="yyyy-MM-dd" :picker-options="endDatePicker" :disabled="this.pageReadOnly">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="幣別" prop="CurrencyCode">
                <el-select v-model="master.CurrencyCode" placeholder="請選擇幣別" :disabled="this.pageReadOnly"
                  @change="getExrate()">
                  <el-option v-for="item in currencyOption" :key="item.CurrencyCode" :label="item.Name"
                    :value="item.CurrencyCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="匯率" prop="Exrate">
                <el-input-number v-model="master.Exrate" controls-position="right" :precision="4" :step="0.01"
                  :max="9999.9999" :min="0" placeholder="請輸入匯率"
                  :disabled="this.pageReadOnly || master.CurrencyCode == 'RMB'"></el-input-number>
              </el-form-item>
              <el-form-item label="稅別" prop="TaxCode">
                <el-select v-model="master.TaxCode" placeholder="請選擇稅別" :disabled="this.pageReadOnly"
                  @change="getTaxRate()">
                  <el-option v-for="item in taxTypeOption" :key="item.TaxCode" :label="item.Name" :value="item.TaxCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="稅率" prop="TaxRate">
                <el-input-number v-model="master.TaxRate" controls-position="right" :precision="4" :step="0.01"
                  :max="99.9999" :min="0" placeholder="請輸入稅率" :disabled="true"></el-input-number>
              </el-form-item>
              <el-form-item label="未稅金額" prop="CurrencyAmt1">
                <el-input maxlength=15 v-model="master.UntaxedCurrAmt" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="含稅金額" prop="CurrencyAmt1">
                <el-input maxlength=15 v-model="master.TaxedCurrAmt" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="稅額" prop="CurrencyAmt1">
                <el-input maxlength=15 v-model="master.CurrencyTaxes" disabled>
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="審核資訊" name="third">
            <el-form :model="master" :rules="masterRules" ref="master3" :label-position="'left'" label-width="100px">
              <el-form-item label="核準日期">
                <el-date-picker placeholder="" v-model="master.ApproveDate" :picker-options="timeOptions" clearable
                  value-format="yyyy-MM-dd" disabled="disabled">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="核準人員">
                <employeeInput :filterCondition="{}" inputID="ApproveUserID" colName="ApproveUserID"
                  :defaultCode="master.ApproveUserID" :defaultName="master.ApproveUserName" @selectEmp="setEmployee"
                  :disable="true">
                </employeeInput>
              </el-form-item>
              <el-form-item label="簽核狀態">
                <el-select v-model="master.ApproveStatus" placeholder="" clearable disabled="disabled">
                  <el-option v-for="option in approveStatusOptions" :key="option.value" :label="option.label"
                    :value="option.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="錶單狀態">
                <el-select v-model="master.Status" placeholder="" clearable disabled="disabled">
                  <el-option v-for="option in statusOptions" :key="option.value" :label="option.label"
                    :value="option.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="row">
          <div class="col-12" style="text-align: right;">
            <actionComponent :loadingText="loadingText" :status="master.Status" :approveStatus="master.ApproveStatus"
              @deleteEvent="deleteAll" @saveEvent="save" @applyEvent="approveAction(command.Apply)"
              @rejectEvent="approveAction(command.Reject)" @approveEvent="approveAction(command.Approve)">
            </actionComponent>
          </div>
        </div>
      </el-card>
    </div>
    <div class="col-md-8 col-padding">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">採購明細錶</div>
            <div class="col-8" style="text-align: right"
              v-show="!this.pageReadOnly && master.PurchaseTypeCode != undefined">
              <el-button-group>
                <el-button type="success" icon="el-icon-plus" size="mini" circle @click="dlgQueryPurchaseRequest = true"
                  v-show="selectedDetailRows.length == 0"></el-button>
                <el-button type="warning" icon="el-icon-delete" size="mini" circle @click="deleteDetail()"
                  v-show="selectedDetailRows.length != 0"></el-button>
                <el-button type="success" icon="el-icon-edit" size="mini" circle @click="editDetail()"
                  v-show="selectedDetailRows.length != 0"></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <data-table v-if="table !== null" v-model="selectedDetailRows" :selectionMode="'Single'" :columns="table.head"
          :data="detailList" :reSetting="detailList.length>0" :orderIndex=1 :orderBy="'desc'"
          :isReadOnly="this.pageReadOnly"></data-table>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgQueryC" width="80%" :close-on-click-modal="false">
      <queryPurchaseOrder :reloading="dlgQueryC" :returnType="'Single'" v-model="selectedMasterRows">
        <el-button slot="actionBtn" type="primary" @click="setPurchaseOrder"><i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryPurchaseOrder>
    </el-dialog>

    <el-dialog :title="detailTitle" :visible.sync="dlgDetail" width="60%" :close-on-click-modal="false">
      <div class="row">
        <el-form :model="detail" :rules="detailRules" ref="detail" :label-position="'left'" label-width="80px">
          <div class="row col-md-12">
            <div class="col-md-6">
              <el-form-item label="料件名稱" prop="ItemNo">
                <ItemInput inputID="ItemNo" colName="ItemNo" :filterCondition="{}" :defaultCode="detail.ItemNo"
                  :defaultName="detail.ItemName" @selectItem="setItem" :disable="true">
                </ItemInput>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="料件批號" prop="LotNo">
                <el-input maxlength=15 v-model="detail.LotNo" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="採購數量" prop="Qty">
                <el-input-number controls-position="right" :precision=2 :step=0.01 :min="0.01" :max=999999999.99
                  placeholder="請輸入採購數量" v-model="detail.Qty" :disabled="this.pageReadOnly">
                </el-input-number>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="採購單位" prop="UOM">
                <el-select v-model="detail.UOM" placeholder="請選先擇料件" :disabled="switchUOM" clearable>
                  <el-option v-for="item in itemUnitOption" :key="item.ID" :label="item.Name" :value="item.UnitCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="換算比率" prop="ExchangeRate">
                <el-input-number controls-position="right" :precision=9 :step=0.01 :min="0"
                  :max=9999999999999999999.999999999 placeholder="請輸入換算比率" v-model="detail.ExchangeRate">
                </el-input-number>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="庫存異動量">
                <el-input class="textInput" placeholder="" v-model="ItemStockQty" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="庫存單位">
                <el-select v-model="detail.StockUOM" placeholder="" disabled>
                  <el-option v-for="item in itemUnitOption" :key="item.ID" :label="item.Name" :value="item.UnitCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="供應商報價單價" prop="QuotePrice">
                <el-input-number controls-position="right" :precision=2 :step=0.01 :min="0" :max=99999999.99
                  placeholder="請輸入供應商報價單價" v-model="detail.QuotePrice" clearable>
                </el-input-number>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="未稅單價" prop="UntaxedCurrPrice">
                <el-input-number controls-position="right" :precision=2 :step=0.01 :min="0" :max=99999999.99
                  placeholder="請輸入未稅單價" v-model="detail.UntaxedCurrPrice" clearable>
                </el-input-number>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="含稅單價">
                <el-input-number controls-position="right" :precision=2 :step=0.01 :min="0" :max=99999999.99
                  placeholder="" :value="detail.TaxedCurrPrice" :disabled="true">
                </el-input-number>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="未稅金額">
                <el-input class="textInput" placeholder="" v-model="detail.UntaxedCurrAmt" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="本幣未稅金額">
                <el-input class="textInput" placeholder="" v-model="detail.UntaxedAmt" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="含稅金額">
                <el-input class="textInput" placeholder="" v-model="detail.TaxedCurrAmt" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="本幣含稅金額">
                <el-input class="textInput" placeholder="" v-model="detail.TaxedAmt" disabled>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="col-12" style="text-align: right">
        <el-button size="small" type="buttonSave" @click="saveDetail()">儲存</el-button>
        <el-button size="small" type="danger" @click="deletePurchaseOrderItem()" v-show="selectedDetailRows.length > 0">
          刪除</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dlgQueryPurchaseRequest" width="80%" :close-on-click-modal="false" append-to-body>
      <queryHistoryComponent :reloading="dlgQueryPurchaseRequest" :returnType="'multiple'"
        v-model="selectedPurchaseRequestItemRows" :PurchaseTypeCondition="master.PurchaseTypeCode"
        :StatusCondition="[3,4]" :ApproveStatusCondition="approveStatusCode.Approve">
        <el-button slot="actionBtn" type="primary" @click="setPurchaseRequestItem">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryHistoryComponent>
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
  import FormAction from '@/components/Control/ERPFormAction';
  import datatable from '@/components/Control/DataTable';
  import EmployeeInput from '@/components/Control/EmployeeInput';
  import PurchaseOrderQ from '@/components/MDL08/MA0802/MA080202Q';
  import PurchaseRequestItemQ from '@/components/MDL08/MA0802/PurchaseRequestItemQ';
  import ItemInput from '@/components/Control/ItemInput';
  import SupplierQ from '@/components/MDL08/MA0801/MA080101Q';
  import {
    purchaseOrder
  } from '@/assets/js/iFarmer/model/purchaseOrder.js';
  import {
    purchaseOrderItem
  } from '@/assets/js/iFarmer/model/purchaseOrderItem.js';
  import {
    getData
  } from '@/assets/js/iFarmer.v2/manager/genericManager';
  import {
    getItemUnitList
  } from '@/assets/js/iFarmer/manager/configManager';
  import {
    mixinERP
  } from '@/assets/js/iFarmer.v2/mixin/erpMixin';

  export default {
    mixins: [mixinERP],
    data: function () {
      return {
        timeOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() + 8.64e6;
          },
        },
        masterTab: 'first',
        serviceName: 'PurchaseOrderService',
        master: purchaseOrder(),
        masterName: 'PurchaseOrder',
        detail: purchaseOrderItem(),
        detailName: 'PurchaseOrderItem',
        functionName: '採購明細',
        detailList: [],
        selectedMasterRows: [],
        selectedDetailRows: [],
        transactionList: [],
        selectedSupplierRows: [],
        selectedPurchaseRequestItemRows: [],
        currencyOption: [],
        taxTypeOption: [],
        paymentTermOption: [],
        itemUnitOption: [],
        purchaseTypeOption: [],
        keys: ['ItemNo', 'ItemName', 'LotNo', 'UntaxedCurrPrice', 'Qty', 'UOM', 'UOMName',
          'Exrate', 'StockQty', 'StockUOM', 'StockUOMName', 'RequestDate', 'RequestEmpName'
        ],
        dlgQueryC: false,
        dlgDetail: false,
        dlgQuerySupplier: false,
        dlgQueryPurchaseRequest: false,
        switchUOM: true,
        loadingText: null,
        endDatePicker: this.processDate(),
        table: {
          head: [{
              title: '請購單號',
              data: 'RequestFormID'
            }, {
              title: '料件名稱',
              data: 'ItemName'
            },
            {
              title: '料件批號',
              data: 'LotNo'
            },
            {
              title: '採購數量',
              data: 'Qty'
            },
            {
              title: '採購單位',
              data: 'UOMName'
            },
            {
              title: '供應商報價單價',
              data: 'QuotePrice',
              isCurrency: true
            },
            {
              title: '未稅單價',
              data: 'UntaxedCurrPrice',
              isCurrency: true
            },
            {
              title: '含稅單價',
              data: 'TaxedCurrPrice',
              isCurrency: true
            },
            {
              title: '未稅金額',
              data: 'UntaxedCurrAmt',
              isCurrency: true
            },
            {
              title: '換算比率',
              data: 'ExchangeRate'
            },
            {
              title: '庫存異動量',
              data: 'StockQty'
            },
            {
              title: '庫存單位',
              data: 'StockUOMName'
            },
            {
              title: '已收貨數量',
              data: 'DeliveredQty'
            }
          ]
        },
        masterRules: {
          PurchaseDate: [{
            required: true,
            message: '請選擇採購日期',
            trigger: ['blur', 'change']
          }],
          PurchaseTypeCode: [{
            required: true,
            message: '請選擇採購類別',
            trigger: ['blur', 'change']
          }],
          PurchaseEmpNo: [{
            required: true,
            message: '請選擇採購人',
            trigger: ['blur', 'change']
          }],
          SupplierNo: [{
            required: true,
            message: '請選擇供應商',
            trigger: ['blur', 'change']
          }],
          RequiredDate: [{
            required: true,
            message: '請選擇需求日',
            trigger: ['blur', 'change']
          }],
          TaxCode: [{
            required: true,
            message: '請選擇稅別',
            trigger: ['blur', 'change']
          }],
          Exrate: [{
            required: true,
            message: '請輸入匯率',
            trigger: ['blur', 'change']
          }],
          TaxRate: [{
            required: true,
            message: '請輸入稅率',
            trigger: ['blur', 'change']
          }]
        },
        detailRules: {
          UOM: [{
              required: true,
              message: '請選擇單位別',
              trigger: ['blur', 'change']
            },
            {
              max: 5,
              message: '單位別不得大於5個字',
              trigger: ['blur', 'change']
            }
          ]
        }
      };
    },
    methods: {
      processDate() {
        return {
          disabledDate(time) {
            var nowDateTime = new Date();
            nowDateTime.setDate(nowDateTime.getDate() - 1);
            return time.getTime() < nowDateTime;
          }
        }
      },
      initMaster() {
        var vueInstance = this;
        vueInstance.$refs['master1'].resetFields();
        vueInstance.$refs['master2'].resetFields();
        vueInstance.masterTab = 'first';
        vueInstance.commandType = vueInstance.command.Create;
        vueInstance.pageReadOnly = false;

        vueInstance.master = purchaseOrder();
        vueInstance.$set(vueInstance.master, "CreatedUserID", vueInstance.loginAccount);
        vueInstance.$set(vueInstance.master, "RequestEmpName", vueInstance.loginEmpName);
        vueInstance.$set(vueInstance.master, "PurchaseEmpNo", vueInstance.loginEmpNo);
        vueInstance.$set(vueInstance.master, 'PurchaseDate', moment(new Date()).format('YYYY-MM-DD'));
        vueInstance.$set(vueInstance.master, 'CurrencyCode', 'RMB');
        vueInstance.$set(vueInstance.master, 'Exrate', 1);
        this.initDetail();

        this.detailList = [];
        this.transactionList = [];
        this.selectedDetailRows = [];
      },
      initDetail() {
        var vueInstance = this;
        vueInstance.detail = purchaseOrderItem();
      },
      setPurchaseRequestItem() {
        var vueInstance = this;
        if (vueInstance.selectedPurchaseRequestItemRows.length > 0) {
          let tmpTransList = [];

          vueInstance.selectedPurchaseRequestItemRows.forEach(function (ival, iidx, iarray) {
            var ele = purchaseOrderItem();
            vueInstance.keys.forEach(function (kval, kidx, karray) {
              ele[kval] = iarray[iidx][kval];
            });
            ele.TaxedCurrPrice = 0;
            ele.RequestFormID = iarray[iidx].FormID;
            ele.Qty = iarray[iidx].Qty - iarray[iidx].PurchaseQty;
            ele.LastQty = iarray[iidx].LastQty;
            ele.StockQty = ele.Qty;
            ele.StockUOM = ele.UOM;
            ele.StockUOMName = ele.UOMName;
            ele.ExchangeRate = 1;
            ele.RequestDeptCode = iarray[iidx].DeptCode;
            ele.DeliveredQty = 0;

            let tmp = $.grep(vueInstance.detailList, function (r) {
              return r.ItemNo === ele.ItemNo && r.RequestFormID == ele.RequestFormID;
            });
            if (tmp.length > 0) {
              return;
            }

            vueInstance.detailList.push(ele);

            vueInstance.doAmtCalc(vueInstance.master.Exrate, vueInstance.master.TaxRate, ele);

            let tmpPurchaseOrderItem = Object.assign({}, ele);
            tmpTransList.push(tmpPurchaseOrderItem);
          });
          tmpTransList.forEach(element => {
            element.CreatedUserID = vueInstance.loginAccount;
            vueInstance.addTransactionList(
              'PurchaseOrderItem',
              vueInstance.command.Create,
              element
            );
          });
          vueInstance.selectedPurchaseRequestItemRows = [];

        }
        vueInstance.dlgQueryPurchaseRequest = false;
      },
      setPurchaseOrder() {
        var vueInstance = this;
        if (vueInstance.selectedMasterRows.length > 0) {
          vueInstance.initMaster();
          vueInstance.master = Object.assign({},
            vueInstance.selectedMasterRows[0]
          );
          vueInstance.$set(vueInstance.master, "ModifiedUserID", vueInstance.loginAccount);

          vueInstance.commandType = vueInstance.command.Update

          vueInstance.selectedMasterRows = [];
          vueInstance.getPurchaseOrderDetail({
            FormID: vueInstance.master.FormID
          });
          vueInstance.$nextTick(function () {
            vueInstance.dlgQueryC = false;
          });
        }
      },
      getPurchaseOrderDetail(filter) {
        var vueInstance = this;
        vueInstance.initDetail();
        vueInstance.loadingText = '取得明細資料';
        getData('VPurchaseOrderItem', filter, function (response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.detailList = response;
            vueInstance.setOptionValue(vueInstance.detailList);
          } else {
            vueInstance.showAlert(false, '取得明細失敗');
            vueInstance.initDetail();
          }
        });
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          var detail = selectList[index];
          let tmpItemUnit = $.grep(this.itemUnitOption, function (r) {
            return r.UnitCode === detail.StockUOM;
          });
          if (tmpItemUnit.length > 0) {
            selectList[index]['StockUOMName'] = tmpItemUnit[0].Name;
          }
        }
      },
      setEmployee(item, obj) {
        this.$set(this.master, "PurchaseEmpNo", obj.EmpNo);
        this.$set(this.master, "CompCode", this.loginCompCode);
      },
      setItem(itemName, obj) {
        this.$set(this.detail, 'ItemNo', obj.ItemNo);
        this.$set(this.detail, "ItemName", obj.Name);
        this.$set(this.detail, 'UOM', obj.UOM);
        this.$set(this.detail, 'StockUOM', obj.UOM);
      },
      setSupplier() {
        var vueInstance = this;
        if (vueInstance.selectedSupplierRows.length > 0) {
          vueInstance.$set(vueInstance.master, "SupplierNo", vueInstance.selectedSupplierRows[0].SupplierNo);
          vueInstance.$set(vueInstance.master, "SupplierName", vueInstance.selectedSupplierRows[0].Name);
          vueInstance.selectedSupplierRows = [];
          vueInstance.dlgQuerySupplier = false;
        }
      },
      validateMaster(master) {
        var vueInstance = this;
        var isWarning = false;
        vueInstance.$refs['master1'].validate(valid => {
          if (valid) {
            vueInstance.$refs['master2'].validate(valid => {
              if (valid) {
                isWarning = false;
              } else {
                isWarning = true;
                vueInstance.masterTab = 'second';
              }
            });
          } else {
            isWarning = true;
            vueInstance.masterTab = 'first';
          }
        });

        if (isWarning) {
          return false;
        }

        if (vueInstance.detailList.length < 1) {
          vueInstance.showAlert(false, '請加入' + vueInstance.functionName);
          return false;
        }

        return true;
      },
      validateDetail(validObj) {
        var vueInstance = this;
        var isWarning = false;
        vueInstance.$refs['detail'].validate(valid => {
          if (valid) {
            isWarning = false;
          } else {
            isWarning = true;
          }
        });

        if (isWarning) {
          return false;
        }

        if (validObj.Qty > validObj.LastQty) {
          vueInstance.showAlert(false, '已買數量超過請購數量');
          return false;
        }
        return true;
      },
      deletePurchaseOrderItem() {
        var vueInstance = this;
        vueInstance.selectedDetailRows = [vueInstance.detail];
        vueInstance.deleteDetail();
      },
      setUOMName(UOMCode) {
        var vueInstance = this;
        let tempUOM = [];
        tempUOM = vueInstance.itemUnitOption.forEach(function (element) {

          if (element.UnitCode == UOMCode) {
            vueInstance.$set(vueInstance.detail, 'UOMName', element.Name);
          }
        });
      },
      getItemUnit() {
        var vueInstance = this;
        var filter = {};
        vueInstance.$set(filter, 'Status', vueInstance.statusCode.Active);
        getItemUnitList(filter, function (response) {
          if (response.IsSuccess) {
            vueInstance.itemUnitOption = response.Data;
          }
        });
      },
    },
    watch: {
      'master.PurchaseTypeCode'() {
        this.detailList = [];
        this.transactionList = [];
        this.selectedDetailRows = [];
      },
      'detail.UOM': {
        handler() {
          this.setUOMName(this.detail.UOM);
          if (this.detail.UOM == this.detail.StockUOM) {
            this.detail.ExchangeRate = 1;
          }
        },
        immediate: true,
      },
      'detail.ItemNo': {
        handler() {
          if (this.detail.ItemNo == undefined || this.detail.ItemNo == null) {
            this.switchUOM = true;
          } else {
            this.switchUOM = false;
          }
        },
        immediate: true,
      }
    },
    computed: {
      ItemStockQty() {
        this.detail.StockQty = (parseFloat(this.detail.Qty) * parseFloat(this.detail.ExchangeRate)).toFixed(4);
        return this.detail.StockQty;
      }
    },
    mounted() {
      var vueInstance = this;
      this.getCurrency();
      this.getTaxType();
      this.getItemUnit({});
      this.getPurchaseType({
        Status: this.statusCode.Active
      });
      this.getPaymentTerm();
      this.initMaster();

      if (vueInstance.historyID != null) {
        getData('VPurchaseOrder', {
          FormID: vueInstance.historyID
        }, function (response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.selectedMasterRows = response;
            vueInstance.setPurchaseOrder();
          }
        });
      }
    },
    components: {
      'employeeInput': EmployeeInput,
      'queryPurchaseOrder': PurchaseOrderQ,
      'queryHistoryComponent': PurchaseRequestItemQ,
      'querySupplier': SupplierQ,
      'actionComponent': FormAction,
      'data-table': datatable,
      'ItemInput': ItemInput
    }
  };

</script>
