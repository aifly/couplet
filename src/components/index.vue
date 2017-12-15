<template>
  <div>
  	<canvas @touchstart='touchstart($event)' @touchend='touchend' @touchmove='touchmove($event)' ref='canvas' id="canvas" :width='viewW' :height='viewH'></canvas>
  </div>
</template>

<script>
import $ from 'jquery';
import './css/index.css'
export default {
  name: 'index',
  data () {
    return {
      viewW:document.documentElement.clientWidth,
      viewH:document.documentElement.clientHeight,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
  
  },
  methods:{
  	touchstart(e){
  		this.startX = e.changedTouches[0].pageX;
  		this.startY = e.changedTouches[0].pageY;
  		this.context.beginPath();
  		this.context.lineWidth =5;
  		this.context.lineJoin='round';
  		this.context.moveTo(this.startX,this.startY);
  	

  	},
  	touchmove(e){

		this.endX = e.changedTouches[0].pageX;
  		this.endY = e.changedTouches[0].pageY;  		
  		this.context.lineTo(this.endX,this.endY);
  		this.context.stroke();
  
  	},
  	touchend(){
  	}
  },
  mounted (){
  	var canvas = this.$refs.canvas;
  	var context = canvas.getContext('2d');
  	this.context = context;
  	
  }
}
</script>
