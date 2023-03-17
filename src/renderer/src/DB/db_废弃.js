


function openDB(storeName, version, upgradedFn) {
  
  return new Promise((resolve, reject) => {
    let req = window.indexedDB.open(DBNAME, version)

    req.onerror = (e) => {
      reject(e)
    }
    req.onupgradeneeded = (e) => {
      let db = e.target.result 

      if (db.objectStoreNames.contains(storeName)){
        console.log(storeName, ' 已存在');
        return
      } 

      upgradedFn(db) 
     
      console.log(storeName, ' 已创建');
    }

    req.onsuccess = (e) => {
      console.log('数据库创建完成');
      resolve(e.target.result)
    }
  })
}

export default openDB 

