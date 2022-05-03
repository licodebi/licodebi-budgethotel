<template>
    <div>
        <b-navbar toggleable="lg" type="light" variant="light" fixed="top">
            <img src="../assets/images/logo.png" >
            <b-navbar-brand href="#" @click="toMain()">主页</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="#" v-if="userName!=''" type="text" size="small" @click="messageAdd()">联系客服</b-nav-item>
                </b-navbar-nav>
                
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" style="margin-right:150px">

                    <b-button size="sm" class="my-2 my-sm-0" type="submit" v-if="userName==''" @click="toLogin()">登录</b-button> 
                    <el-avatar :src="transformImage(userIcon)" v-if="userName!=''"></el-avatar>
                    <b-nav-item-dropdown right v-if="userName!=''">
                    <!-- Using 'button-content' slot -->
                        <template v-slot:button-content>
                            <em>{{userName}}</em>
                        </template>
                        <b-dropdown-item href="#" @click="updatePassword()">修改密码</b-dropdown-item>
                        <b-dropdown-item href="#" @click="toSelf()">个人中心</b-dropdown-item>
                        <b-dropdown-item href="#" @click="toOrder()">我的订单</b-dropdown-item>
                        <b-dropdown-item href="#" @click="toCollect()">我的收藏</b-dropdown-item>
                        <b-dropdown-item href="#" @click="toComment()">我的评论</b-dropdown-item>
                        <b-dropdown-item href="#" @click="toMessage()">我的留言</b-dropdown-item>
                        <b-dropdown-item href="#" @click="logOut()">注销</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>

            </b-collapse>
        </b-navbar>
        <el-dialog
        title="留言提交"
        :close-on-click-modal="false"
        :visible.sync="addVisible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
                <el-form-item label="留言内容" >
                    <el-input v-model="dataForm.mesContent" placeholder="留言内容" type="textarea" maxlength="200"  show-word-limit autosize></el-input>
                </el-form-item>
            </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
                </span>
        </el-dialog>
        <update-password v-if="updateVisible" ref="updatePassword"></update-password>
    </div>
</template>

<script>
import updatePassword from './user/update-password'
export default {
    data (){
        return {
            addVisible:false,
            updateVisible:false,
            dataForm: {
                mesNickUser: 0,
                mesContent:''
            },
            dataRule: {
                mesContent:[{
                    required: true, message: '留言内容不能为空', trigger: 'blur'
                }] 
            }
        }
    },
    computed: {
        userName: {
            get () { return this.$store.state.name }
        },
        userId: {
            get () { return this.$store.state.id }
        },
        userIcon:{
            get () { return this.$store.state.userIcon }
        }
    },
    components: {
         updatePassword
    },
    methods: {
        toLogin(){
            this.$router.push({path:"/login"})
        },
        transformImage(value){
            return this.$http.adornUrl(value)
        },
        logOut(){
            this.$http({
                url: this.$http.adornUrl(`/user/logOut?userName=${this.userName}`)
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500
                    })
                    this.$store.commit('updateName', '')
                    this.$store.commit('updateId', '')
                    this.$store.commit('updateUserIcon', '')
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        toMessage(){
            this.$router.push({path:"/user_message"})

        },
        toComment(){
            this.$router.push({path:"/user_comment"})
        },
        toCollect(){
            this.$router.push({path:"/user_collect"})

        },
        toOrder(){
            this.$router.push({path:"/user_order"})   
        },
        toSelf(){
            this.$router.push({path:"/user_main"})   
        },
        toMain(){
            this.$router.push({path:"/index"})

        },
         messageAdd(){
            this.dataForm.mesNickUser=this.userId
            this.dataForm.mesContent=''
            this.addVisible = true

        },
        // 表单提交
        dataFormSubmit (){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/manager/message/addMessage`),
                        method: 'post',
                        data: this.$http.adornData({
                            'mesNickUser': this.dataForm.mesNickUser,
                            'mesContent': this.dataForm.mesContent
                        })
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.addVisible = false
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
        updatePassword(){
            this.updateVisible = true
            this.$nextTick(() => {
            this.$refs.updatePassword.init()
            })
        }
    }

}
</script>

<style>

</style>