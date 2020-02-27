<template>
    <el-dialog title="注册"  :visible="this.dialogFormVisible" class="formmodal" @close="closeDialog" >
        <h3 slot="title">{{loginStatus === 'login' ? '登录' : '注册'}}</h3>
        <register :state="loginStatus" ref="regist" @close="closeDialog"/>
        <el-link type="primary" v-show="loginStatus === 'regist'" @click="loginStatus = 'login'">已有账号登录</el-link>
        <span v-show="loginStatus === 'login'">
            <span class="noaccount">没有账号？</span>
            <el-link type="primary" @click="loginStatus = 'regist'">注册</el-link>
        </span>
	</el-dialog>
</template>
<script>
import Register from "@/components/Register"

export default {
    components:{
        Register,
    },
    data(){
        return {
            loginStatus: 'login'
        }
    },
    computed:{
        dialogFormVisible() {
			return this.$store.state.dialogFormVisible
		}
    },
    methods: {
        opendialog(){
			this.loginStatus = 'login'
			
			this.$store.commit('showDialog',true) 
		},
		closeDialog(){
            //关闭后清空表单和验证
            this.loginStatus = 'login'
			if(this.$refs.regist.$refs.loginFormData){
				console.log()	    
				this.$refs.regist.$refs.loginFormData.resetFields();
				this.$refs.regist.$refs.loginFormData.clearValidate()
				
			}    
			this.$store.commit('showDialog',false)
		}
    }
}
</script>