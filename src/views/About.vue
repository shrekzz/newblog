<template>
    <div>
        <nav-header></nav-header>
        
            <el-col :span="5" :xs="{span:0}">
                <nav-aside></nav-aside>
            </el-col>
            <el-col>
                <h2>关于博客</h2>
                <p>&emsp;&emsp;本博客主要分享Node.js和前端技术，希望和大家共同成长。</p>
           </el-col>
   
        <nav-footer></nav-footer>
    </div>
</template>
<script>

    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavAside from '@/components/NavAside.vue'

    export default {
        components: {
            NavHeader,
            NavAside,
            NavFooter
        }
}
</script>