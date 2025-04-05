<template>
  <div id="xmind-container">
    <Loading v-if="showLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
// import XMindEmbedViewer from 'xmind-embed-viewer';

import Loading from './Loading.vue';

const showLoading = ref(true);

const props = defineProps({
  url: String,
});

onMounted(async () => {
  const { XMindEmbedViewer } = await import('xmind-embed-viewer');
  const viewer = new XMindEmbedViewer({
    el: '#xmind-container',
    region: 'cn', // optional, global(default) or cn
  });

  viewer.setStyles({
    width: '100%',
    height: '100%',
  });

  const handleXmindMapReady = () => {
    showLoading.value = false;
    viewer.removeEventListener('map-ready', handleXmindMapReady);
  };

  viewer.addEventListener('map-ready', handleXmindMapReady);

  fetch(props.url)
    .then(res => res.arrayBuffer())
    .then(file => viewer.load(file))
    .catch(err => {
      showLoading.value = false;
      console.log('加载xmind文件出错！');
      viewer.removeEventListener('map-ready', callback);
    });
});
</script>

<style>
#xmind-container {
  display: flex;
  height: 80vh;
  align-items: center;
  justify-content: center;
}
</style>
