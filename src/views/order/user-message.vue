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
                            <div class="h3 mb-0" style="color:#303133">我的留言</div>
                            <el-divider></el-divider>
                             <el-table
                                :data="dataList"
                                style="width: 100%"
                                :default-sort = "{prop: 'comCreateTime', order: 'descending'}">
                                <el-table-column
                                    prop="mesId"
                                    label="留言号"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                </el-table-column>
                                 <el-table-column
                                    sortable
                                    prop="mesCreateTime"
                                    label="留言时间"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="mesContent"
                                    label="评论内容"
                                    header-align="center"
                                    align="center"
                                    width="200">
                                     <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" :content="scope.row.mesContent" placement="top-start">
                                            <el-button type="text">{{limitWord(scope.row.mesContent)}}</el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="mesStatus"
                                    label="留言状态"
                                    header-align="center"
                                    align="center"
                                    width="120">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.mesStatus==1">未回复</span>
                                        <span v-if="scope.row.mesStatus==2">已回复</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    header-align="center"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="deleteHandle(scope.row.mesId)">删除</el-button>
                                        <el-button  type="text" size="small" @click="messageLook(scope.row.mesId)" v-if="scope.row.mesStatus!=1">查看</el-button>
                                        <el-button  type="text" size="small" @click="messageAdd()" v-if="scope.row.mesStatus!=1">回复</el-button>
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
                            <message-look v-if="lookVisible" ref="messageLook" @refreshDataList="getDataListByUser"></message-look>
                            <message-add v-if="addVisible" ref="messageAdd" @refreshDataList="getDataListByUser"></message-add>
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
import messageLook from './message-look'
import messageAdd from './message-add'

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
            lookVisible:false,
            addVisible: false

        }
    },
    components: {
        MainNavbar,
        messageLook,
        messageAdd
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
                url: this.$http.adornUrl('/manager/message/listByUser'),
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
                }else {
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
            this.$confirm(`确定删除该条留言?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/manager/message/deleteByMesId'),
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
        //查看
        messageLook(id){
            this.lookVisible = true
            this.$nextTick(() => {
            this.$refs.messageLook.init(id)
            })
        },
        messageAdd(){
            this.addVisible = true
            this.$nextTick(() => {
            this.$refs.messageAdd.init()
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