<template>
<div class="login">
    <section>
        <form>
            <div class="form-group">
                <input type="text" v-model="userName" name="name" placeholder="登录名"> 
            </div>
            <div class="form-group">
                <input type="password" v-model="userPwd" name="password" placeholder="密码">
                 
                <p v-if='message' > {{message}}</p>
                 
            </div>
            <div class="form-group">
                <input type="button" value="登录" @click="login">
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
            message:''
        }
    },
    methods: {
        login() {
            axios.post('/users/login', {
                userName: this.userName,
                userPwd: this.userPwd
            }).then(response => {
                let res = response.data
                if (res.status == 0) {
                    this.message = res.msg
                    this.$router.push({
                        path:'/'
                    })
                }else if(res.status == 1){
                    this.message = res.msg
                }
            })
        }
    }
}
</script>