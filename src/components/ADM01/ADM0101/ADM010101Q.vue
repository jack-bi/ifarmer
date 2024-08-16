<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">公司資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司代碼">
                    <el-input class="textInput" placeholder="請輸入代碼" v-model="company.CompCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司名稱">
                    <el-input class="textInput" placeholder="請輸入名稱" v-model="company.Name" clearable>
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
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="companyList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dlgFullfilter" width="80%" :close-on-click-modal="false" append-to-body>
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-4" style="margin: 4px 0;">公司資料進階查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司碼">
                    <el-input class="textInput" placeholder="請輸入公司碼" v-model="company.CompCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司名稱">
                    <el-input class="textInput" placeholder="請輸入公司名稱" v-model="company.Name" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="公司縮寫">
                    <el-input class="textInput" placeholder="請輸入公司縮寫" v-model="company.Abbreviation" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="管理人">
                    <el-input class="textInput" placeholder="請輸入管理人" v-model="company.Manager" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="電子郵件">
                    <el-input class="textInput" placeholder="請輸入電子郵件" v-model="company.Email" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="郵遞區域">
                    <el-input class="textInput" placeholder="請輸入郵遞區域" v-model="company.PostalCode" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="地址">
                    <el-input class="textInput" placeholder="請輸入地址" v-model="company.Address" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="傳真">
                    <el-input class="textInput" placeholder="請輸入傳真" v-model="company.Fax" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="電話1">
                    <el-input class="textInput" placeholder="請輸入電話1" v-model="company.Phone1" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="電話2">
                    <el-input class="textInput" placeholder="請輸入電話2" v-model="company.Phone2" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="網址">
                    <el-input class="textInput" placeholder="請輸入網址" v-model="company.Url" clearable>
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
    getEmployeeList,
    getCompanyList
  } from '@/assets/js/iFarmer/manager/OrganizationManager';
  import { getStatus } from '@/assets/js/iFarmer/library/optionLib';
  import { company } from '@/assets/js/iFarmer/model/company.js';

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
        loadingText: null,
        companyList: [],
        employeeOption: [],
        selectedRows: [],
        company: company(),
        selectType: this.returnType == 'Single' ? this.returnType : 'multiple',
        statusOptions: getStatus(),
        table: {
          head: [
            {
              title: '公司碼',
              data: 'CompCode'
            },
            {
              title: '公司名稱',
              data: 'Name'
            },
            {
              title: '公司縮寫',
              data: 'Abbreviation'
            },
            {
              title: '管理人',
              data: 'Manager'
            },
            {
              title: '公司狀態',
              data: 'Status'
            },
            {
              title: '電子郵件',
              data: 'Email'
            },
            {
              title: '郵遞區域',
              data: 'PostalCode'
            },
            {
              title: '傳真',
              data: 'Fax'
            },
            {
              title: '電話1',
              data: 'Phone1'
            },
            {
              title: '電話2',
              data: 'Phone2'
            },
            {
              title: '地址',
              data: 'Address'
            },
            {
              title: '網址',
              data: 'Url'
            }
          ]
        }
      };
    },
    methods: {
      getCompany(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getCompanyList(filter, function(response) {
          vueInstance.loadingText = null;
          if (response.IsSuccess) {
            vueInstance.companyList = response.Data;
            vueInstance.setOptionValue(vueInstance.companyList);
          }
        });
      },
      getEmployee() {
        var vueInstance = this;
        getEmployeeList({}, function(response) {
          if (response.IsSuccess) {
            vueInstance.employeeOption = response.Data;
          }
        });
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.company.CompCode != '')
          vueInstance.$set(filter, 'compCode', vueInstance.company.CompCode);
        if (vueInstance.company.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.company.Name);

        vueInstance.$set(filter, 'status', vueInstance.company.Status);
        vueInstance.getCompany(filter);
      },
      fullFilter() {
        let filter = {};
        var vueInstance = this;
        if (vueInstance.company.CompCode != '')
          vueInstance.$set(filter, 'compCode', vueInstance.company.CompCode);
        if (vueInstance.company.Name != '')
          vueInstance.$set(filter, 'name', vueInstance.company.Name);
        if (vueInstance.company.Abbreviation != '')
          vueInstance.$set(
            filter,
            'Abbreviation',
            vueInstance.company.Abbreviation
          );
        if (vueInstance.company.Manager != '')
          vueInstance.$set(filter, 'Manager', vueInstance.company.Manager);
        if (vueInstance.company.Email != '')
          vueInstance.$set(filter, 'Email', vueInstance.company.Email);
        if (vueInstance.company.PostalCode != '')
          vueInstance.$set(filter, 'PostalCode', vueInstance.company.PostalCode);
        if (vueInstance.company.Address != '')
          vueInstance.$set(filter, 'Address', vueInstance.company.Address);
        if (vueInstance.company.Fax != '')
          vueInstance.$set(filter, 'Fax', vueInstance.company.Fax);
        if (vueInstance.company.Phone1 != '')
          vueInstance.$set(filter, 'Phone1', vueInstance.company.Phone1);
        if (vueInstance.company.Phone2 != '')
          vueInstance.$set(filter, 'Phone2', vueInstance.company.Phone2);
        if (vueInstance.company.Url != '')
          vueInstance.$set(filter, 'Url', vueInstance.company.Url);

        vueInstance.$set(filter, 'status', vueInstance.company.Status);
        vueInstance.getCompany(filter);
        vueInstance.dlgFullfilter = false;
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          selectList[index]['StatusLabel'] =
            selectList[index].Status == 0 ? '停用' : '啓用';
        }
      },
      returnSelectValue() {
        var vueInstance = this;
        if (vueInstance.selectedRows.length > 0) {
          vueInstance.setOptionValue(vueInstance.selectedRows);
          vueInstance.$emit('selectList', vueInstance.selectedRows);
          vueInstance.companyList = [];
          vueInstance.selectedRows = [];
        }
      },
      querySelected(command) {
        var vueInstance = this;
        if (command == -1) {
          vueInstance.dlgFullfilter = true;
        } else {
          vueInstance.company.Status = command;
        }
      }
    },
    mounted() {
      this.getEmployee();
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.companyList = [];
          this.company = company();
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
