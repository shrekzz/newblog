<template>
        <div>
            <el-form :model="registFormData" ref="registFormData" :rules="rules" v-if="state === 'regist'">
                <el-form-item prop="name">
                    <el-input v-model="registFormData.name" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="phoneNum"> 
                    <el-input  v-model="registFormData.phoneNum" placeholder="手机号" />
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input  v-model="registFormData.pwd" placeholder="密码不少于6位" type="password"/>
                </el-form-item >
                <el-form-item prop="checkPwd">
                    <el-input  v-model="registFormData.checkPwd" placeholder="确认密码" type="password"/>
                </el-form-item >
                <el-form-item>
                    <el-button type="primary" @click="submitForm('registFormData')">立即注册</el-button>
                </el-form-item>
            </el-form>
            <el-form :model="loginFormData" ref="loginFormData" v-if="state === 'login'" >
                <el-form-item prop="name">
                    <el-input v-model=" loginFormData.name"  placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="pwd" :error="loginFormData.err"> 
                    <el-input  v-model=" loginFormData.pwd" type="password" placeholder="密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
</template>
<script>
export default {
    props:['state'],
    data(){
        var checkName = (rule, value, callback) => {
            if (!value) {
            return callback(new Error('用户名不能为空'));
            } else if(value.length < 6 || value.length > 12){
                callback(new Error('用户名长度应为6~12之间'));
            }
            callback();
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if(value.length < 6){
                callback(new Error('密码应大于6位'))
            }else {
                if (this.registFormData.checkPwd !== '') {
                    this.$refs.registFormData.validateField('validatePass2');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registFormData.pwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        var checkPhone = (rule, value, callback) => {
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if(value === '') {
                callback(new Error('请输入手机号'))
            }
            setTimeout(() => {
            if (!Number.isInteger(Number(value))) {
                callback(new Error('请输入数字'));
            } else {
                if (!myreg.test(this.registFormData.phoneNum)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            }
            }, 1000);
        }
        return{
            registFormData: {
                name: '',
                pwd: '',
                checkPwd: '',
                phoneNum: ''
            },
            loginFormData: {
                name: '',
                pwd: '',
                err:''
            },
            rules: {
                    name: [
                        { validator: checkName, trigger: 'blur'}
                    ],
                    pwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPwd: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    phoneNum: [
                        { validator: checkPhone, trigger: 'blur' }
                    ]
                }
            }
    },
    methods: {
        login() {
            axios.post('/users/login', {
                userName: this.loginFormData.name,
                userPwd: this.loginFormData.pwd
            }).then(response => {
                let res = response.data
                if (res.status == 0) {
                    this.$store.commit("updateFlag", res.result.user);
                    this.$store.commit("updateAvatar", res.result.avatarUrl);
                    this.$store.commit("setUserID", res.result.userID)
                    this.$store.commit("setFollowersFans", { followers:res.result.followers , fans:res.result.fans })
                    localStorage.setItem('token', res.result.token);
                    this.$message(res.msg)
                     this.$emit('close')
                }else if(res.status == 1){
                    this.loginFormData.err = res.msg
                }
            })
             
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                axios.post('/users/regist', {
                    name: this.registFormData.name,
                    pwd: this.registFormData.pwd,
                    phone: this.registFormData.phoneNum
                    }).then( (response) =>{
                    let res = response.data
                    if(res.status == 1){
                        this.$message(res.msg);
                    }else if(res.status == 0){
                        this.$message(res.msg)
                        this.$emit('open')
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    }
}
</script>
<style lang="scss" scoped>

</style>