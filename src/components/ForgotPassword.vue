<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card mx-4">
            <div class="card-body p-4">
              <h1>变更密码</h1>
              <p class="text-muted">请输入您原密码以进行变更</p>
              <div class="input-group mb-3">
                <el-input size="medium" placeholder="请输入您的使用者帐号" v-model="userID" @keyup.enter.native="detectKeyup">
                  <template slot="prepend">
                    <i class="icon-lock"></i>
                  </template>
                </el-input>
              </div>
              <div class="input-group mb-3">
                <el-input size="medium" placeholder="请输入您现有的密码" v-model="oldPwd" type="password" @keyup.enter.native="detectKeyup">
                  <template slot="prepend">
                    <i class="icon-lock"></i>
                  </template>
                </el-input>
              </div>
              <div class="input-group mb-3">
                <el-input size="medium" placeholder="请输入您欲变更的新密码" v-model="newPwd" type="password" @keyup.enter.native="detectKeyup">
                  <template slot="prepend">
                    <i class="icon-lock"></i>
                  </template>
                </el-input>
              </div>
              <div class="input-group mb-4">
                <el-input size="medium" placeholder="请再次输入您欲变更的新密码" v-model="newPwdConfirmed" type="password"
                  @keyup.enter.native="detectKeyup">
                  <template slot="prepend">
                    <i class="icon-lock"></i>
                  </template>
                </el-input>
              </div>
              <el-button type="primary" size="medium" style="width: 100%;" @click="resetPwd">变更密码</el-button>
              <div class="mb-3"></div>
              <el-button size="medium" style="width: 100%;" @click="cancel">返回</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    changePassword
  } from "@/assets/js/iFarmer/manager/authManager";

  export default {
    data() {
      return {
        userID: "",
        oldPwd: "",
        newPwd: "",
        newPwdConfirmed: ""
      };
    },
    methods: {
      resetPwd: function () {
        if (!this.userID) {
          this.$notify.error({
            title: "变更错误",
            message: "请输入使用者帐号"
          });

          this.oldPwd = this.newPwd = this.newPwdConfirmed = "";
          return;
        }

        if (!this.oldPwd) {
          this.$notify.error({
            title: "变更错误",
            message: "请输入旧密码"
          });

          this.oldPwd = this.newPwd = this.newPwdConfirmed = "";
          return;
        }
        if (!this.newPwd) {
          this.$notify.error({
            title: "变更错误",
            message: "欲变更密码不得为空"
          });

          this.oldPwd = this.newPwd = this.newPwdConfirmed = "";
          return;
        }
        if (this.newPwd !== this.newPwdConfirmed) {
          this.$notify.error({
            title: "变更错误",
            message: "欲变更密码不一致, 请重新输入"
          });

          this.oldPwd = this.newPwd = this.newPwdConfirmed = "";
          return;
        }

        let vueInstance = this;

        changePassword(this.userID, this.oldPwd, this.newPwd, function (result) {
          if (result === true) {
            vueInstance.$notify.success({
              title: "变更成功",
              message: "密码变更成功, 请使用新密码进行登入"
            });
            vueInstance.$router.push({
              name: "Login"
            });
          } else {
            vueInstance.$notify.error({
              title: "变更错误",
              message: "密码变更失败, 请重新尝试"
            });

            vueInstance.oldPwd = vueInstance.newPwd = vueInstance.newPwdConfirmed =
              "";
          }
        });
      },
      detectKeyup: function () {
        this.resetPwd();
      },
      cancel: function () {
        this.$router.push({
          name: "Login"
        });
      }
    }
  };

</script>

<style>

</style>
