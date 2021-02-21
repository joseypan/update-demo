<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'update-demo',
    created(){
      let {ipcRenderer} = this.$electron;
      ipcRenderer.on('message',(e,arg)=>{
        alert(e,arg)
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
