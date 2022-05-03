<template>
    <div>
        <main-navbar/>
        <div style=" margin-top: 140px; ">
            <b-container class="bv-example-row" >
                <b-row class="text-center">
                    <!-- <b-col></b-col> -->
                    <b-col cols="8">

                        <div>
                            <div class="h3 mb-0" style="color:#303133">订单填写</div>
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
                            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
                            <div>
                                <div class="h4 mb-0" style="text-align:left">入住信息</div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <span class="wordTitleStyle">房间名:</span><span class="worldContentStyle">{{dataForm.roomName}}</span>
                                    <span style="float:right;font-size:18px;">{{dataForm.roomType}}人间</span>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">  
                                    <el-form-item  label="入住人数" prop="userNum">
                                        <el-input-number v-model="dataForm.userNum" @change="handleUserNumChange" :min="1" :max="(dataForm.roomStock-dataForm.roomSurplus)*2" label="入住人数"></el-input-number>
                                    </el-form-item>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <el-form-item label="预订房间数" prop="orderNum">
                                        <el-input-number v-model="dataForm.orderNum" @change="handleRoomChange" :min="1" :max="dataForm.roomStock-dataForm.roomSurplus" label="预订房间数"></el-input-number>
                                    </el-form-item>
                                </div>
                               
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">剩余房间数:</span><span class="worldContentStyle">{{dataForm.roomStock-dataForm.roomSurplus}}</span>
                                </div>
                                 <div class="diaStyle" style="margin-top:10px;">
                                    <el-form-item label="入离日期" prop="mesCreateTime">
                                        <el-date-picker
                                        @change="selectData()"
                                        v-model="dataForm.mesCreateTime"
                                        type="daterange"
                                        align="right"
                                        unlink-panels
                                        range-separator="-"
                                        start-placeholder="入住日期"
                                        end-placeholder="退房日期"
                                        :picker-options="pickerOptions"
                                        value-format="yyyy-MM-dd"
                                        style="width:320px">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <span class="wordTitleStyle">价格:</span><span class="worldContentStyle" style="color:coral">￥{{dataForm.roomPrice}}</span>
                                </div>
                            </div>
                            <el-divider></el-divider>
                             <div>
                                <div class="h4 mb-0" style="text-align:left">联系信息</div>
                                <div class="diaStyle" style="margin-top:20px;">
                                    <el-form-item label="手机号码" prop="userPhone">
                                        <el-input
                                            placeholder="请输入手机号码"
                                            suffix-icon="el-icon-phone-outline"
                                            v-model="dataForm.userPhone"
                                            style="width:200px;">
                                        </el-input>
                                    </el-form-item>
                                </div>
                                <div class="diaStyle" style="margin-top:10px;">
                                    <el-form-item label="邮箱" prop="userEmail">
                                        <el-input
                                            placeholder="请输入邮箱"
                                            suffix-icon="el-icon-s-promotion"
                                            v-model="dataForm.userEmail"
                                            style="width:200px;">
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <el-divider></el-divider>
                            <span>
                                <el-button @click="toBack()">返回</el-button>
                                <el-button type="primary" @click="dataFormSubmit()">下一步</el-button>
                            </span>
                            </el-form>
                            
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
                mesCreateTime:[
                ],
                userPhone:'',
                userEmail:'',
                roomId: 0,
                roomName: '',
                roomPrice:'',
                roomStatus:'',
                roomStock:'',
                roomType:'',
                roomSurplus:''
            },
            dataRule: {
                userNum: [
                    { required: true, message: '请选择入住人数', trigger: 'blur' }  
                ],
                orderNum:[{
                    required: true, message: '请选择预订房间数', trigger: 'blur'
                }],
                
                mesCreateTime:[{
                    required: true, message: '请选择入离日期', trigger: 'blur'
                }],
                userPhone:[
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator:validPhone,trigger: 'blur'}
                ],
                userEmail:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator:validUserEmail,trigger: 'blur'}

                ]
            },
            price:''

        }
    },
    computed: {
        roomId: {
            get () { return this.$store.state.orderRoom }
        },
        userPhone: {
            get () { return this.$store.state.userPhone }
        },
        userEmail:{
            get () { return this.$store.state.userEmail }
        },
        userId:{
            get () { return this.$store.state.id }
        }
    },
    created(){
        if (this.roomId!='') {
            this.dataForm.mesCreateTime = this.$route.query.mesCreateTime
            this.dataForm.userEmail = this.userEmail
            this.dataForm.userPhone = this.userPhone
            this.getData();
        
        }
        else{
            this.$router.push({path:"/index"})
        }
    },
    components: {
        MainNavbar
    },
    methods:{
        handleUserNumChange(value){
            if (value%this.roomType!=0&&value>this.roomType) {
                this.dataForm.orderNum=(value+1)/this.roomType
            }else{
                this.dataForm.orderNum=value/this.roomType
            }
            let iDays=this.datedifference(this.dataForm.mesCreateTime[0],this.dataForm.mesCreateTime[1])
            this.dataForm.roomPrice=Math.floor(this.price*this.dataForm.orderNum*iDays)
        },
        handleRoomChange(value){
            if(value>this.dataForm.userNum){
                this.dataForm.userNum=value
            }
            if (value<this.dataForm.userNum) {
                if (value*this.roomType<this.dataForm.userNum) {
                    this.dataForm.userNum=value*this.roomType
                }
            }
            let iDays=this.datedifference(this.dataForm.mesCreateTime[0],this.dataForm.mesCreateTime[1])
            this.dataForm.roomPrice=Math.floor(this.price*value*iDays)

        },
        datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式 
            var dateSpan,tempDate,iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        },
        dataFormSubmit(){
            this.$refs['dataForm'].validate((valid) => {
                if(valid){
                    this.$http({
                        url: this.$http.adornUrl(`/manager/order/addOrder`),
                        method: 'post',
                        data: this.$http.adornData({
                            'orderRoom': this.dataForm.roomId,
                            'orderUserNumber': this.dataForm.userNum,
                            'orderCheckTime': this.dataForm.mesCreateTime[0],
                            'orderEndTime': this.dataForm.mesCreateTime[1],
                            'orderUserPhone': this.dataForm.userPhone,
                            'orderUserMail': this.dataForm.userEmail,
                            'orderPrice': this.dataForm.roomPrice,
                            'orderUser': this.userId,
                            'orderNum': this.dataForm.orderNum
                        })
                    }).then(({data}) => {
                        if (data && data.code === 0) {
                            let orderId=data.orderId
                            this.$message({
                                message: '生成成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false
                                }
                            })
                            this.$router.replace({
                                path:"/order_main",
                                query:{
                                    orderId:orderId,
                                }
                            })
                        }else{
                        }
                    })

                }
            })
        },
        getData(){
            this.getRoomData()
            
        },
        getRoomData(){
            this.dataForm.roomId=this.roomId;
            if (this.dataForm.roomId) {
                    this.$http({
                    url: this.$http.adornUrl(`/manager/room/getRoomById/${this.dataForm.roomId}`),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.dataForm.roomName = data.room.roomName
                        this.dataForm.roomPrice = data.room.roomPrice
                        this.dataForm.roomStatus = data.room.roomStatus
                        this.dataForm.roomStock = data.room.roomStock
                        this.dataForm.roomSurplus = data.room.roomSurplus
                        this.dataForm.roomType = data.room.roomType
                        this.price = data.room.roomPrice
                        let iDays=this.datedifference(this.dataForm.mesCreateTime[0],this.dataForm.mesCreateTime[1])
                        this.dataForm.roomPrice=Math.floor(this.price*this.dataForm.orderNum*iDays)
                    }else{
                        this.$message.error('请先登录')
                        this.$store.commit('updateName', '')
                        this.$store.commit('updateId', '')
                        this.$store.commit('updateUserIcon', '')
                        this.$router.push({path:"/login"})
                    }
                })
            }else{
                this.dataForm.roomId=0
                this.dataForm.roomName = ''
                this.dataForm.roomSurplus = ''
                this.dataForm.roomPrice = ''
                this.dataForm.roomStatus = ''
                this.dataForm.roomStock = ''
                this.dataForm.roomType = ''
                this.price = ''
            }
        },
        toBack(){
            this.$router.go(-1)
        },
        selectData(){
            let iDays=this.datedifference(this.dataForm.mesCreateTime[0],this.dataForm.mesCreateTime[1])
            this.dataForm.roomPrice=Math.floor(this.price*this.dataForm.orderNum*iDays)
        }
    }
    
}
</script>

<style>
    .worldContentStyle{
        
        margin-left: 15px;

    }
    .diaStyle{
        text-align:left;
        
        padding-left:30px;
    }
</style>