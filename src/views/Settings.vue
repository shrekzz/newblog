<template>
    <div>
        <nav-header />
        <el-card shadow="never" class="tab-card" :body-style="{padding: '15px 0'}">
            <div class="tab">
                <router-link tag="span" active-class="tab-actived" to='/settings/profile' class="tab-item">个人资料</router-link>
                <router-link tag="span" active-class="tab-actived" to='/settings/password' class="tab-item">修改密码</router-link>
            </div>
        </el-card>
        <div class="row">
            <router-view></router-view>
        </div>
        <nav-footer />
    </div>
</template>
<script>
export default {
};
</script>
<style lang="scss" scoped>
.tab-card{
    border-radius: 2px;
}
.tab{
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    .tab-item{
        margin: 0 5px;
        font-size: 0.9rem;
        cursor: pointer;
        &:hover{
            color: #409eff;
        }
        
    }
}
.tab-actived{
            color: #409eff;
        }

</style>