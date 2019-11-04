<template>
    <header>
		<div class="fixed">
			<el-row>
				<el-col :span="22">
					<el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal"  >
						<el-menu-item index="/">首页</el-menu-item>
						<el-menu-item index="/myarticle" v-show="user != null">我的文章</el-menu-item>
						<el-menu-item index="/about">关于博客</el-menu-item>
						
					</el-menu>
				</el-col>
				<el-col :span="2">
					<el-menu class="el-menu-demo" router mode="horizontal" >
                        <el-menu-item index="/" v-if="user != null"  @click="Logout">
                            <span slot="title">登出博客</span>
                        </el-menu-item>
                        <el-menu-item index="/login" v-if="user == null">
                            <span slot="title">登录博客</span>
                        </el-menu-item>
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
            activeIndex: '/'
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
