<template>
    <div>
        <nav-header />
            <el-row class="row">
                <el-col :span="18" :xs="{ span: 24 }">
                    <div class="container">
                        <el-card class="title-card" shadow="never">
                            <span class="sort-text" :class="{'sort-active':sortFlag === 0}" @click="changeSort(0)">最新</span> 
                            <el-divider direction="vertical" />
                            <span class="sort-text" :class="{'sort-active':sortFlag === 1}" @click="changeSort(1)">最热</span>
                        </el-card>
                        <Content :contentArr="articles" style="margin: 10px"/>
                        <div
                            class="loadMore"
                            v-infinite-scroll="loadMore"
                            infinite-scroll-disabled="busy"
                            infinite-scroll-distance="30"
                        >
                            <i class="el-icon-loading" v-show="loading"></i>
                        </div>
                    </div>  
                </el-col>
                <el-col :span="6" :xs="{ span: 0 }">
                    <el-card class="register-card" v-show="user === null">
                        <h4>shrekz.com</h4>
                        <register @open="opendialog" :state="regist"></register>
                    </el-card>
                    <nav-aside v-show="user !== null"></nav-aside>
                </el-col>
            </el-row>
        <nav-footer />
    </div>
</template>

<style lang="scss">
.loadMore {
    line-height: 10;
    text-align: center;
}
.title-card {
    margin: 10px 10px;
    margin-bottom: -10px;
    box-shadow: none;
	border-radius: 0;
	.sort-active{
		color: #409eff!important;
	}
	.sort-text{
		color: grey;
		font-size: 15px;
		cursor: pointer;
		&:hover{
			color: #409eff;
		}
	}
}
</style>

<script>


import NavAside from "@/components/NavAside.vue";
import Register from "@/components/Register";
import NavDialog from "@/components/NavDialog";
import Content from "@/components/Content";


export default {
    components: {
        NavAside,
        Register,
        NavDialog,
        Content,
    },
    data() {
        return {
            articles: [],
            page: 1,
            pageSize: 5,
            loading: false,
            busy: true,
			sortFlag: 0,
            regist: "regist",
            loginStatus: "login"
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        dialogFormVisible() {
            return this.$store.state.dialogFormVisible;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init(flag, user) {
            let param = {
                page: this.page,
                pageSize: this.pageSize
            };
            this.loading = true;
            axios
                .get("/index", {
                    params: param
                })
                .then(response => {
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
        },
        opendialog() {
            this.loginStatus = "login";

            this.$store.commit("showDialog", true);
		},
		changeSort(sort) {
			this.sortFlag = sort;
			
			let sortBy;
			sort === 0?sortBy = ( a, b ) => {
				return new Date(b.articleTime) - new Date(a.articleTime)
			} : sortBy = ( a, b ) => {
				return b.articleClick - a.articleClick 
			};
			this.articles.sort(sortBy)
		}
	},
	watch: {

	}
};
</script>
