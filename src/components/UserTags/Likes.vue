<template>
    <div>
         <no-data v-if="articles.length === 0" />
    <Content :contentArr="articles"></Content>
    </div>
</template>
<script>
import Content from "./../Content";
export default {
    props:{
        Arr: Array,
    },
    data(){
        return {
            articles: []
        }
    },
    components:{
        Content
    },
    methods:{
        show(){
            const id = this.$route.params.userid;
            axios
                .post(`/users/user/likes`, { userID: id })
                .then(response => {
                    let res = response.data;
                    if (res.status == 1) {
                        this.articles = res.result;
                    }
                });
        }   
    },
    created(){
        this.show()
    },
    watch: {
        Arr: function(newData, oldData) {
            newData && (this.articles = newData);
        }
    }
    
}
</script>