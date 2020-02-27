<template>
    <div>
        <nav-header></nav-header>
        <el-row class="row" >
            <el-col :span="18" :xs="{ span: 24 }">
                <div class="container">
                     <el-card shadow="never" class="title-card">
                        <span class="title-text">我的文章</span> 
                        
                    </el-card>
                    <Content :contentArr="articles" :contentType="'self'" style="margin: 10px"/>
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

<style>
.loadMore {
    line-height: 10;
    text-align: center;
}
</style>

<script>
import NavAside from "@/components/NavAside.vue";
import Content from "@/components/Content";

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
                pageSize: this.pageSize
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

<style lang="scss">

    .title-card {
        margin: 10px 10px;
        margin-bottom: -10px;
        box-shadow: none;
        border-radius: 0;
    }
    .title-text{
        font-weight: bold;
        font-size: 18px;
    }
	.text{
		display: flex;
		justify-content: space-between;
		color: grey;
		font-size: 13px;
		.edit-del{
			a:hover {
			
			color: #409eff;
			}
		}
		.view-like{
			color: grey;
		}
	}
</style>
