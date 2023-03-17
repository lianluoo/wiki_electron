import Dexie from "dexie"
import 'dexie-export-import';
import download from "downloadjs";

const DBNAME = import.meta.env.VITE_DBNAME
const DBVERSION = 1 

export let db = new Dexie(DBNAME)
db.version(DBVERSION).stores({
  Note: 'id, title, updated_at, created_at, type',
  Content: 'noteId, content'
})


export async function exportDB(){
  const db = await new Dexie(DBNAME).open()
  const blob = await db.export()
  download(blob, 'wiki_data.zip', 'application/zip')
}

export function importDB(){
  const fileDom = document.createElement('input')
  fileDom.type = 'file'
  // fileDom.style.width = 0
  // fileDom.style.height = 0
  document.body.append(fileDom)

  fileDom.onchange = async () => {
    if(!fileDom.files.length){
      console.log('没有选择文件, 请重新导入', fileDom.files);
      document.body.removeChild(fileDom)
      return
    }
  
    const file = fileDom.files[0]
    db = await Dexie.import(file, {
      overwriteValues: true,
      clearTablesBeforeImport: false,
      progressCallback: ({totalTables, completedTables, totalRows, completedRows, done}) => {
        console.log(`${completedRows}/${totalRows} ${completedTables}/${totalTables}`);
        if(done){
          console.log('done!')
          document.body.removeChild(fileDom)
        }
      }
    })
  }
  fileDom.click() 

  

  

}