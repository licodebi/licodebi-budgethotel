<template>
    <el-dialog
    title="评价"
    :close-on-click-modal="false"
    :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="评论内容" >
                <el-input v-model="dataForm.comContent" placeholder="回复内容"></el-input>
            </el-form-item>
            <el-form-item label="用户评分" >
                <div style="margin-top:10px;padding-right:500px">
                    <el-rate
                    v-model="dataForm.comGrade"
                    show-score
                    allow-half
                    text-color="#ff9900"
                    score-template="{value}"
                    >
                    </el-rate>
                </div>
                
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
                comRoom: 0,
                comUser: 0,
                comContent:'',
                comGrade: ''
            },
             dataRule: {
                comContent:[{
                    required: true, message: '评论不能为空', trigger: 'blur'
                }],
                comGrade:[{
                    required: true, message: '评分不能为空', trigger: 'blur'
                }]
            },
            orderId:''
        }
    },
    computed: {
        userId: {
            get () { return this.$store.state.id }
        }
    },
    methods: {
        init(roomId,orderId){
            this.dataForm.comRoom=roomId;
            this.dataForm.comUser=this.userId;
            this.orderId=orderId;
            this.visible = true
        },
        // 表单提交
        dataFormSubmit (){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/order/addComment`),
                        method: 'post',
                        data: this.$http.adornData({
                            'comRoom': this.dataForm.comRoom,
                            'comUser': this.dataForm.comUser,
                            'comContent': this.dataForm.comContent,
                            'comGrade': this.dataForm.comGrade,
                        })
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            this.finalComment(this.orderId)
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
        },
        finalComment(orderId){
            this.$http({
                url: this.$http.adornUrl('/order/finalComment'),
                method: 'post',
                data: this.$http.adornData({'orderId':orderId})
            }).then(() => {
               
            }).catch(() => {})
        },
       
    }
}
</script>

<style>

</style>