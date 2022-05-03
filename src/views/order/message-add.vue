<template>
    <el-dialog
    title="留言提交"
    :close-on-click-modal="false"
    :visible.sync="visible">
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
</template>

<script>
export default {
    data (){
        return {
            visible: false,
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
        userId: {
            get () { return this.$store.state.id }
        }
    },
    methods: {
        init(){
            this.dataForm.mesNickUser=this.userId;
            if (this.dataForm.mesNickUser){
                this.dataForm.mesContent=''
                this.visible = true

            }

            
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
                                    this.visible = false
                                    this.$emit('refreshDataList')
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        }
       
    }
}
</script>

<style>

</style>