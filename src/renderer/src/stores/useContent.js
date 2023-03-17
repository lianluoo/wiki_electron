import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { db } from '../DB/db'
import Dexie from "dexie"
export const useContentStore = defineStore('Content', () => {
   
  function add(content){
    const clone = Dexie.deepClone(content)
 
    return db.Content.add(clone)
  }
  function remove(id){
    return db.Content.delete(id)
  }
  function update(content){
    const clone = Dexie.deepClone(content)
    return db.Content.put(clone)
  }
   function get(id){
 
    return  db.Content.get({
      noteId: id 
    })
  }

  return { add, remove, update, get}
})
