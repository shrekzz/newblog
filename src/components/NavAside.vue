<template>
    <aside>
        <el-card
            style="text-align: center;min-height: 200px;width: 90%;margin-top:10px;"
        >
            <el-row>
                <el-avatar
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    shape="square"
                    :size="100"
                />
            </el-row>
            <el-row>
                <router-link class="username" tag="h4"  :to="{ path: `/user/${userID}/articles` }"  >{{ user }}</router-link>         
            </el-row>
            <el-row>
                <div class="message">
                    <div class="message-box">
                        <router-link class="message-data" tag="div"  to="/myarticle" >{{ articlesNum }}</router-link>            
                        <div class="message-text">文章</div>
                    </div>
                    <div class="message-box">
                        <router-link class="message-data" tag="div"  :to="{ path: `/user/${userID}/followers` }"  >{{followers.length}}</router-link>   
                        <div class="message-text">关注</div>
                    </div>
                    <div class="message-box" style="border-right:0;">
                        <router-link class="message-data" tag="div"  :to="{ path: `/user/${userID}/fans` }"  >{{fans.length}}</router-link>                        
                        <div class="message-text">粉丝</div>
                    </div>
                </div>
            </el-row>
            <el-row class="btn">
                <el-button type="primary" v-show="user != null" @click="edit"
                    >写文章</el-button
                >
                <el-button style="margin-left:0" type="primary" v-show="user != null" @click="draft"
                    >草稿箱</el-button
                >
            </el-row>
        </el-card>
    </aside>
</template>
<style lang="scss" scoped>
.btn {
    margin-top: 10px; 
    .Button {
        width: 80px;
    }
}
.username{
    cursor: pointer;
        &:hover{
            color: #409eff;
        }
    }
.message{
    margin: 0 auto;
    
    .message-box {
        cursor: pointer;
        border-right: 1px solid #e9e9e9;
        float: left;
        font-weight: bold;
        width: 32%;
        .message-text{
            font-weight: normal;
            font-size: 13px;
            color: grey;
        }
        .message-data{
            &:hover{
                color: #409eff;
            }
        }
    }
}

</style>
<script>

export default {

    computed: {
        user() {
            return this.$store.state.user;
        },
        avatarUrl() {
            return this.$store.state.avatarUrl;
        },
        followers() {
            return this.$store.state.followers
        },
        fans() {
            return this.$store.state.fans
        },
        userID() {
            return this.$store.state.userID
        }
    },
    data() {
        return {
            articlesNum: 0
        };
    },
    methods: {
        edit() {
            this.$router.push("/edit");
        },
        draft() {
            this.$router.push("/draft");
        },
        getArticleNum(){
            axios.post("/users/getArticleCount",{ articleAuthor: this.$store.state.user }).then(response => {
                let res = response.data
                if(res.status === '1'){
                    this.articlesNum = res.result
                }
            })
        }
    },
    mounted(){
        this.getArticleNum() 
    }
};
</script>
