import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
 
export const useAppStore = defineStore('app',  () => {


  const defaultType = ref('text')

  const setDefaultType = type => {
    defaultType.value = type 
  }

  return { 
    defaultType,
    setDefaultType,
  }
})
