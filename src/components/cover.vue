<template>
  <div class="zmiti-cover-main-ui lt-full">
  	 <div class="zmiti-begin-btn" ref='btn'>
      <a href='#/index'><img src='../assets/begin-btn.png' /></a>
  	 	
  	 </div>
  	 <canvas ref='bg-canvas' class="zmiti-cover-bg-canvas" :width='viewW' :height='viewH'></canvas>
  </div>
</template>

<script>

import './css/cover.css';
import ZmitiSnow from './snow.js';
export default {
  name: 'cover',
  data () {
    return {
      viewW:document.documentElement.clientWidth,
      viewH:document.documentElement.clientHeight,
    }
  },
  created(){

  },
  methods:{
  	
  },
  mounted (){
  
  
  	
		
  


  
  }
}
</script>
