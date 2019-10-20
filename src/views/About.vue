<template>
    <div>
        <nav-header></nav-header>
        <section class="main floatfix">
            <nav-aside></nav-aside>
            <section class="main-articles about">
                <h2>关于博客</h2>
                <p>本博客主要分享Node.js和前端技术，希望和大家共同成长。</p>
            </section>
        </section>
        <nav-footer></nav-footer>
    </div>
</template>
<script>

    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavAside from '@/components/NavAside.vue'

    import './../assets/css/main.css'
    import './../assets/css/normalize.css'

    export default {
        components: {
            NavHeader,
            NavAside,
            NavFooter
        }
}
</script>