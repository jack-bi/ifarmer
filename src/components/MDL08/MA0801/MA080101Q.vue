<template>
  <div class="row">
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">供貨商資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="供貨商名稱">
                    <el-input v-model="querySupplier.Name" placeholder="請輸入供貨商名稱" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="供貨商簡稱">
                    <el-input placeholder="請輸入供貨商簡稱" v-model="querySupplier.DisplayText" clearable>
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
          <div class="col-md-12 pt-2">
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head"
              :data="supplierList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">供貨商資料維護進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="供貨商名稱">
                    <el-input v-model="querySupplier.Name" placeholder="請輸入供貨商名稱" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="供貨商簡稱">
                    <el-input placeholder="請輸入供貨商簡稱" v-model="querySupplier.DisplayText" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="城市">
                    <el-input v-model="querySupplier.CityName" placeholder="請選擇城市" clearable>
                      <el-button slot="append" icon="el-icon-search" @click="dlgQueryCity = true"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="産業名稱">
                    <el-select v-model="querySupplier.IndustryCode" placeholder="請選擇産業名稱" clearable>
                      <el-option v-for="item in industryList" :key="item.IndustryCode" :label="item.Name" :value="item.IndustryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="國別">
                    <el-select v-model="querySupplier.CountryCode" placeholder="請選擇國別" clearable>
                      <el-option v-for="item in countryList" :key="item.CountryCode" :label="item.Name" :value="item.CountryCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>


                <div class="col-md-6 queryBlock">
                  <el-form-item label="郵遞區域">
                    <el-input v-model="querySupplier.PostalCode" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="地址">
                    <el-input v-model="querySupplier.Street" clearable></el-input>
                  </el-form-item>
                </div>

                <div class="col-md-6 queryBlock">
                  <el-form-item label="代錶人">
                    <el-input v-model="querySupplier.Representative" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="註冊編號">
                    <el-input v-model="querySupplier.RegistrationNo" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="聯絡人">
                    <el-input v-model="querySupplier.Contact" clearable></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div class="col-md-4" style="text-align: right;">
          <el-button type="primary" @click="fullFilter()">查詢</el-button>
        </div>
      </el-card>
    </el-dialog>

    <!-- City 查詢 -->
    <el-dialog :visible.sync="dlgQueryCity" width="80%" :close-on-click-modal="false" append-to-body>
      <queryCity :reloading="dlgQueryCity" :returnType="'Single'" v-model="selectedCityRows">
        <el-button slot="actionBtn" type="primary" @click="setCity">
          <i class="el-icon-back">&nbsp;</i>帶入
        </el-button>
      </queryCity>
    </el-dialog>

  </div>
</template>
<script>
  import datatable from "@/components/Control/DataTable";
  import CityQ from '@/components/ADM01/ADM0101/ADM010110Q';
  import {
    getSupplierList,
    getCityList,

    getCountryList,
    getIndustryList,
    getBusinessTypeList,
    getPaymentTermList
  } from "@/assets/js/iFarmer/manager/basicManager";
  import {
    getSiteList
  } from '@/assets/js/iFarmer/manager/locationManager';
  import {
    supplier
  } from '@/assets/js/iFarmer/model/supplier.js'
  import {
    getCompanyList
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
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
          return "single";
        }
      },

    },
    data: function () {
      return {
        dlgFullfilter: false,
        dlgQueryCity: false,
        selectedRows: [],
        selectedCityRows: [],
        supplierList: [],
        companyList: [],
        countryList: [],
        cityList: [],
        industryList: [],
        businessTypeList: [],
        SiteList: [],
        paymentTermList: [],
        selectType: (this.returnType == "Single") ? this.returnType : "multiple",
        querySupplier: supplier(),

        table: {
          head: [{
              title: "供貨商名稱",
              data: "Name"
            },
            {
              title: "供貨商簡稱",
              data: "DisplayText"
            },
            {
              title: "電話 1",
              data: "Phone1"
            },
            {
              title: "傳真",
              data: "Fax"
            },
            {
              title: "電話 2",
              data: "Phone2"
            },
            {
              title: "城市",
              data: "CityName"
            },
            {
              title: "地址",
              data: "Street"
            },
            {
              title: "國別",
              data: "CountryName"
            },
            {
              title: "産業名稱",
              data: "IndustryName"
            },
            {
              title: "代錶人",
              data: "Representative"
            },
            {
              title: "註冊編號",
              data: "RegistrationNo"
            },
            {
              title: "稅籍編號",
              data: "TaxNo"
            },
            {
              title: "信用編號",
              data: "CreditNo"
            },
            {
              title: "業務型態",
              data: "BusinessType"
            },
            {
              title: "配合工廠的場",
              data: "LocationCode"
            },
            {
              title: "銀行碼",
              data: "BankCode"
            },
            {
              title: "銀行名稱",
              data: "BankName"
            },
            {
              title: "公司資質",
              data: "Quality"
            },
            {
              title: "付款條件",
              data: "PaymentTerm"
            },
            {
              title: "信用額度",
              data: "CreditLimit"
            },
            {
              title: "供貨商資料說明",
              data: "Remark"
            }
          ]
        },
      };
    },
    methods: {
      getSupplier(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = "資料搜尋中";
        getSupplierList(filter, function (response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.supplierList = response.Data;
            vueInstance.setOptionValue(vueInstance.supplierList);
          }
        });
      },

      setCity() {
        var vueInstance = this;
        if (vueInstance.selectedCityRows.length > 0) {
          vueInstance.querySupplier.CityCode =
            vueInstance.selectedCityRows[0].CityCode;
          vueInstance.querySupplier.CityName =
            vueInstance.selectedCityRows[0].Name;
          vueInstance.selectedCityRows = [];
          vueInstance.dlgQueryCity = false;
        }
      },
      getCompany(filter) {
        var vueInstance = this;
        getCompanyList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.companyList = response.Data;
          }
        });
      },
      getCountry(filter) {
        var vueInstance = this;
        getCountryList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.countryList = response.Data;
          }
        });
      },
      getCity(filter) {
        var vueInstance = this;
        getCityList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.cityList = response.Data;
            vueInstance.setOptionValue(vueInstance.cityList);
          }
        });
      },
      getIndustry(filter) {
        var vueInstance = this;
        getIndustryList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.industryList = response.Data;
          }
        });
      },
      getBusinessType(filter) {
        var vueInstance = this;
        getBusinessTypeList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.businessTypeList = response.Data;
          }
        });
      },
      getSite(filter) {
        var vueInstance = this;
        getSiteList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.SiteList = response.Data;
          }
        });
      },
      getPaymentTerm(filter) {
        var vueInstance = this;
        getPaymentTermList({}, function (response) {
          if (response.IsSuccess) {
            vueInstance.paymentTermList = response.Data;
          }
        });
      },

      setOptionValue(selectList) {
        var vueInstance = this;
        for (var index = 0; index < selectList.length; index++) {

          let country = $.grep(vueInstance.countryList, function(r) {
            return r.CountryCode == selectList[index].CountryCode;
          });
          if (country.length > 0)
            selectList[index]['CountryName'] = country[0].Name;
          else selectList[index]['CountryName'] = '';

          let city = $.grep(vueInstance.cityList, function (r) {
            return r.CityCode == selectList[index].CityCode;
          });
          if (city.length > 0)
            selectList[index]['CityName'] = city[0].Name;
          else selectList[index]['CityName'] = '';

          let industry = $.grep(vueInstance.industryList, function (r) {
            return r.IndustryCode == selectList[index].IndustryCode;
          });
          if (industry.length > 0)
            selectList[index]['IndustryName'] = industry[0].Name;
          else selectList[index]['IndustryName'] = '';

          let paymentTerm = $.grep(vueInstance.paymentTermList, function (r) {
            return r.PaymentCode == selectList[index].PaymentCode;
          });
          if (paymentTerm.length > 0)
            selectList[index]['PaymentTerm'] = paymentTerm[0].Name;
          else selectList[index]['PaymentTerm'] = '';

          let businessType = $.grep(vueInstance.businessTypeList, function (r) {
            return r.BusinessTypeCode == selectList[index].BusinessTypeCode;
          });
          if (businessType.length > 0)
            selectList[index]['BusinessType'] = businessType[0].Name;
          else selectList[index]['BusinessType'] = '';
        }
      },

      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.querySupplier.Name != "")
          vueInstance.$set(filter, 'name', vueInstance.querySupplier.Name);
        if (vueInstance.querySupplier.DisplayText != "")
          vueInstance.$set(filter, 'displayText', vueInstance.querySupplier.DisplayText);

        vueInstance.$set(filter, 'status', vueInstance.querySupplier.Status);
        vueInstance.getSupplier(filter);
      },
      fullFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.querySupplier.CountryCode != "")
          vueInstance.$set(filter, 'countryCode', vueInstance.querySupplier.CountryCode);
        if (vueInstance.querySupplier.Name != "")
          vueInstance.$set(filter, 'name', vueInstance.querySupplier.Name);
        if (vueInstance.querySupplier.DisplayText != "")
          vueInstance.$set(filter, 'displayText', vueInstance.querySupplier.DisplayText);
        if (vueInstance.querySupplier.CityCode != "")
          vueInstance.$set(filter, 'cityCode', vueInstance.querySupplier.CityCode);
        if (vueInstance.querySupplier.PostalCode != "")
          vueInstance.$set(filter, 'postalCode', vueInstance.querySupplier.PostalCode);
        if (vueInstance.querySupplier.Street != "")
          vueInstance.$set(filter, 'street', vueInstance.querySupplier.Street);
        if (vueInstance.querySupplier.IndustryCode != "")
          vueInstance.$set(filter, 'industryCode', vueInstance.querySupplier.IndustryCode);
        if (vueInstance.querySupplier.Representative != "")
          vueInstance.$set(filter, 'representative', vueInstance.querySupplier.Representative);
        if (vueInstance.querySupplier.RegistrationNo != "")
          vueInstance.$set(filter, 'registrationNo', vueInstance.querySupplier.RegistrationNo);
        if (vueInstance.querySupplier.Contact != "")
          vueInstance.$set(filter, 'contact', vueInstance.querySupplier.Contact);

        vueInstance.$set(filter, 'status', vueInstance.querySupplier.Status);
        vueInstance.getSupplier(filter);
        vueInstance.dlgFullfilter = false;
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.querySupplier.Status = command;
        }
      },
    },
    watch: {
      reloading: function () {
        if (this.reloading) {
          this.supplierList = [];
          this.$emit('change', []);
          this.querySupplier = supplier();
          this.dlgFullfilter = false;
        }
      },
      selectedRows: function () {
        var vueInstance = this;
        let returnList = [];
        vueInstance.selectedRows.forEach(element => {
          let tmpObj = jQuery.extend(true, {}, element);
          delete tmpObj.CountryName;
          // delete tmpObj.CityName;
          delete tmpObj.IndustryName;
          // delete tmpObj.PaymentTerm;
          // delete tmpObj.BusinessType;
          returnList.push(tmpObj);
        });
        this.$emit('change', returnList);
      },
    },
    mounted() {
      this.getCity();
      this.getCountry();
      this.getCompany();
      this.getIndustry();
      this.getBusinessType();
      this.getSite();
      this.getPaymentTerm();
    },
    components: {
      "data-table": datatable,
      'queryCity': CityQ
    }
  };

</script>
