<template>
    <div>支付成功</div>
</template>

<script>
export default {
    data(){
        return{
            orderId:''
        }
    },
    created(){
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
        this.orderId = localStorage.getItem("orderId")
        console.log(this.orderId);
        this.payOrderSuccess();
    },
    methods:{
        payOrderSuccess(){
            if (this.orderId) {
                this.$http({
                url: this.$http.adornUrl(`/manager/order/payOrderSuccess/${this.orderId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message({
                        message: '支付成功',
                        type: 'success',
                        onClose: () => {
                            this.$router.push({path:"/user_order"})
                        }
                    })
                }else{
                    this.$message.error('支付失败')
                    this.$router.push({path:"/index"})
                }
            })
            }
        }
    }
}
</script>

<style>

</style>