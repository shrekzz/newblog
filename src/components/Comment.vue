<template>
    <div>
        <el-card class="box-card">
            <div class="clearfix">
                <i class="el-icon-chat-dot-round">&nbsp;评论</i>
            </div>
            <br />
            <el-row>
                <el-col :xs="4" :sm="3" :md="3" :lg="2">
                    <el-avatar :size="50" :src="avatarUrl"></el-avatar>
                </el-col>
                <el-col :xs="18" :sm="19" :md="19" :lg="20">
                    <el-input v-model="inputContent" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容">
                    </el-input>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :xs="{offset:12}" :sm="{offset:15}" :md="{offset:20}" :lg="1">
                    <div style="width:70px;" class="el-button el-button--text">
                        <router-link to="/login" v-show="!isLogin">登录</router-link>
                    </div>
                    <el-button type="primary" v-bind:class="{ 'is-disabled' : !( isLogin && inputContent) }"
                        @click="publish(null)">发布</el-button>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col>
                    <div id="s" style="font-size: 13px;">
                        <el-button type="text" @click="changeSort(0);getComment(sortFlag)"
                            v-bind:class="{'sort':sortFlag == 0}">按时间</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="changeSort(1);getComment(sortFlag)"
                            v-bind:class="{'sort':sortFlag == 1}">按热度</el-button>
                    </div>
                </el-col>
            </el-row>
            <br />
            <div v-for="item in commentContent" v-if="!item.parentComment">
                <el-row>
                    <el-col :push="1" :span="2">
                        <el-avatar :size="40" :src="item.authorAvatarUrl"></el-avatar>
                    </el-col>
                    <el-col :push="1" :span="20">
                        <span style="color: darkblue;">{{item.authorName}}：</span>
                        <span style="color: black;">{{ item.commentContent }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :push="3" :span="2">
                        <p>
                            <span style="color: darkblue;font-size: 12px;">{{ item.commentTime }}</span>
                        </p>
                    </el-col>
                    <el-col :push="18" :span="5">
                        <p>
                            <el-button type="text" style="color: darkblue;font-size: 12px;"
                                @click="toggle(item.commentID)">回复</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" class="like"
                                v-bind:class="{ 'liked': (item.likeFlag && (item.authorName == user))}"
                                @click="like(item.commentID, item.likeFlag)">点赞({{item.likes}})</el-button>
                        </p>
                    </el-col>
                </el-row>
                <el-row v-show="(item.commentID == currentID)">
                    <el-col :push="3">
                        <div
                            style="background-color: #DCDFE6;width: 80%; height: 50px;padding-top: 10px;padding-left: 10px;">
                            <el-input v-model="childInput" style="width: 80%;" placeholder="请输入内容"></el-input>
                            <el-button type="primary" style="width: 18%;" @click="publish(item.commentID)">评论
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <br />
                <el-row v-for="(child,key) in commentContent" v-if="child.parentComment == item.commentID" :key="key">
                    <el-col :push="3">
                        <div
                            style="background-color: #F2F6FC;width: 80%;padding-top: 1px;padding-left: 10px;border-bottom: 1px solid #c0c0c0">
                            <br />
                            <el-row>
                                <el-col :push="1" :span="22">
                                    <span style="color: darkblue;font-size: 16px;">{{child.authorName}}：</span>
                                    <span
                                        style="color: black;font-size: 14px; line-height: 25px;">{{ child.commentContent }}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :push="1" :span="2">
                                    <p>
                                        <span style="color: darkblue;font-size: 12px;">{{child.commentTime}}</span>
                                    </p>
                                </el-col>
                                <el-col :push="20" :span="5">
                                    <p>
                                        <el-button type="text" class="like" v-bind:class="{ 'liked': child.likeFlag }"
                                            @click="like(child.commentID, child.likeFlag)">点赞({{child.likes}})
                                        </el-button>
                                    </p>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>

                <br />
            </div>
        </el-card>
    </div>
</template>
<script>
    import axios from "axios";
    export default {
        data() {
            return {
                inputContent: "",
                childInput: "",
                commentContent: "",
                currentID: "",
                isLogin: this.$store.state.user == null ? false : true,
                sortFlag: 0
            };
        },
        methods: {
            toggle(id) {
                //第一次点回复 cId 等于传进来的id ，再点同一个回复，cId置空
                if (id == this.currentID) {
                    this.currentID = "";
                    return;
                }
                this.currentID = id;
            },
            getComment(sort) {
                let articleID = this.$route.query.articleID;
                axios
                    .post("/users/getComment", {
                        articleID: articleID,
                        sort: sort
                    })
                    .then(response => {
                        let res = response.data;
                        if (res.status == 0) {
                            this.commentContent = res.result.commentContent;
                        }
                    });
            },
            publish(parentID) {
                let articleID = this.$route.query.articleID;
                let commentContent = this.inputContent;
                let parentComment = parentID;
                let avatar = this.$store.state.avatarUrl;
                if (parentComment) {
                    commentContent = this.childInput;
                }
                axios
                    .post("/users/publish", {
                        articleID: articleID,
                        commentContent: commentContent,
                        parentComment: parentComment,
                        avatar: avatar
                    })
                    .then(response => {
                        let res = response.data;
                        if (res.status == 0) {
                            this.inputContent = "";
                            this.childInput = "";
                            this.getComment();
                        }
                    });
            },
            like(commentID, likeFlag) {
                likeFlag = likeFlag ^ 1;
                axios
                    .post("/users/like", {
                        commentID: commentID,
                        likeFlag: likeFlag
                    })
                    .then(response => {
                        let res = response.data;
                        if (res.status == 0) {
                            console.log("1");
                        }
                    });
                this.getComment();
            },
            changeSort(sort) {
                this.sortFlag = sort;
            }
        },
        mounted() {
            this.getComment();
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            avatarUrl() {
                return this.$store.state.avatarUrl;
            }
        },
        components: {
            axios
        }
    };

</script>
<style scoped>
    .comment-card {
        font-family: "microsoft yahei";
        font-size: 14px;
        color: darkgray;
        margin: 0 auto;
    }

</style>
<style>
    .sort {
        font-size: 16px;
        color: black;
        cursor: pointer;
    }

    .like {
        color: darkblue;
        font-size: 12px;
    }

    .liked {
        color: #eb7350;
        font-size: 12px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both;
    }

</style>
