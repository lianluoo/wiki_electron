<script setup>

// import '../style/milkdownEditor.scss'
import { Milkdown, useEditor } from '@milkdown/vue';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord'
import "@milkdown/theme-nord/style.css"
import { commonmark } from '@milkdown/preset-commonmark'
 
const props = defineProps({
  value: String 
})
const emit = defineEmits(['update:value'])

const markdown =
`# Milkdown Vue Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.`

useEditor((root) => {
  return Editor.make()
    
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
    })
    .config(nord)
    .use(commonmark)
 
})
</script>

<template>
  <Milkdown />
</template>

<style>

</style>