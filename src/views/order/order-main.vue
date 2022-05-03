<template>
    <div>
        <main-navbar/>
        <div style=" margin-top: 140px; ">
            <b-container class="bv-example-row" >
                <b-row class="text-center">
                    <!-- <b-col></b-col> -->
                    <b-col cols="8">

                        <div>
                            <div class="h3 mb-0" style="color:#303133">订单确认</div>
                            <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle" style="color:rgb(94, 48, 138);">订单号:</span><span class="worldContentStyle" style="color:rgb(94, 48, 138);font-size:18px">{{dataForm.orderId}}</span>
                            </div>
                            <el-divider></el-divider>
                            <!-- 订单信息 -->
                            <div>
                                <div class="h4 mb-0" style="text-align:left">酒店信息</div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">酒店名称:</span><span class="worldContentStyle">上海外滩花间堂:愉园</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">酒店地址:</span><span class="worldContentStyle">上海市黄浦区人民路386号</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">电话:</span><span class="worldContentStyle">021-xxxxxxxx</span>
                                </div>
                            </div>
                            <el-divider></el-divider>
                            <div>
                                <div class="h4 mb-0" style="text-align:left">入住信息</div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">房间名:</span><span class="worldContentStyle">{{dataForm.room.roomName}}</span>
                                    <span style="float:right;font-size:18px;">{{dataForm.room.roomType}}人间</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">  
                                    <span class="wordTitleStyle">入住人数:</span><span class="worldContentStyle">{{dataForm.orderUserNumber}}人</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">预订房间数:</span><span class="worldContentStyle">{{dataForm.orderNum}}间</span>
                                </div>
                               
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">剩余房间数:</span><span class="worldContentStyle">{{dataForm.room.roomStock-dataForm.room.roomSurplus}}</span>
                                </div>
                                 <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">入离日期:</span>
                                    <span class="worldContentStyle">入住 {{dataForm.orderCheckTime}};</span>
                                    <span class="worldContentStyle">离店 {{dataForm.orderEndTime}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">总价格:</span><span class="worldContentStyle" style="color:coral">￥{{dataForm.orderPrice}}</span>
                                </div>
                            </div>
                            <el-divider></el-divider>
                             <div>
                                <div class="h4 mb-0" style="text-align:left">联系信息</div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">联系电话:</span><span class="worldContentStyle">{{dataForm.orderUserPhone}}</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">邮箱:</span><span class="worldContentStyle">{{dataForm.orderUserMail}}</span>
                                </div>
                            </div>
                            <el-divider></el-divider>
                            
                            <span>
                                <el-button @click="toUserOrder()">取消</el-button>
                                <el-button type="primary" @click="payOrder()">支付</el-button>
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
        var validOrderUser=(rule, value,callback)=>{
            const reg = /^[\u4e00-\u9fa5]+$/;    
            if (!reg.test(value)){
                callback(new Error('请输入中文姓名'))
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
            roomType:2,
            pickerOptions: {
                disabledDate(time) {
                    if(time.getTime() < (Date.now()-3600 * 1000 * 24)){
                        return true;
                    }
                    if(time.getTime()>(Date.now()+3600 * 1000 * 24 * 30)){
                        return true;

                    }
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
            },   
            dataForm:{
                userNum:1,
                orderNum:1,
                orderUserList:[
                    {username:''}
                ],
                mesCreateTime:[
                ],
                userEmail:'',
                room:'',
                orderUserPhone:'',
                orderUserMail:'',
                orderUserNumber:'',
                orderCheckTime:'',
                orderEndTime:'',
                orderPrice:'',
                orderStatus:'',
                orderNum:'',
                orderId:''
            }

        }
    },
    components: {
        MainNavbar
    },
    computed: {
        roomId: {
            get () { return this.$store.state.orderRoom }
        },
        userId:{
            get () { return this.$store.state.id }
        }
    },
    created (){
        this.dataForm.orderId = this.$route.query.orderId
        if (this.dataForm.orderId!=''&&this.dataForm.orderId!=undefined) {
            this.getData();
        }
        else{
            this.$router.push({path:"/index"})
        }
    },
    methods:{
        handleUserNumChange(value){
            if (value%this.roomType!=0&&value>this.roomType) {
                this.dataForm.orderNum=(value+1)/this.roomType
            }else{
                this.dataForm.orderNum=value/this.roomType
            }
        },
        handleRoomChange(value){
            if(value>this.dataForm.userNum){
                this.dataForm.userNum=value
            }
            let userList=[]
            for (let key=0;key<value;key++) {
                userList.push({userName:''})
            }
            this.dataForm.orderUserList=userList;
        },
        getData(){
            this.dataForm.roomId=this.roomId;
            if (this.dataForm.roomId) {
                    this.$http({
                    url: this.$http.adornUrl(`/manager/order/getOneOrder/${this.dataForm.orderId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataForm.room = data.order.room
                        this.dataForm.orderUserPhone = data.order.orderUserPhone
                        this.dataForm.orderUserMail = data.order.orderUserMail
                        this.dataForm.orderUserNumber = data.order.orderUserNumber
                        this.dataForm.orderCheckTime = data.order.orderCheckTime
                        this.dataForm.orderEndTime = data.order.orderEndTime
                        this.dataForm.orderPrice = data.order.orderPrice
                        this.dataForm.orderStatus = data.order.orderStatus
                        this.dataForm.orderNum =data.order.orderNum
                    }else{
                        this.$message.error('请先登录')
                        this.$store.commit('updateName', '')
                        this.$store.commit('updateId', '')
                        this.$store.commit('updateUserIcon', '')
                        this.$router.push({path:"/login"})
                    }
                })
            }else{
                this.dataForm.orderId= '',
                this.dataForm.room='',
                this.dataForm.orderUserPhone= '',
                this.dataForm.orderUserMail= '',
                this.dataForm.orderUserNumber= '',
                this.dataForm.orderCheckTime= '',
                this.dataForm.orderEndTime= '',
                this.dataForm.orderPrice= '',
                this.dataForm.orderStatus= '',
                this.dataForm.orderNum=''
            }
        },
        payOrder(){
            //localStorage.setItem("store",JSON.stringify(this.$store.state))
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
            this.$http({
                url: this.$http.adornUrl(`/order/ailpay`),
                method: 'post',
                data: this.$http.adornData({
                    'orderId': this.dataForm.orderId,                    
                    'orderPrice': this.dataForm.orderPrice,
                    'orderNum': this.dataForm.orderNum
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    localStorage.setItem("orderId",this.dataForm.orderId)
                    let formData = data.form
                    this.$router.push({
                        path:"/pay",
                        query:{
                             formData:formData,
                        }
                    })                    
                }else{
                    this.$message.error('支付失败')
                    this.$router.push({path:"/login"})
                }
            })
        },
        toUserOrder(){
            this.$router.push({path:"/user_order"}) 
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