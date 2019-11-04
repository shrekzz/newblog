<template>
    <aside>
        <el-card class="box-card" style="text-align: center;">
            <!-- <el-row>
                <a href="#"><el-avatar title="上传头像" shape="square" :size="100" :fit="fill" :src="url"></el-avatar></a>
            </el-row> -->
            <el-row>
                <el-upload
                class="avatar-uploader"
                v-show="(user != null)"
                action='/users/upload'
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <el-avatar v-if="avatarUrl" :src="avatarUrl" shape="square" :size="100"  ></el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-row>
            <el-row><h4>{{user}}</h4></el-row>
            <el-row>
                <el-button type="primary" @click="edit">写博客</el-button>
                <el-button type="primary" v-show="user != null ">草稿箱</el-button>
            </el-row>
		</el-card>
    </aside>
</template>
<script>

import axios from 'axios'

export default {
    computed:{
        user () {
            return this.$store.state.user;
        },
        avatarUrl(){
            return this.$store.state.avatarUrl
        }
    },
    data(){
        return{
         
            
        }
    },
    methods:{
        edit(){
            this.$router.push('/edit')
        },
        handleAvatarSuccess(res, file) {
            let imageUrl =  res.url;
            this.$store.commit("updateAvatar", imageUrl);
            this.saveAvatar()
        
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        saveAvatar(){
            axios.post('/users/saveAvatar',{
                authorName: this.$store.state.user, 
                avatarUrl: this.$store.state.avatarUrl
                }).then(response => {
                    let res = response.data
                    if(res.status == 0){
                        return
                    }
                })
        }
    }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
 
</style>