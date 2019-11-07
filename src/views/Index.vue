<template>
    <div>
        <nav-header></nav-header>
        <el-row>
            <el-col :span="19" :xs="{span:24}">
                <div class="container">
                    <el-card class="box-card" shadow="hover" v-for="(item,idx) in articles" :key="idx">
                        <span class="p-top">
                            <a href="#">{{item.articleAuthor}}</a>
                            · {{item.articleTime}}
                        </span>
                        <h3>
                            <router-link :to="{path:'article', query: {'articleID': item.articleID} }">
                                {{item.articleTitle}}</router-link>
                        </h3>
                        <p>{{item.articleContent.substr(0,100)}}</p>
                        <br />
                        <span class="p-bottom"><i class="el-icon-view" ></i> 浏览 {{item.articleClick}}</span>
                    </el-card>
                    <div class="loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                        infinite-scroll-distance="30">
                        <i class="el-icon-loading" v-show="loading"></i>
                    </div>
                </div>
            </el-col>
            <el-col :span="5" :xs="{span:0}">
                <nav-aside></nav-aside>
            </el-col>
        </el-row>
        <nav-footer></nav-footer>
    </div>
</template>

<style>
    .loadMore {
        line-height: 10;
        text-align: center;
    }

</style>

<script>
    import axios from "axios";
    import "./../assets/css/main.css";
    import "./../assets/css/normalize.css";

    import NavHeader from "@/components/NavHeader.vue";
    import NavFooter from "@/components/NavFooter.vue";
    import NavAside from "@/components/NavAside.vue";
    export default {
        components: {
            NavHeader,
            NavAside,
            NavFooter
        },
        data() {
            return {
                articles: [],
                page: 1,
                pageSize: 5,
                loading: false,
                busy: true
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(flag, user) {
                let param = {
                    user: user,
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.loading = true;
                axios.get("/index", {
                    params: param
                }).then(response => {
                    let res = response.data;
                    this.loading = false;
                    if (res.status == 0) {
                        if (flag) {
                            this.articles = this.articles.concat(
                                res.result.articles
                            );
                            if (res.result.count == 0) {
                                this.busy = true;
                            } else {
                                this.busy = false;
                            }
                        } else {
                            this.articles = res.result.articles;
                            this.busy = false;
                        }
                    }
                });
            },

            delArticle(item) {
                axios
                    .post("/users/delete", {
                        articleID: item.articleID
                    })
                    .then(response => {
                        let res = response.data;
                        if (res.data == 0) {
                            console.log("successs");
                        }
                    });
            },

            loadMore() {
                this.busy = true;
                setTimeout(() => {
                    this.page++;
                    this.init(true);
                }, 200);
            }
        }
    };

</script>
