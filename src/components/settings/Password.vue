<template>
    <el-card shadow="never" class="setting-card">
        <h2 class="header-text">修改密码</h2>
        <div>
            <ul class="setting-box" >
                <li class="setting-item">
                    <span class="title">旧密码</span>
                    <div class="input-box">
                        <input class="setting-input" v-model="nowPwd" type="password"  placeholder="请输入原密码" />
                    </div>
                </li>
                <li class="setting-item">
                    <span class="title">新密码</span>
                    <div class="input-box">
                        <input class="setting-input" v-model="newPwd" type="password"  placeholder="请输入新密码" />
                    </div>
                </li>
                <li class="setting-item" style=" border-bottom: 1px solid #f1f1f1;">
                    <span class="title">确认新密码</span>
                    <div class="input-box">
                        <input class="setting-input" type="password" v-model="confirm" placeholder="确认新密码" />
                    </div>
                </li>
            </ul>
            <div class="save-btn"><el-button type="primary" @click="updatePassword()">保存修改</el-button></div>
        </div>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            nowPwd:'',
            newPwd:'',
            confirm:''
        }
    },
    methods:{
        updatePassword(){
            if(this.newPwd !== this.confirm) {
                this.$message.info("新密码与确认密码不一致！")
            }else if(this.newPwd.length < 6 || this.nowPwd < 6){
                this.$message.info("密码长度不能小于6位！")
            }
            else{
                axios.post('/users/settings/password', { nowPwd: this.nowPwd, newPwd: this.newPwd }).then(response => {
                    let res = response.data
                    if(res.status === '1') {
                        this.$message.success(res.msg)
                        
                    }else if(res.status === '000') {
                        this.$message.info(res.msg)
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }
            this.nowPwd = ""
            this.newPwd = ""
            this.confirm = ""
        }
    }
};
</script>
<style lang="scss" scoped>
.setting-card{
    width: 100%;
    max-width: 960px;
    margin-top: 10px;
    .header-text{
        padding: 0 20px;
        margin-bottom:0;
    }
}
.setting-box{
    padding: 20px;
    .setting-item {
        display: flex;
        align-items: center;
        border-top: 1px solid #f1f1f1;
        padding: 20px 0;
        .setting-input {
            border: 0;
            outline: none;
            display: inline-block;
            flex: 1;
            &:focus {
                border: 0;
            }    
        }
        .title {
            width: 120px;
            font-size: 0.9rem;
        }
        .input-box{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            input::-webkit-input-placeholder{
                color:#909090;
            }
        }
    }
}
.save-btn{
    padding: 0 20px;
    text-align: right;
    button{
        border-radius: 2px;
    }
}
</style>

