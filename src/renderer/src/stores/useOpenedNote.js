import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
 
export const useOpenedNoteStore = defineStore('openedNote',  () => {

 
  const notes = ref([])
 
  function add(note) {
    notes.value.push(note)
  }
  function setNotes(list){
    notes.value = list 
  }
  function get(id){
    return notes.value.find(note => note.id === id )
  }
  

  return { 
    notes, 
 
    add,
    setNotes,
    get
  }
})
