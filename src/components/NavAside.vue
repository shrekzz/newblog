<template>
    <aside>
        <section class="main-aside-avatar">
            <img src="./../assets/images/avatar.jpg" alt="">
        </section>
        <el-row>
            <el-col :span="24">
                <el-menu  class="el-menu-vertical-demo" router background-color="#f0f0f0"> 
                    <el-menu-item index="/">
                        <span slot="title">博客首页</span>
                    </el-menu-item>
                    <el-menu-item index="/edit">
                        <span slot="title">撰写文章</span>
                    </el-menu-item>
                    <el-menu-item index="/about">
                        <span slot="title">关于博客</span>
                    </el-menu-item>
                    <el-menu-item index="/" v-if="flag == true"  @click="logout">
                        <span slot="title">登出博客</span>
                    </el-menu-item>
                    <el-menu-item index="/login" v-if="flag == false">
                        <span slot="title">登录博客</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </aside>
</template>
<script>
export default {
    computed:{
        flag () {
            return this.$store.state.flag;
        }
    },
    methods:{
        logout(){
            this.$store.commit("updateFlag", false);
        }
    }
}
</script>