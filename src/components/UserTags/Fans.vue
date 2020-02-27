<template>
    <div>
        <no-data v-if="userFansArr.length === 0" ><span>这里没有人~</span><i class="el-icon-user"></i></no-data>
        <UserList :userlist="userFans" />  
    </div>
</template>
<script>
import UserList from "./../UserList";
export default {
    props: {
        userFans: Array
    },
    components: {
        UserList,
    },
    data() {
        return { userFansArr: [] };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    watch: {
        userFans: function(newData, oldData) {
            newData && (this.userFansArr = newData);
        }
    }
};
</script>
