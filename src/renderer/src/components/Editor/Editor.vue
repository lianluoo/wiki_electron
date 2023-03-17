<script setup>
import {ref} from 'vue'
import { useContentStore } from '../../stores/useContent';
import { useNoteStore } from '../../stores/useNote';
import Markdown from './editors/Markdown.vue'
import { MilkdownProvider } from '@milkdown/vue';

const contentStore = useContentStore()
const noteStore = useNoteStore()

const props = defineProps({
  type: String,
  content: Object,
  note: Object 
})

const {note} = props 


const content = ref('')

let contentObj = {}
contentStore.get(note.id).then(c => {
  contentObj = c
  content.value = contentObj.content
   
})

const onChange = _.debounce(e => {
   
   contentObj.content = content.value

   let reg = /(?=\S).*\s?/
   let result = reg.exec(content.value)
 
   if(result){
    const title = result[0].trim() 
    note.title = title 
    noteStore.update(note)
   }
 

   contentStore.update(contentObj).catch((e) => {
     console.log('更新失败',e);
   })
   
 }, 500) 

</script>

<template>
  <section class="wiki-editor">
    <template v-if="note.type === 'text'">
    <a-textarea v-model:value="content" placeholder="请输入" autoSize  :bordered="false" @change="onChange"></a-textarea>
  </template>
  <template v-else-if="note.type === 'markdown'">
    <MilkdownProvider>
     <Markdown v-model:value="content" />
    </MilkdownProvider>
  </template>
  </section>
</template>


<style lang="scss" scoped>
.wiki-editor {
  background-color: white;
}
</style>