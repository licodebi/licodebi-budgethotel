<template>
    <div>
        <main-navbar/>
        <div style=" margin-top: 140px; ">
            <b-container class="bv-example-row" >
                <b-row class="text-center">
                    <b-col>
                    </b-col>
                    <b-col cols="12">
                        <div>
                            <div class="h3 mb-0" style="color:#303133">我的收藏</div>
                            <el-divider></el-divider>
                             <el-table
                                :data="dataList"
                                style="width: 100%"
                                >
                                <el-table-column
                                    prop="colId"
                                    label="收藏ID"
                                    header-align="center"
                                    align="center"
                                    width="220">
                                </el-table-column>
                                 <el-table-column
                                    sortable
                                    prop="room.roomName"
                                    label="收藏房间名"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="lookRoom(scope.row.room.roomId)">{{scope.row.room.roomName}}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="room.roomName"
                                    label="收藏房间"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="room.roomInformation"
                                    label="房间信息"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                    <template slot-scope="scope">
                                         <span>{{limitWord(scope.row.room.roomInformation)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    header-align="center"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="deleteHandle(scope.row.colId)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-divider></el-divider>
                            <span>
                                <el-pagination
                                @size-change="sizeChangeHandle"
                                @current-change="currentChangeHandle"
                                :current-page="pageIndex"
                                :page-size="pageSize"
                                :total="totalPage"
                                layout="total, prev, pager, next"
                                style="">
                                </el-pagination>
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
        return {
            operateStatus:0,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0

        }
    },
    components: {
        MainNavbar
    },
    computed: {
        userId: {
            get () { return this.$store.state.id }
        }
    },
    created(){
       
        this.getDataListByUser(this.userId)
       
           
    },
    methods:{
        // 每页数
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataListByUser()
        },
        // 当前页
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataListByUser()
        },
        
        // 获取数据列表
        getDataListByUser(userId) {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manager/collect/listByUser'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'userId':userId
                })
                }).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.$message.error('请先登录')
                    this.dataList = []
                    this.totalPage = 0
                    this.$store.commit('updateName', '')
                    this.$store.commit('updateId', '')
                    this.$store.commit('updateUserIcon', '')
                    this.$router.push({path:"/login"})
                }
                this.dataListLoading = false
            }).catch(e=>e)
        },
        //限制字数
        limitWord(value){
            if (value.length>=12) {
                return value=value.slice(0,11)+"......"
            }
            return value
        },
        lookRoom(roomId){
            this.$store.commit('updateRoomId', roomId)
            this.$router.push({path:"/room"})
        },
           
         //删除   
        deleteHandle (id) {
            this.$confirm(`确定删除该条收藏?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/manager/collect/deleteByColId'),
                method: 'post',
                data: this.$http.adornData(id, false)
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                            this.getDataListByUser(this.userId)
                    }
                    })
                } else {
                    this.$message.error(data.msg)
                }
                })
            }).catch(() => {})
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