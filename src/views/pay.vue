<template>
    <div>
        <div v-html="apply"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            formData:'',
            apply: ""
        }
    },
    created(){
        this.formData = this.$route.query.formData
        console.log("我的"+this.formData);
        this.apply = form

    },
    mounted () {
        // 创建支付宝调用页面
        const div = document.createElement('div');
        div.innerHTML = this.$route.query.formData;
        document.body.appendChild(div);
        document.forms[0].submit();
    }
}
</script>

<style>

</style>