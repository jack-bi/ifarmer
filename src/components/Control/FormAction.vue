<template>
  <div>
    <loadingPage :loadingText="loadingText"></loadingPage>

    <el-button type="warning" size="small" @click="deleteHistory" v-show="showDelete">删　除</el-button>
    <el-button type="buttonSave" size="small" @click="save" v-show="showSave">储　存</el-button>

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
  export default {
    props: {
      loadingText: {
        type: String,
        default: null
      },
      showDelete: {
        type: Boolean,
        default: true
      },
      showSave: {
        type: Boolean,
        default: true
      }
    },
    data: function() {
      return {
        fullscreenLoading: false,
        warnVisible: false
      };
    },
    methods: {
      save() {
        this.$emit('saveEvent');
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
