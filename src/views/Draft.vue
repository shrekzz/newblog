<template>
    <div>
        <nav-header></nav-header>
        <el-row class="row"> 
            <el-col :span="18" :xs="{ span: 24 }">
                <div class="container">
                    <el-card class="page-header" shadow="never">
                        <span class="title-text">草稿箱</span>
                    </el-card>
                    <no-data style="margin: 0 10px" v-if="articles.length === 0"><span>草稿箱为空</span></no-data>
                    
                    <Content :contentType="'draft'" :contentArr="articles" style="margin:10px"/>
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
                <nav-aside></nav-aside>
            </el-col>
        </el-row>
        <nav-footer></nav-footer>
    </div>
</template>

<style lang="scss">
.loadMore {
    line-height: 10;
    text-align: center;
}
.page-header {
    margin: 10px 10px;
    margin-bottom: -10px;
    box-shadow: none;
	border-radius: 0;
    font-weight: bold;
}
</style>

<script>
import NavAside from "@/components/NavAside.vue";
import Content from "@/components/Content.vue";

export default {
    components: {
        NavAside,
        Content,
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
                user: this.user,
                page: this.page,
                pageSize: this.pageSize,
                draft: "draft"
            };
            this.loading = true;
            axios.get("/index", { params: param }).then(response => {
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
<style scoped>
.edit a {
    font-size: 13px;
    color: grey;
}
.edit a:hover {
    font-size: 13px;
    color: #409eff;
}
.title-text{
        font-weight: bold;
        font-size: 18px;
    }
</style>
