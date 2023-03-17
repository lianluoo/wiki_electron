/**
 * useNoteDB.js
 * 关于Note Store的操作，增删改查
 */

import openDB from "./db"

const STORENAME = 'Note'
 

export async function useNoteDB(){

  const db = await openDB(STORENAME, 1, (db) =>{

    let store = db.createObjectStore(STORENAME, {keyPath: 'id'})
    store.createIndex('title', 'title', {unique: false})
    store.createIndex('id', 'id', {unique: true})
    store.createIndex('updated_at', 'updated_at', {unique: false})
    store.createIndex('created_at', 'created_at', {unique: false})
    store.createIndex('type', 'type', {unique: false})
  })



  /**
   * 在数据库中新增Note
   * @param {*} note Note对象
   * @returns Promise对象
   */
  function add(note){
    
    const noteClone = JSON.parse(JSON.stringify(note))
 
    
    return new Promise((resolve, reject) => {
      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)
      let req = store.add(noteClone)
     
      req.onerror = e => {
        reject(e)
      }

      req.onsuccess = e => {
        resolve(e)
      }
      
    })
  }

  /**
   * 根据id在数据库中删除Note
   * @param {*} id Note id
   * @returns Promise对象
   */
  function remove(id){
    return new Promise((resolve, reject) => {
      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)
      let req = store.delete(id)
      req.onerror = e => {
        reject(e)
      }

      req.onsuccess = e => {
        resolve(e)
      }
    })
  }

  /**
   * 根据id从数据库中获取Note
   * @param {*} id Note id
   * @returns Promise对象
   */
  function get(id){

    return new Promise((resolve, reject) => {

      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)
      let req = store.get(id)
      req.onerror = e => {
        reject(e)
      }
  
      req.onsuccess = e => {
        resolve(e.target.result)
      }

    })

  }
  /**
   * 
   * @returns 获取所有的Notes
   */
  function gets(){
    return new Promise((resolve, reject) => {

      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)


      // 方式1
      let notes = []
      store.openCursor().onsuccess = (e) => {
        let cursor = e.target.result

        if(cursor){
          notes.push(cursor.value)
          cursor.continue()
        }else {
          resolve(notes)
        }
      }
      store.openCursor().onerror = (e) => {
        reject(e)
      }

      // 方式2
      // store.getAll().onsuccess = e => {
      //   resolve(e.target.result)
      // }

      // store.getAll().onerror = e => {
      //   reject(e)
      // }

    })
  }


  /**
   * 根据id更新Note
   * @param {*} note 
   * @returns Promise对象
   */
  function update(note){

    return new Promise((resolve, reject) => {

      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)

      let reqGet = store.get(note.id)
      reqGet.onsuccess = e => {
        let reqUpdate =  store.put(note)
        reqUpdate.onerror = e => {
          reject(e)
        }
        reqUpdate.onsuccess = e => {
          resolve(e)
        }
      }
      
    })
  }
  
  return {
    add,
    remove,
    get,
    gets,
    update,
  }
}
