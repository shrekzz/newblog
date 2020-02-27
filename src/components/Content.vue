<template>
    <div>
        <el-card
            class="box-card"
            shadow="hover"
            v-for="(item, idx) in contentArr"
            :key="idx"
        >
            <span class="p-top">
                <a @click="toUser(item.articleAuthor)">{{ item.articleAuthor }}</a>
                · {{ timeFormat(item.articleTime) }}
            </span>
            <h3>
                <router-link
                    :to="{
                        path: 'article',
                        query: { articleID: item.articleID }
                    }"
                    v-html="item.articleTitle"
                    ></router-link
                >
            </h3>
            <p
                v-html="
                    item.articleContent.substr(0, 100) +
                        (item.articleContent.length > 100 ? '...' : '')
                "
            ></p>
            <br />
            <div class="text">
                <div
                    class="edit-del"
                    v-if="contentType === 'draft' || contentType === 'self'"
                >
                    <span
                        ><router-link
                            :to="{
                                path: 'edit',
                                query: { articleID: item.articleID }
                            }"
                            >编辑</router-link
                        ></span
                    >
                    <el-divider direction="vertical"></el-divider>
                    <span
                        ><a href="javascript:;" @click="open(item)"
                            >删除</a
                        ></span
                    >
                </div>
                <div class="view-like">
                    <span
                        class="like"
                        :class="{
                            liked:
                                item.likesArr !== null
                                    ? item.likesArr.split(',').includes(user)
                                    : false
                        }"
                        v-if="contentType === 'default'"
                        @click="like(item)"
                        ><svg
                            t="1581966782139"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="3801"
                            width="13"
                            height="13"
                        >
                            <path
                                d="M909.73518132 398.46908591h-253.76540309c98.33206847-363.16187291-67.75031058-381.7100633-67.75031058-381.71006331-70.3912147 0-55.79922532 55.66224591-61.12227466 64.94296916 0 177.60190555-188.63979473 316.76856706-188.63979473 316.76856707v503.65119579c0 49.71616122 67.75031058 67.62069567 94.32726185 67.62069567h381.28292321c35.88418663 0 65.1049878-94.10632733 65.10498778-94.10632731 94.32873475-320.75275311 94.32873475-416.18763342 94.32873476-416.18763341 0.0014729-66.27004923-63.76612453-60.97498495-63.76612454-60.97498498v0 0zM909.73518132 398.46908591z"
                                fill="#b7b7b7"
                                p-id="3802"
                            ></path>
                            <path
                                d="M234.3176974 398.63552325h-151.95435221c-31.38154089 0-31.86612395 30.82331295-31.86612394 30.82331299l31.38154087 507.94910889c0 32.33008646 32.38458366 32.33008646 32.38458366 32.33008646h131.51643514c27.39882772 0 27.15579973-21.38646267 27.15579973-21.38646267v-511.19684652c0-39.01114671-38.62082903-38.51772626-38.62082904-38.51772625v0 0zM234.3176974 398.63552325z"
                                fill="#b7b7b7"
                                p-id="3803"
                            ></path>
                        </svg>
                        {{
                            item.likesArr !== null && item.likesArr !== ""
                                ? item.likesArr.split(",").length
                                : 0
                        }}
                    </span>
                    <span
                        v-if="
                            contentType === 'default' || contentType === 'self'
                        "
                        class="view"
                        ><i class="el-icon-view"></i> 浏览
                        {{ item.articleClick }}</span
                    >
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
moment.locale('zh-cn');

export default {
    components: {
        // Row,
        // Col,
        // Card
    },
    props: {
        contentArr: Array,
        contentType: {
            type: String,
            default: "default"
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        delArticle(item) {
            axios
                .post("/users/delete", { articleID: item.articleID })
                .then(response => {
                    let res = response.data;
                    if (res.data === "1") {
                        console.log("successs");
                    }
                });
        },
        open(item) {
            this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delArticle(item);
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    this.$router.go(0);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        timeFormat(time) {
            return moment(time).fromNow();
        },
        like(item) {
            let user = this.$store.state.user;
            if(!user) {
                this.$store.commit("showDialog", true)
				return
            }
            if (item.likesArr === null || item.likesArr === "") {
                item.likesArr = user;
            } else if (item.likesArr.split(",").includes(user)) {
                //取消点赞
                let arr = item.likesArr.split(","); //把点赞人字符串转换为数组
                let index = arr.indexOf(user); //删除的索引
                arr.splice(index, 1);
                item.likesArr = arr.join("");
            } else {
                //点赞
                item.likesArr += "," + user;
            }

            axios
                .post("/users/like", {
                    articleID: item.articleID,
                    likers: item.likesArr
                })
                .then(response => {
                    let res = response.data;
                    if (res.status == 0) {
                        return;
                    }
                });
        },
        toUser(param) {
            axios.post('/index/name2id', { authorName: param }).then(response => {
                let res = response.data
                if(res.status === '1') {
                    let id = res.result.authorID
                    this.$router.push(`/user/${id}/articles`);
                }
            })
        }
    },
    
};
</script>
<style lang="scss">
.text {
    display: flex;
    color: grey;
    font-size: 13px;
    justify-content: space-between;
    .edit-del {
        a:hover {
            color: #409eff;
        }
    }
    .view-like {
        float: right;
        color: grey;
        .view {
            cursor: pointer;
        }
        .liked {
            color: #1dc400;
            svg path {
                fill: #1d9400;
            }
        }
        .like {
            cursor: pointer;
        }
    }
}
</style>
