`<template>
    <div class="sys-login-wrap">
        <div class="sys-name-box">
            <h1>通用后台配置管理系统</h1>
        </div>
        <div class="login-container-wrap">
            <div id="form-box" class="form-box">
                <h1>登录</h1>
                <el-form  ref="loginForm" :model="loginForm" :rules="loginRules">
                    <el-form-item prop="username">
                        <el-input class="ipt" v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input class="ipt" v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-col :span="12">
                            <el-input class="ipt" v-model="loginForm.code" auto-complete="off" placeholder="验证码"
                                      @keyup.enter.native="handleLogin"></el-input>
                        </el-col>
                        <el-col :span="12" style="text-align: center">
                            <img :src="codeUrl" @click="getCode" style="vertical-align: bottom;cursor: pointer;"/>
                        </el-col>
                    </el-form-item>
                    <div class="submit-btn-box">
                        <el-button
                                :loading="loading"
                                size="medium"
                                type="primary"
                                class="login-btn"
                                @click.native.prevent="handleLogin"
                        >
                            <span v-if="!loading">登 录</span>
                            <span v-else>登 录 中...</span>
                        </el-button>
                    </div>
                </el-form>
                <span id="mask"></span>
            </div>
        </div>
    </div>

</template>

<script>
    import {getCodeImg} from "@/api/login";
    import Cookies from "js-cookie";
    import {encrypt, decrypt} from '@/utils/jsencrypt'
    export default {
        name: "login",
        data() {
            return {
                codeUrl: "",
                cookiePassword: "",
                loginForm: {
                    username: "admin",
                    password: "admin123",
                    rememberMe: false,
                    code: "",
                    uuid: ""
                },
                loginRules: {
                    username: [
                        {required: true, trigger: "blur", message: "用户名不能为空"}
                    ],
                    password: [
                        {required: true, trigger: "blur", message: "密码不能为空"}
                    ],
                    code: [{required: true, trigger: "change", message: "验证码不能为空"}]
                },
                loading: false,
                redirect: undefined
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.inOrOut();
            });
        },
        created() {
            this.getCode();
            this.getCookie();
        },
        methods: {
            getCode() {
                getCodeImg().then(res => {
                    this.codeUrl = "data:image/gif;base64," + res.img;
                    this.loginForm.uuid = res.uuid;
                });
            },
            getCookie() {
                const username = Cookies.get("username");
                const password = Cookies.get("password");
                const rememberMe = Cookies.get('rememberMe')
                this.loginForm = {
                    username: username === undefined ? this.loginForm.username : username,
                    password: password === undefined ? this.loginForm.password : decrypt(password),
                    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
                };
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        if (this.loginForm.rememberMe) {
                            Cookies.set("username", this.loginForm.username, {expires: 30});
                            Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
                            Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
                        } else {
                            Cookies.remove("username");
                            Cookies.remove("password");
                            Cookies.remove('rememberMe');
                        }
                        this.$store.dispatch("Login", this.loginForm).then(() => {
                            this.$router.push({path: this.redirect || "/"});
                        }).catch(() => {
                            this.loading = false;
                            this.getCode();
                        });
                    }
                });
            },
            inOrOut() {
                let formCon = document.getElementById('form-box');
                let maskSpan = document.getElementById('mask');
                let isIn = true;
                formCon.addEventListener("mouseenter", (e) => {
                    if (isIn) {
                        let inX = e.clientX - e.target.offsetLeft;
                        let inY = e.clientY - e.target.offsetTop;
                        maskSpan.style.left = inX + 'px';
                        maskSpan.style.top = inY + 'px';
                        maskSpan.setAttribute('class', '');
                        maskSpan.setAttribute('class', 'in');
                        isIn = !isIn
                    }
                });
                formCon.addEventListener("mouseleave", (e) => {
                    if (!isIn) {
                        let inX = e.clientX - e.target.offsetLeft;
                        let inY = e.clientY - e.target.offsetTop;
                        maskSpan.style.left = inX + 'px';
                        maskSpan.style.top = inY + 'px';
                        maskSpan.setAttribute('class', '');
                        maskSpan.setAttribute('class', 'out');
                        isIn = !isIn
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .sys-login-wrap{
        display: flex;
        height: 100%;
        flex-direction: column;
        background: #2b5876;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #4e4376, #2b5876);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #4e4376, #2b5876); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .sys-name-box{
        flex: .2;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 23px;
    }
    .sys-name-box h1{
        text-shadow: 0px 1px 13px rgb(255 255 255);
        letter-spacing: 5px;
        color: #fff;

    }
    .login-container-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: .8;
       /* background: #3a8ee6;*/
    }

    .form-box {
        width: 20%;
        height: 450px;
        background: rgba(228, 228, 228, .2);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 30px;
        box-shadow: 15px 15px 10px rgba(0, 0, 0, .12);
        border-radius: 20px;
        overflow: hidden;
    }

    .form-box h1 {
        color: #fff;
        text-align: center;
        margin-bottom: 30px;
        letter-spacing: 5px;
        text-shadow: 2px 3px 5px rgba(0, 0, 0, .12);
        z-index: 1;
        margin-top: 0;
    }

    .form-box form {
        z-index: 1;
    }

    .form-box .ipt >>> .el-input__inner {
        background-color: transparent;
        border: 0;
        border-radius: 0;
        border-bottom: 1px solid #fff;
        outline: none;
        color: #fff;
        padding: 5px;
    }

    .form-box .ipt >>> .el-input__inner::placeholder {
        color: #fff;
    }
    .form-box >>> .el-form-item__error{
        color: #555;
    }
    .submit-btn-box {
        text-align: center;
        z-index: 1;
    }

    .submit-btn-box button {
        background: rgba(255, 255, 255, 0);
        border: none;
        border: 1px solid #fff;
        color: #fff;
        width: 200px;
        height: 40px;
        border-radius: 20px;
        margin-top: 20px;
        cursor: pointer;
        letter-spacing: 5px;
        font-size: 16px;
        outline: none;
    }

    .login-container-wrap .in {
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        background: #00cdff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: in 0.5s ease-out forwards;
    }

    .login-container-wrap .out {
        position: absolute;
        left: 0;
        top: 0;
        width: 1200px;
        height: 1200px;
        background: #00cdff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: out 0.5s ease-out forwards;
    }

    @keyframes in {
        0% {
            width: 0;
            height: 0;
        }
        100% {
            width: 1200px;
            height: 1200px;
        }
    }

    @keyframes out {
        0% {
            width: 1200px;
            height: 1200px;
        }
        100% {
            width: 0;
            height: 0;
        }
    }
</style>
