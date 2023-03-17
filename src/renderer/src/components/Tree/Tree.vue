<script setup>
import TreeItem from './TreeItem.vue'
import {watch} from 'vue'

const props = defineProps({
  value:Object
})

 
</script>

<template>
  <ul class="tree-root">
    <TreeItem :value="value"></TreeItem>
  </ul>
</template>

<style lang="scss">
.tree-root {
  list-style: none;
  
}
.tree-item {
 
}
</style>