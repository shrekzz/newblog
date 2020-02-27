<template>
<div>
    <nav-header />
        <div class="row">
            <el-col :span="18" :xs="{ span: 24 }">
                <el-card class="box-card" style="margin:10px;min-height:50vh">
                    <h2>关于博客</h2>
                    <div>
                        本博客主要分享Node.js和前端技术，希望和大家共同成长。
                    </div>
                    <div style="margin-top:10px">
                        GitHub地址：<el-link href="https://github.com/shrekzz/" target="_blank" type="primary"
                            >https://github.com/shrekzz/</el-link
                        >
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6" :xs="{ span: 0 }" v-if="this.$store.state.user">
                <nav-aside></nav-aside>
            </el-col>
        </div>
    <nav-footer />
    </div>
</template>
<script>
import NavAside from "@/components/NavAside.vue";
export default {
    components: {
        NavAside,
    }
};
</script>
