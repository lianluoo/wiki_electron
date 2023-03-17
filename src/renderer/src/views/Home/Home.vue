
<script setup>
import { ref, computed} from 'vue'
import Note from '@renderer/model/Note'
import {useNoteStore, CALENDARID} from '@renderer/stores/useNote'
import {useOpenedNoteStore} from '@renderer/stores/useOpenedNote'
import {useContentStore} from '@renderer/stores/useContent'
import { useAppStore } from '../../stores/useApp'

import dayjs from 'dayjs'
import Editor from '../../components/Editor/Editor.vue'
import Content from '@renderer/model/Content'
import {MenuOutlined} from '@ant-design/icons-vue'
import {importDB, exportDB} from '@renderer/DB/db'

const noteStore = useNoteStore()
const openedNoteStore = useOpenedNoteStore()
const contentStore = useContentStore()
const appStore = useAppStore()

function listToTree(list, tree, parentId){
  list.forEach(item => {
    if(item.parentId === parentId){
      const child = {
        ...item,
        children: []
      }
      listToTree(list, child.children, item.id)

      if(child.children.length <= 0){
        delete child.children
      }
      tree.push(child)
    }
  })
}
 
const gData = computed(() => {

  const childrenNotes= []
  listToTree(noteStore.notes, childrenNotes,0)
 
  // console.log(childrenNotes);
  
  return childrenNotes
 
})
const expandedKeys = ref([])
const selectedKeys = ref([])
const onContextMenuClick = (treeKey, menuKey) => {
      console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);

      switch(menuKey){
        case 'new': 
        newNote(appStore.defaultType, treeKey)
        break
        case 'newMarkdown':
          newNote('markdown', treeKey)
          break;
      }
};
const onSelect = () => {

}
const onTitleDbClick = async (id, title) => {
  const note = noteStore.getById(id)
  if(openedNoteStore.get(note.id)){
    activeKey.value = note.id 
    return 
  }
  const content = await contentStore.get(id)
  if(!note) {
    console.log(`${title} 打开失败`);
    return
  }

  if(!content){
 
   const content = new Content({
      noteId: note.id,
      content: '',
    })
    if(note.title !== 'undefined'){
      content.content = note.title 
    }


    contentStore.add(content).catch(e => {
      console.log('Content add error', e);  
    })
   
  }
  openedNoteStore.add(note)
  activeKey.value = note.id 

}
  
 

const panes = computed(() => {
  return openedNoteStore.notes
})
const activeKey = ref(panes.length && panes[0].id) 
const newTabIndex = ref(0);

const newNote = (type, parentId) => {
  const note = new Note({
    title: 'undefined',
    parentId,
    type,

  })
  const content = new Content({
    noteId: note.id,
    content: ''
  })

  noteStore.add(note)
  contentStore.add(content)
  openedNoteStore.add(note)
  
  selectedKeys.value = [note.id]
  // expandedKeys.value = [newNote.id]
  expandedKeys.value.push(note.parentId)
  activeKey.value = note.id 
}
const add = () => {

  const now = dayjs()
  const year = now.format('YYYY年')
  const month = now.format('M月')
  const day = now.format('D日')



  // TODO 有点问题，月份 日 可能是其他children中的
  let yearNote = noteStore.getByTitleContain(year)
  let monthNote = noteStore.getByTitleContain(month)
  let dayNote = noteStore.getByTitleContain(day)

  if(!yearNote) {
    yearNote = new Note({
      title: year,
      parentId: CALENDARID
    })
    noteStore.add(yearNote)
  }
  if(!monthNote) {
    monthNote = new Note({
      title: month,
      parentId: yearNote.id
    })
    noteStore.add(monthNote)
  }
  if(!dayNote) {
    dayNote = new Note({
      title: day,
      parentId: monthNote.id
    })
    noteStore.add(dayNote)
  }
  
  
  


  newNote(appStore.defaultType, dayNote.id )
  
};
const remove = targetKey => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.id === targetKey) {
      lastIndex = i - 1;
    }
  });
  const openedList = panes.value.filter(pane => pane.id !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].newTabIndex;
    } else {
      activeKey.value = panes.value[0].id;
    }
  }
  openedNoteStore.setNotes(openedList)
};
const onEdit = (targetKey, action) => {
  if (action === 'add') {
    add();
  } else {
    remove(targetKey);
  }
};

const onTabChange = (key) => {
selectedKeys.value = [key]
}

const onImport = () => {
  importDB()
}
const onExport = () => {
  exportDB()
}
</script>

<template>
 
 <a-layout style="min-height: 100vh">
  <a-layout-sider :width="300" :style="{ overflow: 'auto', height: '100vh',  backgroundColor: 'white' }">
   <div>
    <a-dropdown>
      <a-button shape="circle">
        <template #icon><MenuOutlined /></template>
      </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="onImport">导入</a-menu-item>
        <a-menu-item @click="onExport">导出</a-menu-item>
        <!-- <a-sub-menu key="sub1" title="sub menu">
          <a-menu-item>3rd menu item</a-menu-item>
          <a-menu-item>4th menu item</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2" title="disabled sub menu" disabled>
          <a-menu-item>5d menu item</a-menu-item>
          <a-menu-item>6th menu item</a-menu-item>
        </a-sub-menu> -->
      </a-menu>
    </template>
  </a-dropdown>
   </div>
    <a-directory-tree
    class="draggable-tree"
    block-node
    :expandAction="false"
    v-model:expandedKeys="expandedKeys"
    v-model:selectedKeys="selectedKeys"
    autoExpandParent
    :fieldNames="{children:'children', title:'title', key:'id' }"
    :tree-data="gData"

    @select="onSelect"
    
  >
  <!-- 标题 -->
  <template #title="{ id: treeKey, title }">
      <a-dropdown :trigger="['contextmenu']">
        <div @dblclick="onTitleDbClick(treeKey, title)" style="display: inline-block; flex: 1; white-space: nowrap;" :title="title">{{ title }}</div>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <a-menu-item key="new">新建</a-menu-item>
            <a-menu-item key="newMarkdown">新建Markdown</a-menu-item>
           
          </a-menu>
        </template>
      </a-dropdown>
    </template>

  <!-- 图标 -->
  <template #icon="{type}">
    

  </template>
  </a-directory-tree>
  </a-layout-sider>
  <a-layout class="rigth-content">
    <a-layout-content>
      <a-tabs v-model:activeKey="activeKey" type="editable-card" @change="onTabChange" @edit="onEdit">
        <a-tab-pane key="overview" tab="概览" :closable="false">
          <div>Search</div>
        </a-tab-pane>
        <a-tab-pane v-for="pane in panes" :key="pane.id" :tab="pane.title" :closable="pane.closable">
          <Editor :note="pane"/>
        </a-tab-pane>
    </a-tabs>
  </a-layout-content>
  </a-layout>
 </a-layout>

</template>   

<style lang="scss" >

.draggable-tree {
  .ant-tree-node-content-wrapper , .ant-tree-title {
    display: inline-flex;
 
    
    align-items: center;
  }

  .ant-tree-title {
    flex: 1;
  }
}


</style>

<style lang="scss" scoped>
.rigth-content {
  background-color: white;
}
</style>
