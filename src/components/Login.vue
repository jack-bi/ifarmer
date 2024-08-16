<template>
	<div class="app flex-row align-items-center">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-9">
					<div class="card-group">
						<div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
							<div class="card-body">
								<h2>iFarmer 智能管理系统</h2>
								<p class="text-left">
									長穩iFarmer實現3T（IT,OT,CT）融合資料與服務創新，實現農牧專業知識與資源之「農牧智慧管理平台」。​
								</p>
							</div>
						</div>
						<div class="card p-4">
							<div class="card-body">
								<h1>{{ site }}</h1>
								<p class="text-muted">{{ $t('login.description') }}</p>
								<div class="input-group mb-3">
									<el-input size="medium" id="Account" :placeholder="$t('login.userName')"
										v-model="accountNo" @keyup.enter.native="detectKeyup">
										<template slot="prepend">
											<i class="icon-user"></i>
										</template>
									</el-input>
								</div>
								<div class="input-group mb-4">
									<el-input size="medium" id="Password" :placeholder="$t('login.password')"
										v-model="password" @keyup.enter.native="detectKeyup" type="password">
										<template slot="prepend">
											<i class="icon-lock"></i>
										</template>
									</el-input>
								</div>
								<p class="text-muted">預設帳號:icwadmin，預設密碼:12345678</p>
								<div class="row">
									<div class="col-6 ">
										<router-link :to="'ForgotPassword'">{{ $t('login.resetPwd') }}</router-link>
									</div>
									<div class="col-6 text-right">
										<el-button id="LoginBtn" type="primary" size="medium" @click="toLogin">{{
									$t('login.loginBtn') }}
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { loading } from "@/assets/js/iFarmer/library/commonLib";
import { mapActions, mapGetters } from "vuex";
// import { isAuthenticated, isAuthenticatedByToken, getSiteInfo } from "@/assets/js/iFarmer/manager/authManager";
import Cookies from 'js-cookie';
import { expireCookieKey } from '@/assets/js/iFarmer/manager/configManager'

export default {
	data() {
		return {
			accountNo: "",
			password: "",
			site: ""
		};
	},
	mounted() {
		let vi = this;
		if (Cookies.get(expireCookieKey)) {
			Cookies.remove(expireCookieKey);
			this.$notify.error({
				title: "连线逾时",
				message: "您的连线已逾时, 请重新登入"
			});
		}

		// let token = new URL(window.location.href).searchParams.get("t");
		// if (token) {
		// 	let loadingInst = loading();
		// 	isAuthenticatedByToken(token, function (result) {
		// 		if (result) {
		// 			window.location = window.location.href.split("?")[0];
		// 			loadingInst.close();

		// 			return;
		// 		}

		// 		loadingInst.close();
		// 	});
		// }

		// getSiteInfo(function (result) {
		// 	if (result.IsSuccess) {
		// 		vi.site = result.Data;
		// 	}
		// });
	},
	methods: {
		...mapActions([
			"changeLanguage" //对应template的click触发的action
		]),
		toLogin() {
			let vueInstance = this;
			let loadingInst = loading();

			// isAuthenticated(this.accountNo, this.password, function (result) {
			// 	if (result) {
			// 		location.reload();
			// 		loadingInst.close();
			// 		return;
			// 	}
			// 	loadingInst.close();
			// 	vueInstance.$notify.error({
			// 		title: vueInstance.$t("login.loginFailTitle"),
			// 		message: vueInstance.$t("login.loginFailMsg")
			// 	});
			// });

			if (this.accountNo == 'icwadmin' && this.password == '12345678') {
				loadingInst.close();
				this.$router.push({ name: 'Home' })

				return;
			} else {
				loadingInst.close();
				vueInstance.$notify.error({
					title: vueInstance.$t("login.loginFailTitle"),
					message: vueInstance.$t("login.loginFailMsg")
				});
			}
		},
		detectKeyup() {
			this.login();
		}
	}
};

</script>

<style></style>
