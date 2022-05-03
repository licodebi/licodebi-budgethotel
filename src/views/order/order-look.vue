<template>
    <el-dialog
    title="查看订单详情"
    :close-on-click-modal="false"
    :visible.sync="visible">
        <el-form :model="dataForm">
            <el-form-item label="订单号" :label-width="formLabelWidth">
            <el-input v-model="dataForm.orderId" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="预订房间名" :label-width="formLabelWidth">
                <el-button type="text" @click="lookRoom(dataForm.room.roomId)">{{dataForm.room.roomName}}</el-button>
            </el-form-item>
            <el-form-item label="入住人数" :label-width="formLabelWidth">
                <el-input v-model="dataForm.orderUserNumber" autocomplete="off" style="width:50px"></el-input>
            </el-form-item>
            <el-form-item label="下单时间" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.orderCreateTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="入住日期" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.orderCheckTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="退房日期" :label-width="formLabelWidth" v-if="dataForm.mesStatus=2">
                <el-input v-model="dataForm.orderEndTime" autocomplete="off"  size="small" suffix-icon="el-icon-date" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" :label-width="formLabelWidth">
                <el-input v-model="dataForm.orderUserPhone" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" :label-width="formLabelWidth">
                <el-input v-model="dataForm.orderUserMail" autocomplete="off" style="width:200px"></el-input>
            </el-form-item>
             <el-form-item label="价格" :label-width="formLabelWidth">
                <el-input v-model="dataForm.orderPrice" autocomplete="off" style="width:200px"></el-input>
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
            formLabelWidth: '100px',
            visible: false,
            dataForm: {
                orderId: '',
                room:'',
                user:'',
                orderUserName: '',
                orderUserPhone: '',
                orderUserMail: '',
                orderUserNumber: '',
                orderCreateTime: '',
                orderCheckTime: '',
                orderEndTime: '',
                orderPrice: '',
                orderStatus: '',
                orderRoom:'',
                orderUser:'',
                orderNum:''
            }
        }
    },
    methods: {
        init (id){
            //let username =this.$store.state.user.name
            //console.log(username);
            this.dataForm.orderId=id;
            this.visible = true
            if (this.dataForm.orderId) {
                this.$http({
                url: this.$http.adornUrl(`/order/info/${this.dataForm.orderId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataForm.room = data.order.room
                    this.dataForm.user = data.order.user
                    this.dataForm.orderUserName = data.order.orderUserName
                    this.dataForm.orderUserPhone = data.order.orderUserPhone
                    this.dataForm.orderUserMail = data.order.orderUserMail
                    this.dataForm.orderUserNumber = data.order.orderUserNumber
                    this.dataForm.orderCreateTime = data.order.orderCreateTime
                    this.dataForm.orderCheckTime = data.order.orderCheckTime
                    this.dataForm.orderEndTime = data.order.orderEndTime
                    this.dataForm.orderPrice = data.order.orderPrice
                    this.dataForm.orderStatus = data.order.orderStatus
                    this.dataForm.orderUser = data.order.orderUser
                    this.dataForm.orderRoom = data.order.orderRoom
                    this.dataForm.orderNum =data.order.orderNum
                    
                }
            })
            }else{
                this.dataForm.orderId= '',
                this.dataForm.room='',
                this.dataForm.user='',
                this.dataForm.orderUserName= '',
                this.dataForm.orderUserPhone= '',
                this.dataForm.orderUserMail= '',
                this.dataForm.orderUserNumber= '',
                this.dataForm.orderCreateTime= '',
                this.dataForm.orderCheckTime= '',
                this.dataForm.orderEndTime= '',
                this.dataForm.orderPrice= '',
                this.dataForm.orderStatus= '',
                this.dataForm.orderRoom='',
                this.dataForm.orderUser='',
                this.dataForm.orderNum=''

            }
        },
        lookRoom(roomId){
            this.$store.commit('updateRoomId', roomId)
            this.$router.push({path:"/room"})
        }
       
    }
}
</script>

<style>

</style>