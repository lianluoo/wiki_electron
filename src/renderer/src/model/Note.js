
import Content from './Content'
import {genID} from '@renderer/utils/secure'


export default class Note {
  constructor({id, title, type, content, parentId, created_at, updated_at}){

    this.id = id || genID()
    this.created_at = created_at || new Date().getTime()
    this.updated_at = updated_at
    this.parentId = parentId || 0
    this.title = title || 'undefined'
    this.type = type || 'text'
    this.content = content
    
  }

  setContent(value){
    this.content = value 
    this.updated_at = new Date().getTime()
  }
 
}