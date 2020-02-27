<template>
    <header>
        <nav-dialog ref=child></nav-dialog>
		<div class="fixed">
            <div class="head">
                <div class="nav">
                    <router-link class="nav-item" active-class="activeClass" exact to="/" tag="span">首页</router-link>
                    <router-link class="nav-item" active-class="activeClass" to="/myarticle"  tag="span" v-show="user != null">我的文章</router-link>
                    <router-link class="nav-item" active-class="activeClass" to="/about"  tag="span">关于博客</router-link>
                </div>
                <div class="action">
                    <div class="action-item" style="width:180px;"><el-input placeholder="搜索" v-model="query"><el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input></div>
                    <router-link class="action-item" to="/edit" tag="div">写文章</router-link> 
                    <div class="action-item" v-if="user == null"><span @click="opendialog">|&emsp;登录</span> · <span @click="openRegist">注册</span></div>
                    <el-popover
                        trigger="click"
                        visible-arrow:false
                    >
                        <div>
                            <router-link tag="div" class="user" to="/edit" >&emsp;写文章</router-link>
                            <router-link tag="div" class="user" to="/draft" >&emsp;草稿</router-link>
                            <router-link tag="div" class="user" :to="{ path: `/user/${userID}` }" >&emsp;我的主页</router-link>
                            <router-link tag="div" class="user" :to="{ path: `/user/${userID}/likes` }"  >&emsp;我赞过的</router-link> 
                            <router-link tag="div" class="user" to="/settings"  >&emsp;设置</router-link> 
                            <div class="user" @click="Logout">&emsp;退出</div>
                        </div>
                        <el-avatar slot="reference"  :src="avatarUrl" v-if="user !== null" />
                    </el-popover>
                </div>
            </div>
		</div>
		<div class="empty"></div>
	</header>
    
</template>
<script>
import NavDialog from "@/components/NavDialog"

export default {
    components:{
        NavDialog,
        
    },

    data(){
        return{
            activeIndex: '/',
            screenWidth: document.body.clientWidth,
            loginStatus: 'login',
            query: ''
        }
    },
    computed:{
        user () {
            return this.$store.state.user
        },
        userID (){
            return this.$store.state.userID
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
            let param = {token:localStorage.getItem('token')}
            axios.get("/users/checklogin",{
                params: param
            }).then(response => {
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
                    this.$store.commit("setUserID", "")
                    this.$store.commit("setFollowersFans",{ followers: [] , fans: [] })
                    localStorage.removeItem('token')
                    this.$router.go(0);
				}
			});
		},
        setrouter(){
            this.activeIndex = this.$route.path
            
        },
        openDialog() {
            this.$emit('open')
        },
        opendialog(){
			this.$refs.child.loginStatus = 'login'
			this.$store.commit('showDialog',true) 
        },
        openRegist(){
			this.$refs.child.loginStatus = 'regist'
			this.$store.commit('showDialog',true) 
        },
		closeDialog(){
			//关闭后清空表单和验证
			if(this.$refs.regist.$refs.loginFormData){
			    
				this.$refs.regist.$refs.loginFormData.resetFields();
				this.$refs.regist.$refs.loginFormData.clearValidate()
				
			}    
			this.$store.commit('showDialog',false)
        },
        search(){
            this.$router.push({ path: '/search', query: { query: this.query }})
        },
        tolikes(){
            this.$router.push( {path:  `/user/${this.$store.state.userID}/likes`, params: { userid: this.$store.state.userID }})
        }
    }
}
</script>
<style lang="scss">
.user {
    margin: 0 auto;
    font-size: 15px;
    line-height: 30px;
    cursor: pointer;
    &:hover{
        background-color: #f3f3f3;
    }    
}  

.activeClass{
    color: #409EFF!important;
}
.head{
    display: flex;
    margin: 0 auto;
    max-width: 960px;
    width: 100%;
    justify-content: space-between;
    
    .nav{
        align-items: center;
        display: flex;
        margin-left: 10px;
    
        .nav-item{
            display: block;
            margin-right: 10px; 
            color: #909399;
            cursor: pointer;
            &:hover{
                color: #409EFF;
            }
            
        }
        
    }
    .action{
        display: flex;
        margin-right: 10px;
        align-items: center;
        justify-content: flex-end;
        flex-direction: row;
        .action-item{
            cursor: pointer;
            color: #409EFF;
            margin: 0 10px; 
        }
        
        
        
    }
      
}
</style>