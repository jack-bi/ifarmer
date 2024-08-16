<template>
  <div v-show="status !== statusCode.InActive">
    <loadingPage :loadingText="loadingText"></loadingPage>
    <div v-show="this.historyID == null">
    <el-button type="warning" size="small" @click="deleteHistory"
      v-show="approveStatus == approveStatusCode.Pending || approveStatus == approveStatusCode.Reject">删　除</el-button>
    <el-button type="buttonApply" size="small" @click="apply"
      v-show="approveStatus == approveStatusCode.Pending || approveStatus == approveStatusCode.Reject">
      送　审</el-button>
    <el-button type="buttonSave" size="small" @click="save"
      v-show="approveStatus == undefined || approveStatus == approveStatusCode.Pending || approveStatus == approveStatusCode.Reject">
      暫　存</el-button>
    </div>
    <div v-show="this.historyID != null">
      <el-button type="buttonReject" size="small" @click="reject" v-show="approveStatus == approveStatusCode.Apply ">退　件
      </el-button>
      <el-button type="buttonApprove" size="small" @click="approve" v-show="approveStatus == approveStatusCode.Apply ">
        签　核</el-button>
      <el-button type="warning" size="small" @click="invalid"
        v-show="approveStatus == approveStatusCode.Approve  &&  approveStatus == approveStatusCode.Apply">作　废
      </el-button>
    </div>

    <el-dialog title="提示" :visible.sync="warnVisible" width="30%" append-to-body>
      <span>确定要删除资料?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="buttonSave" @click="doCancel">取　消</el-button>
        <el-button type="warning" @click="doAction">确　定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import LoadingPage from '@/components/Control/LoadingPage';
  import {
    activateStatus
  } from '@/assets/js/iFarmer.v2/enum/activateStatus.js';
  import {
    approveStatusCode
  } from '@/assets/js/iFarmer.v2/code/approveStatusCode.js';
  export default {
    props: {
      loadingText: {
        type: String,
        default: null
      },
      status: {
        type: Number,
        default: undefined
      },
      approveStatus: {
        type: String,
        default: undefined
      },
    },
    data: function () {
      return {
        fullscreenLoading: false,
        warnVisible: false,
        statusCode: activateStatus,
        approveStatusCode: approveStatusCode(),
        userProfile: this.$store.getters.userProfile,
      };
    },
    methods: {
      save() {
        this.$emit('saveEvent');
      },
      apply() {
        this.$emit('applyEvent');
      },
      reject() {
        this.$emit('rejectEvent');
      },
      approve() {
        this.$emit('approveEvent');
      },
      invalid() {
        this.$emit('invalidEvent');
      },
      deleteHistory() {
        this.warnVisible = true;
      },
      doAction() {
        this.warnVisible = false;
        this.$emit('deleteEvent');
      },
      doCancel() {
        this.warnVisible = false;
      }
    },
    components: {
      'loadingPage': LoadingPage
    }
  };

</script>
