import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import ForgotPassword from '@/components/ForgotPassword'
import UnAuthorize from '@/components/UnAuthorize'
import Version from '@/components/Version'
import ApprovalPage from '@/components/ApprovalPage'
import Inbox from '@/components/ADM01/ADM0101/Inbox'

import MA080202 from '@/components/MDL08/MA0802/MA080202'
import MA070101Q from '@/components/MDL07/MA0701/MA070101Q'
import MA070201Q from '@/components/MDL07/MA0702/MA070201Q'
import MA080101Q from '@/components/MDL08/MA0801/MA080101Q'

// import MA080202Q from '@/components/MDL08/MA0802/MA080202Q'
// import PurchaseRequestItemQ from '@/components/MDL08/MA0802/PurchaseRequestItemQ'

import SiteMap from '@/components/SiteMap'
import store from '@/store'
import {
  getToken
} from '@/assets/js/iFarmer/manager/authManager'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        auth: false
      }
    }, 
    {
      name: 'ApprovalPage',
      path: '/ApprovalPage',
      component: ApprovalPage,
      meta: {
        auth: false
      },
      redirect: {
        name: "MA080202"
      },
      children: [ 
        {
          name: "ap_MA080202",
          path: "/ApprovalPage/MA080202",
          component: MA080202,
          meta: {
            auth: false
          }
        }
      ]
    },
    {
      name: "ForgotPassword",
      path: "/ForgotPassword",
      component: ForgotPassword,
      meta: {
        auth: false
      }
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        auth: false
      },
      redirect: {
        name: "SiteMap"
      },
      children: [{
          name: "SiteMap",
          path: "/SiteMap",
          component: SiteMap,
          meta: {
            auth: false
          }
        }, {
          name: "UnAuthorize",
          path: "/UnAuthorize",
          component: UnAuthorize,
          meta: {
            auth: false
          }
        }, {
          name: "Version",
          path: "/Version",
          component: Version,
          meta: {
            auth: false
          }
        }, {
          name: "Inbox",
          path: "/Inbox",
          component: Inbox,
          meta: {
            auth: false
          }
        },
        /* MDL08/MA0802 */
        {
          name: "MA080202",
          path: "/MA080202",
          component: MA080202,
          meta: {
            auth: false
          }
        },
        {
          name: "MA070101Q",
          path: "/MA070101Q",
          component: MA070101Q,
          meta: {
            auth: false
          }
        },
        {
          name: "MA070201Q",
          path: "/MA070201Q",
          component: MA070201Q,
          meta: {
            auth: false
          }
        },
        {
          name: "MA080101Q",
          path: "/MA080101Q",
          component: MA080101Q,
          meta: {
            auth: false
          }
        },

        // {
        //   name: "MA080202Q",
        //   path: "/MA080202Q",
        //   component: MA080202Q,
        //   meta: {
        //     auth: false
        //   }
        // }, 
        // {
        //   name: "PurchaseRequestItemQ",
        //   path: "/PurchaseRequestItemQ",
        //   component: PurchaseRequestItemQ,
        //   meta: {
        //     auth: false
        //   }
        // },
      ]
    },
    // 預設轉址, 必須放最後
    {
      path: "/*",
      redirect: {
        name: "Home"
      }
    }

  ]
})

import Cookies from 'js-cookie'
import {
  permissionCookieKey
} from '@/assets/js/iFarmer/manager/configManager'
/* auth validation */
router.beforeEach((to, from, next) => {
  store.dispatch("updateTokenAsync", getToken());

  var qArray = window.location.href.split('?');
  var formID = null
  for (var i = 1; i < qArray.length; i++) {
    var pArr = qArray[i].split('='); //split key and value
    if (pArr[0] === "HistoryFormID")
    formID = pArr[1];
  }
  store.commit('setHistoryFormID', formID);

  if (to.name.indexOf("ap_") > -1)
    store.commit('resetIsModify', false);
  else
    store.commit('resetIsModify', true);

  if (to.matched.some(record => {
      return record.meta.auth;
    })) {
    if (!store.state.user.token) {
      next({
        path: '/'
      });

      return;
    }
    if (
      to.name === 'Home' ||
      to.name === 'SiteMap' ||
      to.name === 'UnAuthorize' ||
      to.name === 'Version' ||
      to.name === 'Inbox' ||
      to.name.indexOf("ap_") > -1
    ) {
      next();
      return;
    }

    var permFuncList = JSON.parse(Cookies.get(permissionCookieKey));

    if (permFuncList && permFuncList.includes(to.name)) {
      next();
      return;
    } else {
      next({
        name: 'UnAuthorize'
      });

      return;
    }
  } else {
    // 已登入
    if (store.state.user.token && to.name === 'Login') {
      next({
        name: 'Home'
      });
      return;
    }
  }

  next();
});

export default router;
