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
                            <div class="h3 mb-0" style="color:#303133">我的订单</div>
                            <el-divider></el-divider>
                             <el-table
                                :data="dataList"
                                style="width: 100%"
                                :default-sort = "{prop: 'orderCreateTime', order: 'descending'}">
                                <el-table-column
                                    prop="orderId"
                                    label="订单号"
                                    header-align="center"
                                    align="center"
                                    width="220">
                                </el-table-column>
                                 <el-table-column
                                    sortable
                                    prop="orderCreateTime"
                                    label="预订时间"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="room.roomName"
                                    label="预订房间名"
                                    header-align="center"
                                    align="center"
                                    width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="orderNum"
                                    label="预订房间数"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="orderStatus"
                                    label="订单状态"
                                    header-align="center"
                                    align="center"
                                    width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.orderStatus==1">未支付</span>
                                        <span v-if="scope.row.orderStatus==2">已支付</span>
                                        <span v-if="scope.row.orderStatus==3">已取消</span>
                                        <span v-if="scope.row.orderStatus==4">已完成</span>
                                        <span v-if="scope.row.orderStatus==5">已评论</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    header-align="center"
                                    align="center"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <el-button  type="text" size="small" @click="orderLook(scope.row.orderId)">查看</el-button>
                                        <el-button  type="text" size="small" @click="deleteOrder(scope.row.orderId)" v-if="scope.row.orderStatus!=1&&scope.row.orderStatus!=2">删除</el-button>
                                        <el-button  type="text" size="small" @click="closeOrder(scope.row.orderId)" v-if="scope.row.orderStatus==1||scope.row.orderStatus==2">取消</el-button>
                                        <el-button  type="text" size="small" @click="payOrder(scope.row.orderId,scope.row.orderPrice,scope.row.orderNum)" v-if="scope.row.orderStatus==1">支付</el-button>
                                        <el-button  type="text" size="small" @click="commentAdd(scope.row.room.roomId,scope.row.orderId)" v-if="scope.row.orderStatus!=5&&scope.row.orderStatus==4">评价</el-button>
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
                            <order-look v-if="lookVisible" ref="orderLook" @refreshDataList="getDataListByUser"></order-look>
                            <comment-add v-if="addVisible" ref="commentAdd" @refreshDataList="getDataListByUser"></comment-add>                                
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
import orderLook from './order-look'
import commentAdd from './comment-add'
export default {
    data (){
        return {
            operateStatus:0,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,           
            lookVisible:false,
            addVisible:false,
        }
    },
    components: {
        MainNavbar,
        orderLook,
        commentAdd
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
            this.dataList = []
            this.totalPage = 0
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/manager/order/listByUser'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'userId':this.userId
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
        deleteOrder(orderId){
            this.$confirm(`确定删除该条订单?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/order/deleteOrder'),
                method: 'post',
                data: this.$http.adornData({'orderId':orderId})
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

        closeOrder(orderId){
            this.$confirm(`确定取消该条订单?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/order/closeOrder'),
                method: 'post',
                data: this.$http.adornData({'orderId':orderId})
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
        completeOrder(orderId){
            this.$confirm(`确定完成该条订单?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http({
                url: this.$http.adornUrl('/order/completeOrder'),
                method: 'post',
                data: this.$http.adornData({'orderId':orderId})
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
        payOrder(orderId,orderPrice,orderNum){
            sessionStorage.setItem("store",JSON.stringify(this.$store.state))
            this.$http({
                url: this.$http.adornUrl(`/order/ailpay`),
                method: 'post',
                data: this.$http.adornData({
                    'orderId': orderId,                    
                    'orderPrice': orderPrice,
                    'orderNum': orderNum
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    localStorage.setItem("orderId",orderId)
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
        //查看
        orderLook(id){
            this.lookVisible = true
            this.$nextTick(() => {
            this.$refs.orderLook.init(id)
            })
        },
        //评价
        commentAdd(roomId,orderId){
            this.addVisible = true
            this.$nextTick(() => {
            this.$refs.commentAdd.init(roomId,orderId)
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