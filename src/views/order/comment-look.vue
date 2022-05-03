<template>
    <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible">
        <el-form :model="dataForm">
            <el-form-item label="评论房间" :label-width="formLabelWidth">
                <el-button  type="text"  @click="lookRoom(dataForm.room.roomId)">{{dataForm.room.roomName}}</el-button>
            </el-form-item>
            <el-form-item label="评论时间" :label-width="formLabelWidth">
                <el-input v-model="dataForm.comCreateTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="评论内容" :label-width="formLabelWidth">
                <el-input v-model="dataForm.comContent" type="textarea" autosize autocomplete="off" w></el-input>
            </el-form-item>
            <el-form-item label="评分" :label-width="formLabelWidth">
                <div style="margin-top:10px;">
                    <el-rate
                        v-model="dataForm.comGrade"
                        show-score
                        disabled
                        text-color="#ff9900"
                        score-template="{value}"
                    >
                    </el-rate>
                </div>
            </el-form-item>
            <el-form-item label="回复时间" :label-width="formLabelWidth" >
                <el-input v-model="dataForm.comReplyTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="回复内容" :label-width="formLabelWidth" v-if="dataForm.comStatus=1">
                <el-input v-model="dataForm.comReplyContent" type="textarea" autosize autocomplete="off" w></el-input>
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
                comId: 0,
                comContent:'',
                comGrade: '',
                comCreateTime:'',
                room:'',
                comReplyTime:'',
                comReplyContent:''
            }
        }
    },
    methods: {
        init(id){
            this.dataForm.comId=id;
            this.visible = true
             if (this.dataForm.comId) {
                    this.$http({
                    url: this.$http.adornUrl(`/manager/comment/lookOneComment/${this.dataForm.comId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataForm.comContent= data.comment.comContent
                        this.dataForm.comGrade = data.comment.comGrade
                        this.dataForm.comCreateTime = data.comment.comCreateTime 
                        this.dataForm.room = data.comment.room
                        this.dataForm.comReplyTime = data.comment.comReplyTime
                        this.dataForm.comReplyContent = data.comment.comReplyContent
                    }
                })
            }else{
                this.dataForm.comId=0
                this.dataForm.comContent=''
                this.dataForm.comGrade=''
                this.dataForm.comCreateTime = ''
                this.dataForm.room = ''
                this.dataForm.comReplyTime = ''
                this.dataForm.comReplyContent = ''
            }
        },
        lookRoom(roomId){
            this.$store.commit('updateRoomId', roomId)
            this.$router.push({path:"/room"})
        },
       
    }
}
</script>

<style>

</style>