<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">使用者資料查詢</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <el-form>
              <div class="row">
                <div class="col-md-6 queryBlock">
                  <el-form-item label="帳號">
                    <el-input class="textInput" placeholder="請輸入使用者帳號" v-model="user.AccountNo" clearable>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col-md-6 queryBlock">
                  <el-form-item label="語係">
                    <el-input class="textInput" placeholder="請輸入語係" v-model="user.Culture" clearable>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="col-md-4" style="text-align: right;">
            <el-button type="primary" @click="simpleFilter"><i class="el-icon-search">&nbsp;</i>查詢</el-button>
            <slot name="actionBtn"></slot>
          </div>
          <div class="col-md-12  pt-2">
            <data-table v-if="table !== null" v-model="selectedRows" :selectionMode="selectType" :columns="table.head" :data="userList" :orderIndex=1 :orderBy="'desc'"></data-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import { getStatus } from '@/assets/js/iFarmer/library/optionLib';
  import { userAccount } from '@/assets/js/iFarmer/model/userAccount.js';

  import { getUserAccountList } from '@/assets/js/iFarmer/manager/authManager';

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
        userList: [],
        selectedRows: [],
        loadingText: null,
        user: userAccount(),
        selectType: this.returnType != undefined ? this.returnType : 'multiple',
        statusOptions: getStatus(),
        table: {
          head: [
            {
              title: '使用者帳號',
              data: 'AccountNo'
            },
            {
              title: '語係',
              data: 'Culture'
            },
            {
              title: '使用者狀態',
              data: 'StatusLabel'
            }
          ]
        }
      };
    },
    methods: {
      getUserList(filter) {
        var vueInstance = this;
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        if (vueInstance.queryList === undefined) {
          getUserAccountList(filter, function(response) {
            vueInstance.loadingText = null;
            if (response.IsSuccess) {
              vueInstance.userList = response.Data;
              vueInstance.setOptionValue(vueInstance.userList);
            }
          });
        }
      },
      simpleFilter() {
        var vueInstance = this;
        let filter = {};
        if (vueInstance.user.AccountNo != '')
          vueInstance.$set(filter, 'accountNo', vueInstance.user.AccountNo);
        if (vueInstance.user.Culture != '')
          vueInstance.$set(filter, 'culture', vueInstance.user.Culture);

        vueInstance.$set(filter, 'status', vueInstance.user.Status);
        vueInstance.getUserList(filter);
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
          vueInstance.selectedRows = [];
          vueInstance.userList = [];
        }
      },
      querySelected(command) {
        var vueInstance = this;
        vueInstance.user.Status = parseInt(command);
      }
    },
    watch: {
      reloading: function() {
        if (this.reloading) {
          this.userList = [];
          this.user = userAccount();
          this.$emit('change', []);
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
