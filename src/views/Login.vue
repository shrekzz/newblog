<template>
<div class="login">
    <section v-if="current == 'login'">
        <form>
            <div class="form-group">
                <input type="text" v-model="userName" name="name" placeholder="登录名"> 
            </div>
            <div class="form-group">
                <input type="password" v-model="userPwd" name="password" placeholder="密码">
                 
                <p v-if='message' > {{message}}</p>
                 
            </div>
            <div class="form-group">
                <input type="button" value="登录/注册" @click="login">
            </div>
        </form>
    </section>
    <section v-if="current == 'regist'">
        <form>
            <div class="form-group">
                <input type="text" v-model="regist.Name"  placeholder="登录名" @blur="checkName"> 
                <p v-if='regist.tips.nametip' > {{regist.tips.nametip}}</p>
            </div>
            <div class="form-group">
                <input  type="password" v-model="regist.Pwd"  placeholder="密码" @blur="checkPwd">
                <p v-if='regist.tips.pwdtip' > {{regist.tips.pwdtip}}</p>
            </div>
                <div class="form-group">
                    <input type="password" v-model="regist.ConfirmPwd" placeholder="确认密码" @blur="checkConfirmPwd"> 
                    <p v-if='regist.tips.confirmpwdtip' > {{regist.tips.confirmpwdtip}}</p>
                </div>
                <div class="form-group">
                    <input type="text" v-model="regist.Phone"  placeholder="手机号码" @blur="checkPhone">
                    <p v-if='regist.tips.phonetip' > {{regist.tips.phonetip}}</p> 
                </div>
						
            <div class="form-group">
							
                <input type="button" value="注册" @click="register">
								
            </div>
        </form>
    </section>
</div>
</template>

<script>

import axios from "axios";
import './../assets/css/main.css'
import './../assets/css/normalize.css'

export default { 
    components:{

    },
    data(){
        return{
            userName: "",
            userPwd: "",
            message:'',
            current: 'login',
            regist:{
                Name:'',
                Pwd:'',
                ConfirmPwd:'',
                Phone:'',
                tips:{
                    nametip:'',
                    pwdtip:'',
                    phonetip:'',
                    confirmpwdtip:'',
                    tip1:'用户名长度应为6~12之间',
                    tip2:'用户名不能为空',
                    tip3:'两次密码不一致',
                    tip4:'密码长度应为6~12之间',
                    tip5:'密码不能为空',
                    tip6:'手机号码格式不正确',
                    tip7:'手机号码不能为空'
                }
            }
        }
    },
    methods: {
        login() {
            if(this.userName == ''&&this.userPwd == ''){
                this.current = 'regist'
                return
            }
            axios.post('/users/login', {
                userName: this.userName,
                userPwd: this.userPwd
            }).then(response => {
                let res = response.data
                if (res.status == 0) {
                    this.$store.commit("updateFlag", res.result.user);
                    this.$store.commit("updateAvatar", res.result.avatarUrl);
                    this.message = res.msg
                    this.$router.push({
                        path:'/'
                    })
                }else if(res.status == 1){
                    this.message = res.msg
                }
            })
        },
        checkName(){
           if(this.regist.Name == ""){
                this.regist.tips.nametip = '用户名不能为空'
            }else{
                this.regist.tips.nametip = ''
                if(this.regist.Name.length < 4 || this.regist.Name.length > 12){
                     this.regist.tips.nametip = '用户名长度应为4~12之间'
                }else{
                    this.regist.tips.nametip = ''
                    return true
                }
            }
            return false
        },
        checkPwd(){
            if(this.regist.Pwd == ""){
                this.regist.tips.pwdtip = '密码不能为空'
            }else{
                this.regist.tips.pwdtip = ''
                if(this.regist.Pwd.length < 6 || this.regist.Pwd.length > 12){
                     this.regist.tips.pwdtip = '密码长度应为6~12之间'
                }else{
                    this.regist.tips.pwdtip = ''
                    return true
                }
            }
            return false
        },
        checkConfirmPwd(){
            if(this.regist.Pwd == ""){
                this.regist.tips.confirmpwdtip = '确认密码不能为空'
            }else{
                this.regist.tips.confirmpwdtip = ''
                if(this.regist.ConfirmPwd !== this.regist.Pwd){
                     this.regist.tips.confirmpwdtip = '两次密码不一致'
                }else{
                    this.regist.tips.confirmpwdtip = ''
                    return true
                }
            }
            return false
        },
        checkPhone(){
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if(this.regist.Phone == ""){
                this.regist.tips.phonetip = '手机号码不能为空'
            }else{
                this.regist.tips.phonetip = ''
                if(!myreg.test(this.regist.Phone)){
                     this.regist.tips.phonetip = '手机号码格式不正确'
                }else{
                    this.regist.tips.phonetip = ''
                    return true
                }
            }
            return false
        },
        register(){
            if(this.checkName() && this.checkPwd() && this.checkConfirmPwd() && this.checkPhone()){
                axios.post('/users/regist', {
                    name: this.regist.Name,
                    pwd: this.regist.Pwd,
                    phone: this.regist.Phone
                    }).then( (response) =>{
                    let res = response.data
                    if(res.status == 1){
                        this.$message(res.msg);
                    }else if(res.status == 0){
                        this.$message(res.msg)
                        this.current = 'login'
                    }
                })
            }
        },
        
    }
}
</script>