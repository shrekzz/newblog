<template>
    <div>
        <el-card
            class="followers-tag"
            v-for="(item, idx) in userlistArr"
            shadow="hover"
            :key="idx"
            @click.native="toUser(item.authorID)"
        >
            <el-row>
                <el-col class="user-avatar" :span="22">
                    <el-avatar :src="item.authorAvatarUrl" :size="50" />
                    <span class="user-name">{{ item.authorName }}</span> 
                </el-col>
                <el-col class="follow" :span="2" v-if="item.authorID !== userID">
                    <el-button
                        type="success"
                        v-if="followers.includes(item.authorName)"
                        @click.stop="follow(item.authorID, item.authorName, true)"
                        >已关注</el-button
                    >
                    <el-button
                        class="follow-btn"
                        @click.stop="follow(item.authorID, item.authorName)"
                        v-else
                        >关&emsp;注</el-button
                    >
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    props: {
        userlist: Array
    },
    data() {
        return {
            userlistArr: []
        };
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        userID() {
            return this.$store.state.userID;
        },
        followers() {
            return this.$store.state.followers;
        }
    },
    watch: {
        //监听父组件传来的props，并将数组处理成JSON
        //用来解决刷新页面获取不到Props的问题
        userlist: function(newData, oldData) {
            let handle = JSON.stringify(this.userlist);
            //如果newData(也就是props的userlist存在，则发送请求)
            newData && this.show(handle);
        }
    },
    methods: {
        show(arr) {
            arr ? arr : (arr = JSON.stringify(this.userlist));
            if (arr) {
                axios
                    .post("/users/user/getUserList", { userlists: arr })
                    .then(response => {
                        let res = response.data;
                        if (res.status === "1") {
                            this.userlistArr = res.result;
                        }
                    });
            }
        },
        toUser(param) {
            this.$router.push(`/user/${param}/articles`);
        },
        //关注 和 取消关注
        follow(id, name, followToggle = false) {
            if(!this.$store.state.user) {
				this.$store.commit("showDialog", true)
				return
			}
            //id: 被关注人ID
            //name: 被关注人名字
            //followToggle :关注状态 true则执行取消关注操作，默认fasle,关注
            let followedID = id;
            let userID = this.$store.state.userID;
            let userName = this.$store.state.user;
            let oldFollowers = [...this.$store.state.followers];
            let newFollowers 
            if(followToggle){
                let inx = oldFollowers.indexOf(name)
                oldFollowers.splice(inx, 1)
                newFollowers = oldFollowers;
            }else{
                oldFollowers.push(name);
                newFollowers = oldFollowers;
            }
            

            axios
                .post("/users/user/follow", {
                    followedID,
                    userID,
                    userName,
                    newFollowers: newFollowers.join(),
                    followToggle
                })
                .then(response => {
                    let res = response.data;
                    if (res.status === "1") {
                        this.$store.commit("setFollowersFans", {
                            followers: newFollowers
                        });
                    }
                });
        },
        
       
        
    },
    mounted() {
        //正常情况下执行
        //prop更新（包括页面刷新）父组件axios请求获取props是比子组件也就是本组件渲染慢，所以created,mounted时prop还没传过来。这时候就要用watch来监听然后传props
        this.show();
    }
};
</script>
<style lang="scss" scoped>
.followers-tag {
    cursor: pointer;
    .user-avatar {
        display: flex;
        .user-name {
            font-weight: bold;
            line-height: 50px;
            margin-left: 10px;
        }
    }
    .follow {
        float: right;
        .follow-btn {
            border-color: #67c23a;
        }
    }
}
</style>
