<template>
  <div>
    <el-form-item label="表单状态">
      <el-select v-model="status" multiple placeholder="请选择表单状态" clearable>
        <el-option v-for="option in filterStatusOptions" :key="option.value" :label="option.label" :value="option.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
  import {
    approveStatusCode
  } from '@/assets/js/iFarmer.v2/code/approveStatusCode.js';
  import {
    getERPStatus
  } from '@/assets/js/iFarmer.v2/library/optionLib';

  export default {
    model: {
      prop: "selectedStatus",
      event: "change"
    },
    props: {
      reSetting: {
        type: Boolean,
        default: function () {
          return false;
        }
      },
      statusCode: {
        type: Object,
        default: function () {
          return approveStatusCode();
        }
      },
      statusOptions: {
        type: Array,
        default: function () {
          return getERPStatus();
        }
      },
      statusCondition: {
        type: Array,
        default: function () {
          return [];
        }
      },
      defaultValue: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data: function () {
      return {
        status: [3],
      };
    },
    mounted: function () {
      this.status = this.statusCondition.length > 0 ? this.statusCondition : [3];
    },
    watch: {
      defaultValue() {
        this.status = this.defaultValue;
      },
      status() {
        if (this.statusCondition.length > 0 && this.status.length <= 0) {
          this.showAlert(false, '至少需選擇一項');
          this.status = this.statusCondition;
        }
        this.$emit("change", this.status);
      },
      reSetting: function () {
        if (this.reSetting) {
          var status = this.statusCondition.length > 0 ? this.statusCondition : [3];
          this.$emit("change", status);
        }
      },
      statusCondition: {
        immediate: true,
        handler() {
          var status = this.statusCondition.length > 0 ? this.statusCondition : [3];
          this.$emit("change", status);
        }
      }
    },
    computed: {
      filterStatusOptions() {
        var vueInstance = this;
        if (vueInstance.statusCondition.length == 0)
          return vueInstance.statusOptions;
        else
          return vueInstance.statusOptions.filter(function (item) {
            return vueInstance.statusCondition.indexOf(item.value) != -1
          });
      }
    }
  };

</script>
