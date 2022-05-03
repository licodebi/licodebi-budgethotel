<template>
    <div style="background-color:#FEF8F8">
        <main-navbar/>
        <!-- 图片 -->
        <div>
            <div class="image-layer" >
               <h1 class="image-text">Special Offers</h1>
            </div>
             
        </div>
        <!-- 简介 -->
        <div style=" margin-top: 40px; ">
            <b-container class="bv-example-row" >
            <b-row class="text-center">
                <b-col></b-col>
                <b-col cols="10">
                    <div>
                        <div class="h3 mb-0" style="color:#303133">关于酒店</div>
                        <p class="content-style">本酒店提供一个高效、简单、温情的酒店预订平台，满足从高端到平价、商务与休闲的多元化需求，为所有的会员提供住宿预订服务，是您聪明、温暖、长情的出行伴侣。</p>
                        <hr>
                    </div>
                </b-col>
                <b-col></b-col>
            </b-row>
            </b-container>
        </div>
        <!-- 新闻 -->
        <div style=" margin-top: 40px; ">
            <b-container class="bv-example-row" >
            <b-row class="text-center">
                <b-col></b-col>
                <b-col cols="10">
                    <div>
                        <div class="h4 mb-0" style="color:#303133">新闻公告</div>
                    
                            <el-collapse v-model="activeNames" @change="handleChange" >
                                <el-collapse-item v-for="(news,index) in newsList" :key="news.newsId" :name=index+1 >
                                    <template slot="title">
                                    {{limitWord(news.newsTitle)}}<i class="header-icon el-icon-info"></i>
                                    <span style="margin-left:50px">{{news.newsCreateTime}}</span>
                                    </template>
                                    <div style="font-size:15px">{{news.newsContent}}</div>
                                </el-collapse-item>
                            </el-collapse>
                            <div style=" margin-top: 15px; ">
                                <el-pagination
                                @size-change="sizeNewsChangeHandle"
                                @current-change="currentNewsChangeHandle"
                                :current-page="newsPageIndex"
                                :page-size="newsPageSize"
                                :total="newsTotalPage"
                                layout="total, prev, pager, next"
                                style="">
                                </el-pagination>
                            </div>
                        <hr>
                    </div>
                </b-col>
                <b-col></b-col>
            </b-row>
            </b-container>
        </div>
        <!-- 商品卡片 -->
        <div style=" margin-top: 40px; background-color:#F8F6F7">
            <b-container class="bv-example-row" >
                <b-row class="text-center">
                    <b-col></b-col>
                    <b-col cols="12">
                        <div>
                            <div class="h4 mb-0" style="color:#303133">房间简介</div>        
                        </div>
                        <b-container class="bv-example-row" >
                            <b-row cols="3">
                                <b-col style="margin-top: 15px;" v-for="room in dataList" :key="room.roomId" >
                                    <div >
                                         <el-card :body-style="{ padding: '10px' }" >
                                            <img :src="room.roomPhoto" class="roomImage">
                                            <div style="padding: 14px;">
                                                <span class="h5">{{room.roomName}}</span>
                                                <div>
                                                    <div>
                                                        <span>{{room.roomInformation.length>16?room.roomInformation.slice(0,15)+'......':room.roomInformation}}</span>
                                                    </div>
                                                    <el-button style="float:left" type="text" class="button" @click="lookRoom(room.roomId)">查看</el-button>
                                                    <span style="float:right;color:orange">￥{{ room.roomPrice }}</span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-container>
                        <div style=" margin-top: 15px; ">
                            
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
                        <hr>
                    </b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
        </div>
        
    </div>
</template>

<script>

import MainNavbar from './main-navbar.vue'
export default {
    data(){
        return{
            dataList:[
            ],
            rows: 100,
            // perPage: 1,
            // currentPage: 5,
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            newsPageIndex: 1,
            newsPageSize: 5,
            newsTotalPage: 0,
            newsList:[],
            activeNames: ['1']
        }
    },
    components:{
        MainNavbar
       
    },
    computed:{
        
    },
    created(){
        this.getDataList();
        this.getNews();
    },
    methods: {
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
        // 每页数
        sizeNewsChangeHandle (val) {
            this.newsPageSize = val
            this.newsPageIndex = 1
            this.getNews()
        },
        // 当前页
        currentNewsChangeHandle (val) {
            this.newsPageIndex = val
            this.getNews()
        },
        // 获取数据列表
        getDataList () {
            this.$http({
            url: this.$http.adornUrl('/room/getList'),
            method: 'get',
            params: this.$http.adornParams({
                'page': this.pageIndex,
                'limit': this.pageSize            
            })
            }).then(({data}) => {
            if (data && data.code === 0) {

                this.dataList = data.page.list
                this.totalPage = data.page.totalCount
            } else {
                this.dataList = []
                this.totalPage = 0
            }
            this.dataListLoading = false
            })
        },
        getNews (){
            this.$http({
            url: this.$http.adornUrl('/news/list'),
            method: 'get',
            params: this.$http.adornParams({
                'page': this.newsPageIndex,
                'limit': this.newsPageSize            
            })
            }).then(({data}) => {
            if (data && data.code === 0) {

                this.newsList = data.page.list
                this.newsTotalPage = data.page.totalCount
                
            } else {
                this.newsList = []
                this.newsTotalPage = 0
            }
            })
        },
        //限制字数
        limitWord(value){
            if (value.length>=16) {
                return value=value.slice(0,15)+"......"
            }
            return value
        },
        lookRoom(roomId){
            this.$store.commit('updateRoomId', roomId)
            this.$router.push({path:"/room"})
        },
        handleChange(val) {
        }

    }
}
</script>

<style >
    .image-layer{
        position:relative;
        background-image: url(../assets/images/background/banner-image-2.jpg);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        width: 100%;
        height: 500px;
        box-shadow: 0 0 5px #000;
    }
    
    .image-text{
        padding-top: 200px;
        position: relative;
        margin-left: 20%;
        color: aliceblue;
        font-size: 80px;
        font-family:"SimSun"
    }
    .content-style{
        /* position:relative; */
        margin-top: 10px;
        color: #909399;
    }
    .roomImage{
        width: 100%;
        height: 220px;
    }
    .collapseStyle{
        background-color:#FEF8F8
    }
   
    .el-collapse .el-collapse-item{
        background-color: #FEF8F8 !important;
        font-size:17px !important;

    }
    .el-collapse-item  .el-collapse-item__header{
        background-color: #FEF8F8 !important;
        font-size:17px !important;
    }
    
    .el-collapse-item  .el-collapse-item__wrap{
        /* background-color: #FEF8F8 !important */
    }
</style>

 