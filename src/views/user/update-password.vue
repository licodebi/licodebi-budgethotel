<template>
    <div>
        <el-dialog title="修改密码" :visible.sync="isVisible" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
                    <el-input v-model="form.oldPassword" type="password" style="width:250px" :clearable="true" placeholder="请输入5-16位的密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                    <el-input v-model="form.newPassword" type="password" style="width:250px" :clearable="true" placeholder="请输入5-16位的密码"></el-input>
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
        
        return{
            isVisible: false,
            formLabelWidth: "100px",
            form: {
                oldPassword: '',
                userId:'',
                newPassword: ''
            },
            rules: {
                
                oldPassword: [
                    { required: true, message: '旧密码不能为空', trigger: 'blur' },
                    {  min: 5, max: 16, message: '密码长度为5-16位', trigger: 'blur' }

                ],
                newPassword: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' },
                    {  min: 5, max: 16, message: '密码长度为5-16位', trigger: 'blur' }

                ]
            },
            show: true,
            count: "", // 初始化次数
            timer: null,
        }
    },
    computed: {
        userId: {
            get () { return this.$store.state.id }
        }
    },
    methods:{
        init(){
            this.form.oldPassword='';
            this.form.newPassword='';
            
            this.form.userId=this.userId;
            if(this.form.userId){
                this.isVisible = true
            }
            
        },

        dataFormSubmit(){
            //this.isVisible = false
            this.$refs['form'].validate((valid) =>{
                if(valid){
                    this.$http({
                        url: this.$http.adornUrl(`/manager/user/updatePassword`),
                        method: 'post',
                        data: this.$http.adornData({
                            'userId': this.form.userId,
                            'oldPassword': this.form.oldPassword,
                            'newPassword': this.form.newPassword,
                        })
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: '操作成功',
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