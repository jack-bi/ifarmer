<template>
  <div>
    <header class="app-header navbar">
      <button class="navbar-toggler mobile-sidebar-toggler d-lg-none mr-auto" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">iFarmer</a>
      <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>

      <ul class="nav navbar-nav ml-auto">
        <!-- <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'Inbox'}">
            <img src="./../../static/coreUI/img/avatars/siteMapIcon.png" class="img-avatar" alt="admin@bootstrapmaster.com">
          </router-link>
        </li> -->
        <li class="nav-item d-md-down-none" style="cursor: pointer">
          <el-dropdown trigger="click" @command="notificationCommand">
            <el-badge :value="notificationCount" style="margin-top: 5px;">
              <i class="fa fa-bell" style="color: #FFFFFF; font-size: 22px; margin-top: 5px;"></i>
            </el-badge>

            <el-dropdown-menu class="topDropDown" slot="dropdown" style="width: 300px;">

              <el-dropdown-item v-for="notification in notificationCollection" :key="notification.ID" v-show="notificationCount > 0"
                :command="notification" divided>

                <div class="noticeIcon">
                  <i class="icon-envelope"></i>
                </div>

                <div class="noticeTitle">
                  {{notification.Title}}
                </div>

                <div class="noticeDate">
                  {{notification.InformDatetime}}
                </div>
              </el-dropdown-item>

              <el-dropdown-item divided :command=null>
                <div class="noticeMore">
                  更多...
                </div>
              </el-dropdown-item>

            </el-dropdown-menu>

          </el-dropdown>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <img src="./../../static/coreUI/img/avatars/iFarmerAvatar.png" class="img-avatar" alt="admin@bootstrapmaster.com">
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-header text-center">
              <strong>設定</strong>
            </div>
            <a class="dropdown-item" href="javascript:;" @click="dlgProfileVisible = true">
              <i class="fa fa-user"></i> 使用者資訊</a>
            <a class="dropdown-item" href="javascript:;" @click="logout">
              <i class="fa fa-lock"></i> 登出</a>
          </div>
        </li>
      </ul>
    </header>
    <div class="app-body">
      <div class="sidebar">
        <nav class="sidebar-nav">
          <ul class="nav">
            <li class="nav-item" style="margin: 10px;">
              <el-input v-model="filter" placeholder="請輸入查詢內容" prefix-icon="el-icon-search">
              </el-input>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="routeToHome()">
                <i class="icon-home"></i> 首頁
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/MA080202">
                <i class="icon-arrow-right"></i> 採購作業
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/MA070101Q">
                <i class="icon-arrow-right"></i> 料件查詢
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/MA070201Q">
                <i class="icon-arrow-right"></i> 倉儲查詢
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/MA080101Q">
                <i class="icon-arrow-right"></i> 供貨商查詢
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/Version">
                <i class="icon-arrow-right"></i> 版本資訊
              </a>
            </li>
            <li class="divider"></li>
          </ul>
        </nav>
        <button class="sidebar-minimizer brand-minimizer" type="button"></button>
      </div>

      <!-- Main content -->
      <main class="main">
        <!-- Breadcrumb -->
        <ol class="breadcrumb">
          <!-- Breadcrumb Menu-->
          <li class="breadcrumb-menu d-md-down-none">
            <div class="btn-group" role="group" aria-label="Button group">

            </div>
          </li>
        </ol>

        <div class="container-fluid">
          <router-view></router-view>
        </div>
        <!-- /.conainer-fluid -->
      </main>

      <aside class="aside-menu">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#timeline" role="tab">
              <i class="icon-list"></i>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#messages" role="tab">
              <i class="icon-speech"></i>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#settings" role="tab">
              <i class="icon-settings"></i>
            </a>
          </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
          <div class="tab-pane active" id="timeline" role="tabpanel">
          </div>
          <div class="tab-pane p-3" id="messages" role="tabpanel">
          </div>
          <div class="tab-pane p-3" id="settings" role="tabpanel">
          </div>
        </div>
      </aside>
    </div>
    <footer class="app-footer">
      <span class="ml-auto">
        iFarmer 智能管理系统 Demo 測試版
      </span>
    </footer>
    <!-- built files will be auto injected -->
    <el-dialog title="訊息通知" :visible.sync="dlgNotificationVisible">
      <el-form>
        <el-form-item label="標題">
          <el-input v-model="notification.Title" disabled></el-input>
        </el-form-item>
        <el-form-item label="訊息">
          <el-input type="textarea" :rows="10" v-model="notification.Message" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="使用者資訊" :visible.sync="dlgProfileVisible" width="400px">
      <el-form :label-position="'left'" label-width="100px">
        <el-form-item label="公司名稱">
          <el-input v-model="userProfile.Company" ></el-input>
        </el-form-item>
        <el-form-item label="部門名稱">
          <el-input v-model="userProfile.DeptName" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userProfile.EmpName" readonly></el-input>
        </el-form-item>
        <el-form-item label="員工編號">
          <el-input v-model="userProfile.EmpNo" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dlgProfileVisible = false">確 認</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    logout
  } from "@/assets/js/iFarmer/manager/authManager";

  import {
    getFunctionMenuList
  } from "@/assets/js/iFarmer/manager/permissionManager";

  import {
    getAuthSiteList
  } from "@/assets/js/iFarmer/manager/locationManager"


  import store from "@/store";

  export default {
    data() {
      return {
        dlgProfileVisible: false,
        dlgNotificationVisible: false,
        menu: [],
        notificationCollection: [],
        notification: {},
        filter: "",
        signalr: this.$store.getters.userProfile.NotificationIP,
        url: "",
        siteList: []
      };
    },
    computed: {
      notificationCount: function () {
        return this.notificationCollection.length;
      },
      filteredMenu: function () {
        var filter = this.filter;
        var filteredMenu = [];

        if (!filter) return this.menu;

        if (this.menu.length > 0) {
          this.menu.forEach(function (l1menu) {
            l1menu.ChildNodes.forEach(function (l2menu) {
              l2menu.ChildNodes.forEach(function (l3menu) {
                if (l3menu.Name.indexOf(filter) > -1) {
                  filteredMenu.push(l3menu);
                }
              });
            });
          });

          return filteredMenu;
        }

        return this.menu;
      },
      userProfile: function () {
        return store.getters.userProfile;
      }
    },
    methods: {
      routeToHome() {
        this.$router.push({
          name: "Home"
        });
      },
      logout() {
        // let vueInstance = this;
        // location.reload();
        this.$router.push({ name: 'Login' })

        // this.$confirm(
        //   vueInstance.$t("home.logoutMsg"),
        //   vueInstance.$t("home.logoutTitle"), {
        //     confirmButtonText: vueInstance.$t("common.btnConfirm"),
        //     cancelButtonText: vueInstance.$t("common.btnCancel"),
        //     type: "warning"
        //   }
        // ).then(() => {
        //   try {
        //     $.connection.hub.stop();
        //   } catch (err) {}

        //   logout();
        // });
      },
      registerSignalR: function () {
        let vueInstance = this;
        let hub = $.connection.notificationHub;

        if (hub) {
          // 初始化
          hub.client.init = function (notificationCollection) {
            vueInstance.notificationCollection = notificationCollection;
          };

          // 接收通知訊息
          hub.client.notify = function (notification) {
            vueInstance.notificationCollection.unshift(notification);

            vueInstance.$notify.info({
              title: notification.Title,
              message: notification.Message
            });
          };

          // 回收通知訊息
          hub.client.recycle = function (notificationID) {
            var idx = vueInstance.notificationCollection.findIndex(function (
              element
            ) {
              return element.ID === notificationID;
            });

            if (idx > -1) {
              vueInstance.notificationCollection.splice(idx, 1);
            }
          };

          if (
            $.connection.hub &&
            $.connection.hub.state === $.signalR.connectionState.disconnected
          ) {
            // 聯機到 SignalR 服務器
            $.connection.hub.qs = {
              token: store.state.user.token
            };
            $.connection.hub.url = vueInstance.signalr;
            $.connection.hub
              .start({
                jsonp: true
              })
              .done(function () {})
              .fail(function () {
                $.connection.hub.stop();
              });
          }
        }
      },
      notificationCommand: function (notification) {
        if (notification == null) {
          this.$router.push({
            name: "ADM010123S"
          });
        } else {
          this.notification = notification;
          this.dlgNotificationVisible = true;
        }
      },
      siteChanged: function () {
        var token = store.state.user.token;
        logout();
        window.location = this.url + "?t=" + token;
      }
    },
    created() {
      let vi = this;
      getFunctionMenuList(store.getters.userProfile.EmpNo, function (menu) {
        vi.menu = menu;
      });

      getAuthSiteList(function (result) {
        if (result.IsSuccess)
          vi.siteList = result.Data;
        var site = vi.siteList.find(function (site) {
          return site.Name === vi.userProfile.SiteName;
        });

        vi.url = site.Url;
      });
    },
    mounted() {

      let script = document.createElement('script')
      script.setAttribute('src', this.signalr + '/hubs'); // 動態産生 signalr script
      document.head.appendChild(script);

      let vueInstance = this;
      setInterval(function () {
        // check signalr status
        vueInstance.registerSignalR();

        // check login expired
      }, 1000);
    }
  };

</script>

<style>
</style>
