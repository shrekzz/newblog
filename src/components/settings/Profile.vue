<template>
    <el-card shadow="never" class="setting-card">
        <h2 class="header-text">个人资料</h2>
        <ul class="setting-box">
            <li class="setting-item">
                <span class="title">头像</span
                ><el-avatar
                    :size="80"
                    shape="square"
                    :src="this.$store.state.avatarUrl"
                />
                <div class="upload-box">
                    <div class="avatar-text">
                        支持 jpg 格式大小 2M 以内的图片点击上传
                    </div>
                    <div>
                        <el-upload  
                            action="/users/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <el-button type="primary" class="upload-btn"
                                >点击上传</el-button
                            />
                        </el-upload>
                    </div>
                </div>
            </li>
            <li class="setting-item">
                <span class="title">用户名</span>
                <div class="input-box">
                    <input class="setting-input" @focus="edit('name')" v-model="newName" placeholder="填写你的用户名" />
                    <div v-show="currentEdit==='name'">
                        <span class="save" @click="commitUpdate('name', newName)" >保存</span>
                        <span class="cancle" @click="edit('')">取消</span>
                    </div>
                    <span v-show="!(currentEdit==='name')" class="edit-btn" @click="edit('name')"
                        ><i class="el-icon-edit"></i> 修改</span
                    >
                </div>
            </li>
            <li class="setting-item" style=" border-bottom: 1px solid #f1f1f1;">
                <span class="title">个人介绍</span>
                <div class="input-box">
                    <input class="setting-input" @focus="edit('description')"  v-model="newDescription" placeholder="请输入介绍" />
                    <div v-show="currentEdit==='description'">
                        <span class="save" @click="commitUpdate('dsp', newDescription)">保存</span>
                        <span class="cancle" @click="edit('')">取消</span>
                    </div>
                    <span v-show="!(currentEdit==='description')" class="edit-btn" @click="edit('description')"
                        ><i class="el-icon-edit"></i> 修改</span
                    >
                </div>
            </li>
        </ul>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            newName: this.$store.state.user,
            newDescription: '',
            currentEdit: '',

        }
    },
    methods:{
        edit(param){
           this.currentEdit = param
           
        },
        commitUpdate(type, updateData) {
            if(!updateData && type === 'name'){
                this.$message.info('用户名不能为空！')
                return
            }
            axios.post('/users/settings/profile', {type,updateData} ).then(response => {
                let res = response.data
                if(res.status === '1') {
                    this.$message.success(res.msg)
                }else{
                    this.$message.error(res.msg)
                }
            })
            this.currentEdit = ''
        },
        handleAvatarSuccess(res, file) {
            let imageUrl = res.url;
            this.$store.commit("updateAvatar", imageUrl);
            this.$message.success("上传头像成功！")
            this.saveAvatar();
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        saveAvatar() {
            axios
                .post("/users/saveAvatar", {
                    authorName: this.$store.state.user,
                    avatarUrl: this.$store.state.avatarUrl
                })
                .then(response => {
                    let res = response.data;
                    if (res.status == 0) {
                        return;
                    }
                });
        },
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
        .upload-box{
            height: 80px;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            margin: 0 10px;
            .avatar-text{
                color: #909090;
                font-size: 0.8rem;
            }
            .upload-btn{
                border-radius: 2px;
                margin-top: 15px; 
                line-height: 10px;
            }
        }
        
        .edit-btn {
            color: #409EFF;
            font-size: 0.9rem;
            cursor: pointer;
        }
        .title {
            width: 100px;
            font-size: 0.9rem;
        }
        .input-box{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            input::-webkit-input-placeholder{
                color:#909090;
            }
            .save{
                font-size: 0.9rem;
                color: #409EFF;
                cursor: pointer;
                margin: 0 10px;
            }
            .cancle{
                font-size: 0.9rem;
                color: #909090;
                cursor: pointer;
            }
        }
    }
}
</style>

