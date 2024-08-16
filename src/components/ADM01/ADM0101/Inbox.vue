<template>
  <div class="row">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div class="col-padding col-md-12">
      <el-card>
        <div slot="header">
          <div class="row">
            <div class="col-12" style="margin: 4px 0;">收件匣</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12  pt-2">
            <data-table v-if="table !== null" v-model="selectedRows" @returnLinkData="routePage"
              linkColumn="SourceFormID" :columns="table.head" :data="inboxList" :orderIndex=1 :orderBy="'asc'"
              :isReadOnly="true"></data-table>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog id="iframe_dialog" class="inbox-container" :visible.sync="dlgQuery" width="80%"
      :close-on-click-modal="false" append-to-body>
      <iframe :src="url" height="100%" width="100%" @load="onIframeLoad"></iframe>
    </el-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import LoadingPage from '@/components/Control/LoadingPage';
  import datatable from '@/components/Control/DataTable';
  import {
    getData
  } from '@/assets/js/iFarmer.v2/manager/genericManager';
  import {
    inbox
  } from '@/assets/js/iFarmer/model/inbox.js';

  export default {
    data: function () {
      return {
        timeOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        loadingText: null,
        inbox: inbox(),
        loginAccount: this.$store.getters.userProfile.AccountNo,
        inboxList: [],
        selectedRows: [],
        dlgQuery: false,
        isReloading: false,
        url: "../#/",
        table: {
          head: [ {
            title: '作業單號',
            data: 'SourceFormID'
          },{
            title: '作業名稱',
            data: 'FunctionName'
          },{
            title: '主旨',
            data: 'Subject'
          }, {
            title: '寄件人',
            data: 'MessageFromName'
          }, {
            title: '寄件日期',
            data: 'CreatedDatetimeName'
          },  ]
        }
      };
    },
    methods: {
      routePage(data) {
        this.url = "../#/ApprovalPage/" + data["MessageURL"] + "/?HistoryFormID=" + data["SourceFormID"];
        this.dlgQuery = true;
      },
      setOptionValue(selectList) {
        for (var index = 0; index < selectList.length; index++) {
          if (
            $.datepicker.formatDate(
              'yy-mm-dd',
              new Date(selectList[index]['CreatedDatetime'])
            ) == '1970-01-01'
          )
            selectList[index]['CreatedDatetimeName'] = null;
          else {
            selectList[index]['CreatedDatetimeName'] = moment(
              selectList[index].CreatedDatetime
            ).format('YYYY-MM-DD');
          }
        }
      },
      getInboxHistory() {
        var vueInstance = this;
        var filter = {
          MessageTo: this.loginAccount,
          status: 1,
          ApproveStatus: 'F'
        };
        vueInstance.selectedRows = [];
        vueInstance.loadingText = '資料搜尋中';
        getData('VInbox', filter, function (response) {
          vueInstance.loadingText = null;
          if (response) {
            vueInstance.inboxList = response;
            vueInstance.setOptionValue(vueInstance.inboxList);
          }
        });
      },
      onIframeLoad() {
        if (!this.isReloading)
          this.isReloading = true;
        else
          this.dlgQuery = false;
      }
    },
    mounted() {
      this.getInboxHistory();
    },
    watch: {
      dlgQuery() {
        if (!this.dlgQuery) {
          this.getInboxHistory();
          this.isReloading = false;
        }
      }
    },
    components: {
      'loadingPage': LoadingPage,
      'data-table': datatable
    }
  };

</script>

<style>
  .inbox-container .el-dialog {
    height: 90% !important;
    margin-top: 5vh !important;
  }

  .inbox-container .el-dialog__body {
    height: 95% !important;
  }

</style>
