<template>
    <div>
        <no-data v-if="userFollowersArr.length === 0" ><span>这里没有人~</span><i class="el-icon-user"></i></no-data>
        <UserList :userlist="userFollowers" />
    </div>
</template>
<script>
import UserList from "./../UserList";
export default {
    props: {
        userFollowers: Array
    },
    components: {
        UserList,
    },
    data() {
        return { userFollowersArr: [] };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    watch: {
        userFollowers: function(newData, oldData) {
            newData && (this.userFollowersArr = newData);
        }
    }
};
</script>

