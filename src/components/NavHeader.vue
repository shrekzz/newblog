<template>
    <header>
		<div class="fixed">
			<el-row>
				<el-col :span="22" :xs="{span:19}">
					<el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal"  >
						<el-menu-item index="/">首页</el-menu-item>
						<el-menu-item index="/myarticle" v-show="user != null">我的文章</el-menu-item>
						<el-menu-item index="/about">关于博客</el-menu-item>
						
					</el-menu>
				</el-col>
				<el-col :span="2" :xs="{span:5}">
					<el-menu class="el-menu-demo" router mode="horizontal" active-text-color="#fff">
                        <el-menu-item index="/" v-if="user != null&&screenWidth > 768"  @click="Logout">
                            <span slot="title">退出博客</span>
                        </el-menu-item>
                        <el-menu-item index="/login" v-if="user == null&&screenWidth > 768">
                            <span slot="title">登录博客</span>
                        </el-menu-item>
                        <el-submenu index="m" v-show="screenWidth < 768">
                            <!-- <span slot="title"><i class="el-icon-menu"></i></span> -->
                            <template slot="title"><el-avatar :src="avatarUrl"></el-avatar></template>
                            <el-menu-item-group>
                                
                                <el-menu-item  index="/edit"><span>写博客</span></el-menu-item>
                                <el-menu-item  index="/homepage">个人中心</el-menu-item>
                                <el-menu-item  index="/draft">草稿箱</el-menu-item>
                                <el-menu-item  index="/" v-if="user != null"  @click="Logout">
                                    <span slot="title">退出博客</span>
                                </el-menu-item>
                                <el-menu-item  index="/login" v-if="user == null">
                                    <span slot="title">登录博客</span>
                                </el-menu-item> 
                            </el-menu-item-group>
                        </el-submenu>
					</el-menu>
				</el-col>
			</el-row>
		</div>
		<div class="empty"></div>
	</header>
</template>
<script>
import axios from "axios";
export default {
    data(){
        return{
            activeIndex: '/',
            screenWidth: document.body.clientWidth
        }
    },
    computed:{
        user () {
            return this.$store.state.user;
        },
        avatarUrl(){
            return this.$store.state.avatarUrl
        }
    },
    mounted(){
        this.setrouter();
        this.checklogin();
        const that = this
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }
    },
    watch:{
        screenWidth(val){
            // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
            if(!this.timer){
                // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
                this.screenWidth = val
                this.timer = true
                let that = this
                setTimeout(function(){
                    // 打印screenWidth变化的值
                    that.timer = false
                },400)
            }
        }
    },
    methods:{
        checklogin(){
            axios.get("/users/checklogin").then(response => {
                let res = response.data;
                if(res.status == 1){
                    this.$store.commit("updateFlag", null);
                    this.$store.commit("updateAvatar", "");
                }
            })
        },
        Logout() {
			axios.post("/users/logout").then(response => {
				let res = response.data;
				if (res.status == 0) {
                    this.$store.commit("updateFlag", null);
                    this.$store.commit("updateAvatar", "");
				}
			});
		},
        setrouter(){
            this.activeIndex = this.$route.path
            
        }
    }
}
</script>