<template>
    <div>
        <main-navbar/>
        <!-- 布局 -->
        <div style=" margin-top: 140px;">
            <b-container class="bv-example-row" >
                <b-row >
                    <b-col cols="10"></b-col>
                    <b-col cols="10">
                        <div>
                            <!-- 房间名及价格 -->
                            <div>
                                <span class="h3 mb-0">{{dataForm.roomName}}</span>
                                <span style="float:right;">
                                    <span style="">库存数:{{dataForm.roomStock-dataForm.roomSurplus}}</span>
                                    <span style="color:orange">¥</span>
                                    <span class="h3" style="color:orange">{{dataForm.roomPrice}}</span>
                                </span>
                            </div>
                            <!-- 房间评分 -->
                            <div style="width:1000px;margin-top:20px">
                                <!-- 点赞及收藏按钮 -->
                                <span><b-button pill variant="primary"><b-icon icon="heart"></b-icon>总销量:{{dataForm.roomSales}}</b-button></span>
                                <span style="padding-left:25px">
                                    <b-button pill variant="success" @click="addCollect()">
                                        <b-icon icon="star" v-if="this.collectStatus==0"></b-icon>
                                        <b-icon icon="star-fill" v-else></b-icon>
                                        收藏数:{{dataForm.roomLike}}
                                    </b-button>
                                </span>

                                <el-rate
                                v-model="value"
                                disabled
                                show-score
                                text-color="#ff9900"
                                score-template="{value}"
                                style="float:right;padding-right:80px">
                                </el-rate>
                            </div>
                            <!-- 房间图片 -->
                            <el-carousel :interval="5000" arrow="always" class="carousel-text">
                                <el-carousel-item v-for="item in fileList" :key="item.index" style=" height: 400px">
                                    <el-image
                                    :src="item.url"
                                    fit="fill"
                                    style="width: 920px;height: 400px"
                                    >
                                    </el-image>
                                </el-carousel-item>
                            </el-carousel>
                            <hr>
                            <div>
                                <h3 style="font-weight:bold" >房间描述</h3>
                                <!-- 房间描述 -->
                                <b-form-textarea class="roomTextStyle"  id="textarea-plaintext" plaintext :value="dataForm.roomInformation"></b-form-textarea>
                            </div>
                            <hr>
                            
                            <div>
                                <h3 style="font-weight:bold">配套设施</h3>
                                <!-- 配套设备 -->
                                <div v-for="cate in equipList" :key="cate.cateId" :class="cate.cateId==1?'':'equipStyle'">
                                    <div>
                                        <h5>{{cate.cateName}}</h5>
                                    </div>
                                    <b-container class="bv-example-row" >
                                        <b-row cols="6">
                                            <b-col style="margin-top: 15px;" v-for="equip in checkedEquip" :key="equip.equipId" v-if="equip.equipCateId==cate.cateId">
                                                <div>
                                                    <div> 
                                                    <span :class="geticonUrl(equip.iconId)" style="color:#bfbfbf;width:23px"></span>
                                                    <span style=" color:#bfbfbf">{{equip.equipName}}</span></div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </div>
                            </div>
                            <hr>

                            <div>
                                <h3 style="font-weight:bold">房间评价</h3>
                                <div style="margin-top:20px">
                                    <span class="roomGrade">{{value}}</span>
                                    <span style="font-weight:bold;color:#fa9a09">{{evaluation}}</span>
                                    <span style="padding-left:40px">共有{{totalPage}}条评论</span>
                                </div>
                                <div v-for="comment in commentList" :key="comment.comId">
                                    <hr>
                                    <div>
                                        <el-avatar :src="transformImage(comment.user.userPhoto)"></el-avatar>
                                        <span>{{comment.user.userUsername}}</span>
                                        <span style="float:right">{{comment.comCreateTime}}</span>
                                        <span style="padding-left:40px;font-weight:bold;color:#fa9a09">{{comment.comGrade}}</span>
                                    </div>
                                    <div style="margin-top:20px">{{comment.comContent}}</div>
                                    <div style="margin-top:20px; background-color:azure;padding-left:10px" v-if="comment.comReplyContent!=null">
                                        房东回复：{{comment.comReplyContent}}
                                    </div>
                                    
                                </div>
                                <hr>
                                 <div style="margin-left: 40%; margin-top: 15px; ">
                                    <el-pagination
                                    @size-change="sizeChangeHandle"
                                    @current-change="currentChangeHandle"
                                    :current-page="pageIndex"
                                    :page-size="pageSize"
                                    :total="totalPage"
                                    layout="total, prev, pager, next"
                                    style="">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col >
                        <b-card  class="text-center cardStyle">
                            <b-card-text>
                                <el-date-picker
                                    v-model="mesCreateTime"
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
                                 <el-button icon="el-icon-shopping-cart-2" style="margin-top:30px;width:320px" type="warning" @click="toMakeOrder()">预订房间</el-button>
                            </b-card-text>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>

</template>

<script>
import MainNavbar from './main-navbar.vue'
import logo from '../assets/images/gallery/2.jpg'
import axios from 'axios'
export default {
    data(){
        return{
            dataForm: {
                roomId: 0,
                roomName: '',
                roomPrice:'',
                roomStatus:'',
                roomStock:'',
                roomInformation:'',
                roomGrade:'',
                roomType:'',
                roomPhoto:'',
                roomLike:'',
                roomSales:'',
                roomSurplus:''
            },
            images:[
                {id:1,url:logo},
                {id:2,url:logo},
                {id:3,url:logo},
                {id:4,url:logo},

            ],
            fileList:[],
            checkedEquip:[],
            value:0,
            equipList:[],
            commentList:[],
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
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
                    }, 
                    ]
                },
                mesCreateTime:[],
                collectStatus:0

        }
    },
    computed: {
        evaluation: function(){
            if(this.value>4.0){
                return '惊喜';
            }
            else if(this.value>3.0){
                return '满意'
            }
            else if(this.value>3.0){
                return '一般'
            }
            else if(this.value>3.0){
                return '失望'
            }
            else {
                return '极差'
            }
        },
        roomId: {
            get () { return this.$store.state.roomId }
        },
        userId: {
            get () { return this.$store.state.id }
        }
    },
    components: {
        MainNavbar
    },
    created (){
        this.collectStatus=0
        this.getRoomInfo(this.roomId)
        const newInstance=axios.create({
            baseURL:'http://localhost:8080/data/iconfont.json',
            headers: {'Content-type': 'multipart/form-data'}
        });
        newInstance.get('./../../static/data/iconfont.json').then(res=>{
            
        })
    },
    methods: {
        geticonUrl(fontClass){
            
            return 'iconfont icon'+fontClass;;
        },
        handleOpen(key, keyPath) {
        console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        getRoomInfo(roomId){
            this.$http({
                url: this.$http.adornUrl(`/room/getOneRoom/${roomId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataForm.roomName = data.room.roomName
                    this.dataForm.roomPrice = data.room.roomPrice
                    this.dataForm.roomStatus = data.room.roomStatus
                    this.dataForm.roomStock = data.room.roomStock
                    this.dataForm.roomSurplus = data.room.roomSurplus
                    this.dataForm.roomInformation = data.room.roomInformation
                    this.dataForm.roomGrade = data.room.roomGrade
                    this.dataForm.roomType = data.room.roomType
                    this.dataForm.roomLike = data.room.roomLike
                    this.dataForm.roomSales = data.room.roomSales
                    this.dataForm.roomPhoto = data.room.roomPhoto
                    this.value=data.room.roomGrade
                    this.checkedEquip=[]
                    for (let i in data.equip) {
                        this.checkedEquip.push(data.equip[i])
                    }
                    let photo=data.room.roomPhoto.split(',')
                    for (let key in photo) {
                        this.fileList.push({url:this.$http.adornUrl(photo[key])})
                    }
                    this.getAllEquipCate();
                    this.getAllComment(roomId);
                    if (this.userId!='') {
                        this.getCollectStatus();
                    }
                }
            })

        },
        getAllEquipCate(){
            this.$http({
                url: this.$http.adornUrl('/room/getAllEquipCate'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.equipList = data.equipcate
                } else {
                    this.equipList = []
                }
            })
        
        },

        // 判断用户是否收藏该房间
        getCollectStatus(){
            this.$http({
                url: this.$http.adornUrl('/room/getCollectStatus'),
                method: 'post',
                data: this.$http.adornData({
                    'colUser': this.userId,
                    'colRoom': this.roomId
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.collectStatus = data.status
                } else {
                    this.collectStatus = 0

                }
            })
        
        },
        //新增收藏
        addCollect(){
            if (this.collectStatus == 1) {
                this.$message.error('您已收藏过了请勿重复收藏')
                return false;
            }
            this.$http({
                url: this.$http.adornUrl('/room/addCollect'),
                method: 'post',
                data: this.$http.adornData({
                    'colUser': this.userId,
                    'colRoom': this.roomId
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.collectStatus = 1
                    this.getRoomInfo(this.roomId)
                } else {
                    
                    this.collectStatus = 0
                }
            })
        
        },
        getAllComment(roomId){
            this.$http({
                url: this.$http.adornUrl('/room/getAllComment'),
                method: 'get',
                params: this.$http.adornParams({
                    'comRoom': roomId,
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                
                    this.commentList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.commentList = []
                    this.totalPage = 0
                }
            })
        },
        transformImage(value){
            console.log(value);
            return this.$http.adornUrl(value)
        },
        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        toMakeOrder(){
            if (this.dataForm.roomStatus==2) {
                this.$message.error('该房间已满')
                this.$router.push({path:"/index"})
            }else{
                this.$store.commit('updateOrderRoom', this.roomId)
                this.$router.push({
                    path:"/order_make",
                    query:{
                        mesCreateTime:this.mesCreateTime,
                    }
                })
            }
        }
    }

}
</script>

<style>
    .carousel-text{
        height: 400px;
        width: 920px;
        margin-top: 50px;
       
       
    }
    .roomTextStyle{
        height: 100px;
        width: 920px;
        font-size: 18px;
        color: #262729;
        border:solid 1px  #5a5c5f;
        resize:none;
        text-indent: 2em;
        
    }
    .equipStyle{
        
        margin-top: 20px;   
    }
    .roomGrade{
        font-size:40px;
        font-weight:bold;
        color: #bafa09;
    }
    .cardStyle{
        position:fixed;
        margin-top: 140px;
    }
    
</style>