<template>
    <div>
        <nav-header></nav-header>
        
            <el-col :span="5" :xs="{span:0}">
                <nav-aside></nav-aside>
            </el-col>
            <el-col :span="19" :xs="{span:24}" >
                <el-card class="box-card">
                    <h2>关于博客</h2>
                    <p>&emsp;&emsp;本博客主要分享Node.js和前端技术，希望和大家共同成长。</p>
                    <p>GitHub地址：<el-link type="primary">https://github.com/shrekzz/</el-link></p>
                </el-card>
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