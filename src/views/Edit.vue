<template>
    <div>
        <nav-header></nav-header>
        <el-row>
            <el-col :span="24" :xs="{ span: 24 }">
                <!-- <el-card class="box-card"> -->
                <el-card style="margin-top:20px">
                    <div class="edit-title">
                        <span class="edit-text">编辑</span>
                        <el-button
                            style="float:right"
                            type="primary"
                            @click="
                                centerDialogVisible = true;
                                save(0);
                            "
                            v-bind:class="{
                                'is-disabled': !(title && content)
                            }"
                            >发&emsp;布</el-button
                        >
                    </div>
                </el-card>
                <el-input placeholder="请输入内容" v-model="title">
                    <template slot="prepend">标&emsp;题</template>
                </el-input>
                <!-- @change="autosave" -->
                <mavon-editor
                    ref="md"
                    @imgAdd="$imgAdd"
                    v-model="content"

                    class="editor"
                    :ishljs="true"
                ></mavon-editor>
                <p v-show="isautosave">自动保存成功...</p>
                <p class="savebtn"></p>
                <!-- </el-card> -->
            </el-col>
            <!-- <el-col :span="5" :xs="{span:0}">
                <nav-aside></nav-aside>
            </el-col> -->
        </el-row>
        <nav-footer></nav-footer>
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
        >
            <span>文章发布成功！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="back">返回首页</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";

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
            title: "",
            content: "",
            centerDialogVisible: false,
            isautosave: false,
            temporaryID: ""
        };
    },
    mounted() {
        this.initEdit();
    },
    watch: {
        //监听输入内容，发生变化就会执行
        content: function(newContent, oldContent){
            this.debounced()
        }
    },
    created: function(){
        this.debounced = this.debounce(this.save, 5000)
    },
    methods: {
        initEdit() {
            var articleID = this.$route.query.articleID;
            var edit = true;
            if (articleID) {
                axios
                    .post("/users/articleContent", {
                        articleID: articleID,
                        edit: edit
                    })
                    .then(response => {
                        let res = response.data;
                        if (res.status == 0) {
                            this.title = res.result.article.articleTitle;
                            this.content = res.result.article.articleContent;
                        }
                    });
            }
        },
        save(draftFlag = 1) {
            if(draftFlag === 1){
                this.isautosave = true
            }
            //如果是能从路径获取所编辑文章的ID，则是编辑文章状态
            //如果是写文章又分第一次创建和创建后
            //第一次自动保存，创建文章的时候，后台传回一个文章ID
            //后续的自动保存根据文章ID来update
            //发布文章只需要将文章draftFlag改成 1 即可
            let articleID = this.$route.query.articleID?this.$route.query.articleID:this.temporaryID;
            axios
                .post("/users/editArticle", {
                    title: this.title,
                    content: this.content,
                    articleID: articleID,
                    draftFlag: draftFlag
                })
                .then(response => {
                    let res = response.data;
                    //获取创建后的ID，后面自动保存不再返回id，所以加个消息判断是不是第一次创建
                    if (res.status === '1' &&  res.msg === 'returned id') {
                        this.temporaryID = res.result.articleID
                    }
                });
        },
        back() {
            this.centerDialogVisible = false;
            this.$router.push({
                path: "/"
            });
        },
        $imgAdd(pos, $file) {
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append("file", $file);
            axios({
                url: "/users/upload",
                method: "post",
                data: formdata,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(url => {
                // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
                var imgurl = url.data.url;

                /**
                 * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                 * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                 * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                 */
                this.$refs.md.$img2Url(pos, imgurl);
            });
        },
        autosave() {
            let that = this;
            setTimeout(function() {
                that.save(1);
                that.isautosave = true;
            }, 10000);
        },
        //防抖函数实现5秒自动保存
        debounce(func, wait) {
            let timeout = null;
            return () => {
                if(timeout) {
                    clearTimeout(timeout)
                }          
                timeout = setTimeout(func, wait)
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.edit-title {
    display: flex;
    justify-content: space-between;
    .edit-text {
        font-weight: bold;
        font-size: 18px;
    }
}
</style>
