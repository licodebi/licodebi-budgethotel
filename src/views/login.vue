<template>
    <div class="site-wrapper site-page--login">
        <main-navbar/>
        <div class="site-content__wrapper">
            <div class="site-content">
                <div class="brand-info">
                    <h2 class="brand-info__text">快捷酒店</h2>
                </div>
                <div class="login-main">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" :stretch="true" style="background-color:#fff">
                        <el-tab-pane label="账号登录" name="first">
                            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                                <el-form-item label="账号" prop="userName" style="width:350px">
                                    <el-input :clearable="true" v-model="ruleForm.userName" placeholder="请输入账号或手机号"></el-input>
                                </el-form-item>    
                                <el-form-item label="密码" prop="password" style="width:350px">
                                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" autocomplete="off" :clearable="true" ></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" prop="captcha" >
                                    <el-row style="width:250px">
                                        <el-col :span="15">
                                            <el-input v-model="ruleForm.captcha" placeholder="验证码" :clearable="true"></el-input>
                                        </el-col>
                                        <el-col :span="6" class="login-captcha">
                                            <img style="height:30px" :src="captchaPath" @click="getCaptcha()" alt="">
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="dataFormSubmit()" >登录</el-button>
                                    <el-button @click="registerNew()">注册</el-button>
                                    <el-button type="success" plain size="mini" @click="findPassword()">找回密码</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="手机登录" name="second" style="width:350px">
                            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="手机号" prop="userPhone"  style="margin-left: 7%;">
                                    <el-input  v-model.number="ruleForm2.userPhone" placeholder="请输入手机号" :clearable="true"></el-input>
                                </el-form-item>
                                <el-form-item label="短信验证码" prop="phoneCode" style="width:250px;margin-left: 7%;">
                                    <el-input v-model="ruleForm2.phoneCode" placeholder="请输入验证码" :clearable="true" maxlength="5"></el-input>
                                    <el-button type="success" plain size="small" @click="getVerify" :disabled="disabled=!show">                                       
                                        <span v-show="show">获取验证码</span>
                                        <span v-show="!show" class="count">{{count}} s</span>
                                    </el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary"  @click="dataFormSubmit2()" >登录</el-button>
                                    <el-button @click="registerNew()">注册</el-button>
                                    <el-button type="success" plain size="mini" @click="findPassword()">找回密码</el-button>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                <!-- <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                    <el-form-item prop="userName">
                    <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                    <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                    <el-row :gutter="20">
                        <el-col :span="14">
                        <el-input v-model="dataForm.captcha" placeholder="验证码">
                        </el-input>
                        </el-col>
                        <el-col :span="10" class="login-captcha">
                        <img :src="captchaPath" @click="getCaptcha()" alt="">
                        </el-col>
                    </el-row>
                    </el-form-item>
                    <el-form-item>
                    <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
                    </el-form-item>
                </el-form> -->
                </div>
            </div>
        </div>
        <register v-if="isVisible" ref="Register"></register>
        <find-password v-if="isFindVisible" ref="FindPassword"></find-password>
    </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import MainNavbar from './main-navbar.vue'
  import Register from './register.vue'
  import FindPassword from './find-password.vue'
  export default {
    data () {
        
        var validPhone=(rule, value,callback)=>{
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;    
            if (!reg.test(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        }
        var validPhoneCode=(rule, value,callback)=>{
            const reg = /\d{5}$/; 
            if (!reg.test(value)){
                callback(new Error('请输入正确长度的验证码'))
            }else {
                callback()
            }
        }
        return {
            dataForm: {
                userName: '',
                password: '',
                uuid: '',
                captcha: ''
            
            },
            rules: {
            userName: [
                { required: true, message: '帐号不能为空', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
            ],
            captcha: [
                { required: true, message: '验证码不能为空', trigger: 'blur' }
            ]
            },
            rules2: {
            userPhone: [
                { required: true, message: '手机号不能为空', trigger: 'blur' },
                { type: 'number', message: '手机号必须为数字'},
                { validator: validPhone,trigger: 'blur'}
            ],
            phoneCode: [
                { required: true, message: '短信验证码不能为空', trigger: 'blur' },
                // { type: 'number', message: '短信验证码必须为数字'},
                {  validator:validPhoneCode, message: '请输入正确长度的验证码', trigger: 'blur' }
            ]
            },
            captchaPath: '',
            activeName: 'first',
            ruleForm: {
                captcha: '',
                password: '',
                userName:'',
                uuid: ''
            },
            ruleForm2: {
                userPhone: '',
                phoneCode: ''
            },
            show: true,
            count: "", // 初始化次数
            timer: null,
            isVisible:false,
            isFindVisible:false

        }
        
    },
    components:{
        MainNavbar,
        Register,
        FindPassword
    },
    created () {
        this.getCaptcha()
    },
    methods: {
        // 提交普通表单
        dataFormSubmit () {
            this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                this.$http({
                  url: this.$http.adornUrl('/user/login'),
                  method: 'post',
                  data: this.$http.adornData({
                    'username': this.ruleForm.userName,
                    'password': this.ruleForm.password,
                    'uuid': this.ruleForm.uuid,
                    'captcha': this.ruleForm.captcha
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.$cookie.set('token', data.token)
                    // this.$router.replace({ name: 'home' })
                    this.$store.commit('updateName', data.user.userUsername)
                    this.$store.commit('updateId', data.user.userId)
                    this.$store.commit('updateUserIcon', data.user.userPhoto)
                    this.$store.commit('updateUserPhone', data.user.userPhone)
                    this.$store.commit('updateUserEmail', data.user.userEmail)
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.$router.push({path:"/index"})
                        }
                    })
                  } else {
                    this.getCaptcha()
                    this.$message.error(data.msg)
                  }
                })
              }
            })
        },
        // 提交手机表单
        dataFormSubmit2 () {
            this.$refs['ruleForm2'].validate((valid) => {
              if (valid) {
                this.$http({
                  url: this.$http.adornUrl('/user/loginByPhone'),
                  method: 'post',
                  data: this.$http.adornData({
                    'userPhone': this.ruleForm2.userPhone,
                    'phoneCode': this.ruleForm2.phoneCode
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.$cookie.set('token', data.token)
                    this.$store.commit('updateName', data.user.userUsername)
                    this.$store.commit('updateId', data.user.userId)
                    this.$store.commit('updateUserIcon', data.user.userPhoto)
                    this.$store.commit('updateUserPhone', data.user.userPhone)
                    this.$store.commit('updateUserEmail', data.user.userEmail)
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.$router.push({path:"/index"})
                        }
                    })
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            })
        },
        // 获取验证码
        getCaptcha () {
            this.ruleForm.uuid = getUUID()
        
            this.captchaPath = this.$http.adornUrl(`/user/getCaptcha?uuid=${this.ruleForm.uuid}`)

        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        getVerify() {
            // 验证手机号
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/; 
            if (!reg.test(this.ruleForm2.userPhone)) {
                this.$message.error("请填写正确的手机号");
                return false;
            } else {
                this.$http({
                  url: this.$http.adornUrl(`/user/getVerify?userPhone=${this.ruleForm2.userPhone}`)
                }).then(({data}) => {
                    if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                })
                const TIME_COUNT = 60; //更改倒计时时间
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.show = true;
                            clearInterval(this.timer); // 清除定时器
                            this.timer = null;
                        }
                    }, 1000);
                }
            }
        },
        registerNew(){
            this.isVisible = true;
            this.$nextTick(()=>{
                this.$refs.Register.init()
            })
        },
        findPassword(){
            this.isFindVisible = true;
            this.$nextTick(()=>{
                this.$refs.FindPassword.init()
            })
        }
    }
  }
</script>

<style lang="scss">
    .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
  
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/images/background/image-1.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      width: 500px;
      margin-left: 450px;
      box-shadow: 0 0 5px white;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
      margin-left: 10%;
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>