<script setup>

import {ref, computed, reactive, toRefs} from 'vue'

const props = defineProps({
  value: Object 
})

// const {value} = toRefs(props)

const isOpen = ref(false)
const isFolder = computed(() => {
  return props.value.children && props.value.children.length 
})

function toggle() {
  isOpen.value = !isOpen.value
}

function changeType(){
  if(!isFolder.value){
    props.value.children = []
    addChild()
    isOpen.value = true 
  }
}

function addChild(){
  props.value.children.push({
    name: 'undefined'
  })

}
</script>

<template>
  <li >
    <div
      :class="{bold: isFolder}"
      class="tree-item"
      @click="toggle"
      @dbclick="changeType"
    >
    {{ value.name }}
    <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul class="tree-root" v-show="isOpen" v-if="isFolder">
      <TreeItem
        class="item"
        v-for="child in value.children"
        :value="child"
      >
      
      </TreeItem>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
}
</style>