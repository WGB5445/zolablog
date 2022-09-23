<template>
    <div >
        <n-anchor >
            <n-anchor-link title="演示" href="#演示">
            <n-anchor-link title="基础用法" href="#basic" />
            <n-anchor-link title="忽略间隔" href="#ignore-gap" />
            <n-anchor-link title="固定" href="#affix" />
            <n-anchor-link title="滚动到" href="#scrollto" />
            </n-anchor-link>
            <n-anchor-link title="Props" href="#Props" />
        </n-anchor>
    </div>
</template>


<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    const anchorRef = ref(null);
    const scrollTo = (href) => {
      anchorRef.value?.scrollTo(href);
    };
    const data = ref("56546");

</script>


