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
                            <div class="h3 mb-0" style="color:#303133">我的评论</div>
                            <el-divider></el-divider>
                             <el-table
                                :data="dataList"
                                style="width: 100%"
                                :default-sort = "{prop: 'comCreateTime', order: 'descending'}">
                                <el-table-column
                                    prop="comId"
                                    label="评论号"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                </el-table-column>
                                 <el-table-column
                                    sortable
                                    prop="comCreateTime"
                                    label="评论时间"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="room.roomName"
                                    label="评论房间"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="lookRoom(scope.row.room.roomId)">{{scope.row.room.roomName}}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="comContent"
                                    label="评论内容"
                                    header-align="center"
                                    align="center"
                                    width="200">
                                     <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" :content="scope.row.comContent" placement="top-start">
                                            <el-button type="text">{{limitWord(scope.row.comContent)}}</el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="comGrade"
                                    label="评论分数"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="comStatus"
                                    label="订单状态"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.comStatus==0">未回复</span>
                                        <span v-if="scope.row.comStatus==1">已回复</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    header-align="center"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="commentUpdate(scope.row.comId)">修改</el-button>
                                        <el-button  type="text" size="small" @click="deleteHandle(scope.row.comId)">删除</el-button>
                                        <el-button  type="text" size="small" @click="commentLook(scope.row.comId)">查看</el-button>
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
                        <!-- 弹窗,修改 -->
                        <comment-update v-if="updateVisible" ref="commentUpdate" @refreshDataList="getDataListByUser"></comment-update>
                        <comment-look v-if="lookVisible" ref="commentLook" @refreshDataList="getDataListByUser"></comment-look>
                    </b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import MainNavbar from '../main-navbar.vue'
import commentUpdate from './comment-update'
import commentLook from './comment-look'

export default {
    data (){
        return {
            operateStatus:0,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,           
            dataForm: {
                userId: '',
                userUsername: '',
                userName: '',
                userPhone: '',
                userEmail: '',
                userAddress: '',
                userPhoto: ''
            },
            updateVisible:false,
            lookVisible:false

        }
    },
    components: {
        MainNavbar,
        commentUpdate,
        commentLook
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
                url: this.$http.adornUrl('/manager/comment/listByUser'),
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
            this.$confirm(`确定删除该条评论?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/manager/comment/deleteByComId'),
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
        },
        // 修改
        commentUpdate (id) {
            this.updateVisible = true
            this.$nextTick(() => {
            this.$refs.commentUpdate.init(id)
            })
        },
        commentLook(id){
            this.lookVisible = true
            this.$nextTick(() => {
            this.$refs.commentLook.init(id)
            })
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