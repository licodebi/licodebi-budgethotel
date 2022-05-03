<template>
    <div>
        <el-dialog title="用户注册" :visible.sync="isVisible" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
                    <el-input v-model="form.userName" style="width:250px" :clearable="true" placeholder="请输入5-12位的账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password" type="password" style="width:250px" :clearable="true" placeholder="请输入5-16位的密码"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="userPhone">
                    <el-input v-model.number="form.userPhone"  style="width:250px" :clearable="true" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="手机验证码" :label-width="formLabelWidth" prop="phoneCode">
                    <el-input v-model="form.phoneCode"  style="width:100px" :clearable="true" placeholder="验证码" maxlength="5"></el-input>
                    <el-button type="success" plain size="small" @click="getVerify" :disabled="disabled=!show">
                        <span v-show="show">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var validPhone=(rule, value,callback)=>{
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;    
            if (!reg.test(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        };
        var validPhoneCode=(rule, value,callback)=>{
            const reg = /\d{5}$/; 
            if (!reg.test(value)){
                callback(new Error('请输入正确长度的验证码'))
            }else {
                callback()
            }
        }
        return{
            isVisible: false,
            formLabelWidth: "100px",
            form: {
                userName: '',
                password: '',
                userPhone: '',
                phoneCode: ''
            },
            rules: {
                userName: [
                    { required: true, message: '帐号不能为空', trigger: 'blur' },
                    {  min: 5, max: 12, message: '账号长度为5-12位', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    {  min: 5, max: 16, message: '密码长度为5-16位', trigger: 'blur' }

                ],
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
            show: true,
            count: "", // 初始化次数
            timer: null,
        }
    },
    methods:{
        init(){
            this.isVisible = true
            this.form.userName='';
            this.form.password='';
            this.form.userPhone='';
            this.form.phoneCode='';
            this.show=true;
            this.count="";
            this.timer=null;
        },
        getVerify() {
            // 验证手机号
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/; 
            if (!reg.test(this.form.userPhone)) {
                this.$message.error("请填写正确的手机号");
                return false;
            } else {
                this.$http({
                  url: this.$http.adornUrl(`/user/getVerify?userPhone=${this.form.userPhone}`)
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
        dataFormSubmit(){
            //this.isVisible = false
            this.$refs['form'].validate((valid) =>{
                if (valid) {
                this.$http({
                  url: this.$http.adornUrl('/user/userRegistry'),
                  method: 'post',
                  data: this.$http.adornData({
                    'userPhone': this.form.userPhone,
                    'phoneCode': this.form.phoneCode,
                    'username': this.form.userName,
                    'password': this.form.password
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.$message({
                        message: '注册成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.isVisible = false
                        }
                    })
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        }
    }
}
</script>

<style>

</style>