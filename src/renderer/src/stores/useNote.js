import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Dexie from "dexie"

import Note from '../model/Note'
 

import { db } from '../DB/db'


export const CALENDARID = 'calendar'

 
let calendar = await db.Note.get({
  id: CALENDARID
})

 
if(!calendar){
  const rootNote = new Note({
    title: '日记',
    id: CALENDARID
  })  
  await db.Note.add(rootNote).then(e => {
    console.log('日历 创建完成');
  })
  
}
 
 
const noteList = []

await db.Note.each(note => noteList.push(note))

 
export const useNoteStore = defineStore('note',  () => {

  const notes = ref(noteList)

  /**
   * 新增笔记
   * @param {*} note 
   * @returns 
   */
  function add(note){
 
    return db.Note.add(note).then((e) => {
      notes.value.push(note)
    })
   
  }
  
  /**
   * 移除笔记
   * @param {*} id 
   * @returns 
   */
  function remove(id) {
 

    return db.Note.delete(id).then(async e => {
      notes.value = await db.Note.toArray()
    })
  }

  function update(note) {
 
    const clone = Dexie.deepClone(note)

    return db.Note.put(clone).then( async e => {
      notes.value = await db.Note.toArray()
    })
     
    
  }

  /**
   * 获取笔记
   * @param {*} id 
   * @returns 
   */
  function getById(id) {

    return notes.value.find(note => note.id === id)
  }
  function getByTitle(title){
    return notes.value.find(note => note.title === title)
  }
  function getByTitleContain(title){
    return notes.value.find(note => note.title && note.title.indexOf(title) >= 0)
  }


  async function refresh(){
    notes.value = await db.Note.toArray()
  }

  return { 
    notes, 
    add,
    remove,
    update,
    getById,
    getByTitle,
    getByTitleContain,
    refresh,
  }
})
