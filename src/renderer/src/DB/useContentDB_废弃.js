/**
 * useNoteDB.js
 * 关于Note Store的操作，增删改查
 */

import openDB from "./db"

const STORENAME = 'Content'
 

export async function useContentDB(){

  const db = await openDB(STORENAME,2, (db) =>{

    let store = db.createObjectStore(STORENAME, {keyPath: 'noteId'})
    store.createIndex('content', 'title', {unique: false})
    store.createIndex('noteId', 'noteId', {unique: true})
    
 
  })



  /**
   * 在数据库中新增content
   * @param {*} content content对象
   * @returns Promise对象
   */
  function add(content){
    
    const clone = JSON.parse(JSON.stringify(content))
 
    
    return new Promise((resolve, reject) => {
      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)
      let req = store.add(clone)
     
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
   * @param {*} id clone id
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
   * 根据id更新content
   * @param {*} content 
   * @returns Promise对象
   */
  function update(content){

    return new Promise((resolve, reject) => {

      let transaction =  db.transaction([STORENAME], 'readwrite')
      let store = transaction.objectStore(STORENAME)

      let reqGet = store.get(content.noteId)
      reqGet.onsuccess = e => {
        let reqUpdate =  store.put(content)
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
