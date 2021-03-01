<template>
  <div id="app">
    下载进度{{percent}}
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'update-demo',
    data(){
      return{
        percent:0
      }
    },
    created(){
      let {ipcRenderer} = this.$electron;
      ipcRenderer.on('message',(e,arg)=>{
        this.percent=(arg.data.percent).toFixed(1)
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
