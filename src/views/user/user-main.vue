<template>
    <div>
        <main-navbar/>
        <div style=" margin-top: 140px; ">
            <b-container class="bv-example-row" >
                <b-row class="text-center">
                    <b-col>
                    </b-col>
                    <b-col cols="8">
                        <div>
                            <div class="h3 mb-0" style="color:#303133">个人信息</div>
                            <el-divider></el-divider>
                            <!-- 订单信息 -->
                            <div v-if="operateStatus==0">
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">头像:</span><span class="worldContentStyle"><img style="width: 70px;height: 70px" v-if="imgUrl" :src="imgUrl" class="avatar"></span>
                                </div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">用户名:</span><span class="worldContentStyle">{{this.dataForm.userUsername}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">姓名:</span><span class="worldContentStyle">{{this.dataForm.userName}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">电话:</span><span class="worldContentStyle">021-{{this.dataForm.userPhone}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">邮箱:</span><span class="worldContentStyle">{{this.dataForm.userEmail}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">居住地址:</span><span class="worldContentStyle">{{this.dataForm.userAddress}}</span>
                                </div>
                            </div>
                            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" v-if="operateStatus==1">
                                <div>
                                    <div class="diaStyle" style="margin-top:20px;">
                                        <el-form-item label="头像" ref="userPhoto" prop="img">
                                            <el-input v-model="dataForm.userPhoto" v-if="false"></el-input>
                                            <el-upload
                                            class="avatar-uploader"
                                            :action="materialPictureAndText()"
                                            :on-success="handleAvatarSuccess"
                                            :show-file-list="false"
                                            :before-upload="beforeUpload2">
                                                <img style="width: 70px;height: 70px" v-if="imgUrl" :src="imgUrl" class="avatar">
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                        </el-form-item>
                                    </div>
                                    <div class="diaStyle" style="margin-top:20px;">
                                        <el-form-item label="用户名"  prop="userUsername">
                                            <el-input v-model="dataForm.userUsername" style="width:200px;"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="diaStyle" style="margin-top:20px;">
                                        <el-form-item label="姓名"  prop="userName">
                                            <el-input v-model="dataForm.userName" style="width:150px"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="diaStyle" style="margin-top:20px;" >
                                        <el-form-item label="电话" prop="userPhone">
                                            <el-input v-model="dataForm.userPhone"  style="width:220px"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="diaStyle" style="margin-top:20px;" >
                                        <el-form-item label="邮箱" prop="userEmail">
                                            <el-input v-model="dataForm.userEmail"  style="width:220px"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="diaStyle" style="margin-top:20px;" >
                                        <el-form-item label="居住地址" prop="userAddress">
                                            <el-input v-model="dataForm.userAddress"  style="width:400px"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </el-form>
                            <el-divider></el-divider>
                            <span>
                                <el-button @click="modifyInformation()">修改</el-button>
                                <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
                            </span>                            
                        </div>
                    </b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import MainNavbar from '../main-navbar.vue'
export default {
    data (){
        var validPhone=(rule, value,callback)=>{
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;    
            if (!reg.test(value)){
                callback(new Error('请输入正确的11位手机号码'))
            }else {
                callback()
            }
        };
        var validUserEmail=(rule, value,callback)=>{
            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;    
            if (!reg.test(value)){
                callback(new Error('请输入正确的邮箱'))
            }else {
                callback()
            }
        };
        return {
            operateStatus:0,           
            dataForm: {
                userId: '',
                userUsername: '',
                userName: '',
                userPhone: '',
                userEmail: '',
                userAddress: '',
                userPhoto: ''
            },
            dataRule: {
                userUsername: [
                    { required: true, message: '用户名不能为空', trigger: 'bludr' }  
                ],
                userName:[{
                    required: true, message: '用户姓名不能为空', trigger: 'bludr'
                }],
                userAddress:[{
                    required: true, message: '请输入家庭地址', trigger: 'bludr'
                }],
                userPhone:[
                    {required: true, message: '请输入手机号', trigger: 'bludr'},
                    {validator:validPhone,trigger: 'blur'}
                ],
                userEmail:[
                    {required: true, message: '请输入邮箱', trigger: 'bludr'},
                    {validator:validUserEmail,trigger: 'blur'}
                ]
            },
            imgUrl:''
        }
    },
    components: {
        MainNavbar
    },
    computed: {
        userId: {
            get () { return this.$store.state.id }
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.dataForm.userId=this.userId
            if (this.dataForm.userId) {
                    this.$http({
                    url: this.$http.adornUrl(`/manager/user/getOneUser/${this.dataForm.userId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataForm.userUsername = data.user.userUsername
                        this.dataForm.userName = data.user.userName
                        this.dataForm.userPhone = data.user.userPhone
                        this.dataForm.userEmail = data.user.userEmail
                        this.dataForm.userAddress = data.user.userAddress
                        this.dataForm.userPhoto = data.user.userPhoto
                        this.imgUrl=this.$http.adornUrl(data.user.userPhoto)

                    }else {
                        this.$message.error('请先登录')
                        this.dataList = []
                        this.totalPage = 0
                        this.$store.commit('updateName', '')
                        this.$store.commit('updateId', '')
                        this.$store.commit('updateUserIcon', '')
                        this.$router.push({path:"/login"})
                    }
                })
            }else{
                this.dataForm.userUsername = ''
                this.dataForm.userName = ''
                this.dataForm.userPhone = ''
                this.dataForm.userEmail = ''
                this.dataForm.userAddress = ''
                this.dataForm.userPhoto = ''
            }
        },
        //图片上传完后的回调函数
        handleAvatarSuccess (response,file) {
            if(response.code==0){
                this.imgUrl=this.$http.adornUrl(response.success)
                this.dataForm.userPhoto=response.success
            }else{
                this.$message({
                 type: 'info',
                message: '请重新上传'
            })  
            }
           
        },
        //照片上传
        materialPictureAndText () {
            return this.$http.adornUrl(`/pictureManage/materialPicture`)  //前面是为了方便线上加的
        },
        //上传前的校验
        beforeUpload2 (file) {
            const isLt2M = file.size < 1024 * 1024 * 2
            // console.log('大小' + isLt2M)
            if (!isLt2M) {
            this.$message.error('上传文件大小不能超过 2MB!')
            }
            
            return isLt2M
        },
        // 表单提交
        dataFormSubmit (){
            this.operateStatus=0;
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manager/user/updateUser`),
                        method: 'post',
                        data: this.$http.adornData({
                            'userId': this.dataForm.userId,
                            'userUsername': this.dataForm.userUsername, 
                            'userName': this.dataForm.userName, 
                            'userPhone': this.dataForm.userPhone, 
                            'userEmail': this.dataForm.userEmail, 
                            'userAddress': this.dataForm.userAddress, 
                            'userPhoto': this.dataForm.userPhoto                    
                        })
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                    this.init();
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                            this.init();
                        }
                    })
                }
            })
        },
        modifyInformation(){
            this.operateStatus=1;
        }
    }
}
</script>

<style>
    .wordTitleStyle{
        font-size: 18px;
        color: rgb(94, 87, 87);
    }
    .worldContentStyle{
        
        margin-left: 15px;
        
    }
    .diaStyle{
        text-align:left;
        padding-left:30px;
    }
    
</style>