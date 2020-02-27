<template>
    <div>
        <el-card shadow="never">
            <div class="no-data">
                <slot> <i class="el-icon-document"></i><span>这里没有内容~</span></slot>
            </div>
        </el-card>
    </div>
</template>
<script>

export default {
};
</script>
<style lang="scss" scoped>
.no-data {
    height: 200px;
    color: gery;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: gray;

}
</style>
