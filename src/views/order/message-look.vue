<template>
    <el-dialog
    title="查看留言"
    :close-on-click-modal="false"
    :visible.sync="visible">
        <el-form :model="dataForm">
            <el-form-item label="留言人" :label-width="formLabelWidth">
            <el-input v-model="dataForm.user.userUsername" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="留言时间" :label-width="formLabelWidth">
                <el-input v-model="dataForm.mesCreateTime" autocomplete="off" size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="留言内容" :label-width="formLabelWidth">
                <el-input v-model="dataForm.mesContent" type="textarea" autosize autocomplete="off" w></el-input>
            </el-form-item>
            
            <el-form-item label="回复人" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.mesReplyName" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="回复时间" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.mesReplyTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="回复内容" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.mesReply" type="textarea" autosize autocomplete="off" w></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data (){
        return {
            formLabelWidth: '80px',
            visible: false,
            dataForm: {
                mesId: 0,
                mesNickName: '',
                mesCreateTime: '',
                mesContent: '',
                mesReplyName: '',
                mesReply: '',
                mesReplyTime: '',
                user:''
            }
        }
    },
    methods: {
        init(id){
            this.dataForm.mesId=id;
            this.visible = true
             if (this.dataForm.mesId) {
                    this.$http({
                    url: this.$http.adornUrl(`/manager/message/lookOneMessage/${this.dataForm.mesId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataForm.mesNickName = data.message.mesNickName
                        this.dataForm.mesCreateTime = data.message.mesCreateTime
                        this.dataForm.mesContent = data.message.mesContent
                        this.dataForm.mesReplyName = data.message.mesReplyName
                        this.dataForm.mesReply = data.message.mesReply
                        this.dataForm.mesReplyTime = data.message.mesReplyTime
                        this.dataForm.user = data.message.user
                    }
                })
            }else{
                this.dataForm.mesId=0
                this.dataForm.mesNickName=''
                this.dataForm.mesCreateTime=''
                this.dataForm.mesContent=''
                this.dataForm.mesReplyName = ''
                this.dataForm.mesReply = ''
                this.dataForm.mesReplyTime = ''
                this.dataForm.user = ''
            }
        }
       
    }
}
</script>

<style>

</style>