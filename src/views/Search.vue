<template>
<div>
    <nav-header />
    <div class="row">
        <div style="margin:10px">
            <el-card><span class="title-text">搜索结果</span></el-card>
            <no-data v-if="content.length === 0"><span>没有搜到您要的内容~</span></no-data>
            <Content :contentArr="content" />
        </div>
    </div>
    <nav-footer />
</div>
</template>
<script>
import Content from '@/components/Content'
export default {
    components:{
        Content
    },
    data(){
        return {
            content: []
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.axios.post('/users/search',{query:this.$route.query.query}).then(response => {
                let res = response.data
                if(res.status === '1'){
                    this.content = res.result
                   
                }
            })
        }
    },
    watch: {
        '$route' (to, from) { //监听路由是否变化
            if(this.$route.query.query){//判断query是否有值
                this.init()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.title-text{
        font-weight: bold;
        font-size: 18px;
    }
</style>