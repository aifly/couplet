<template>
  <div class="zmiti-cover-main-ui lt-full">
  	 <div class="zmiti-begin-btn">
  	 	<img src='../assets/begin-btn.png' />
  	 </div>
  	 <canvas ref='bg-canvas' class="zmiti-bg-canvas" :width='viewW' :height='viewH'></canvas>
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
  
  
  	var self = this;

  	//var bgContext = bgCanvas.getContext('2d');
  	var snowArr = [];
  		var t = setInterval(()=>{
  			if(snowArr.length>=100){
  				clearInterval(t);
  			}
  			snowArr.push(new ZmitiSnow({
		  		x:Math.random()*this.viewW,
          		y:-Math.random()*200+50,
		  		cxt:bgContext
		  	}));
  		},50)



      window.snowArr  = snowArr;

  		var animation = requestAnimationFrame || webkitRequestAnimationFrame;
  	var canvas = this.$refs['bg-canvas'];
  	var bgContext =canvas.getContext('2d');
      function render(){
  		    bgContext.clearRect(0, 0, self.viewW, self.viewH)
  			 snowArr.forEach(snow=>{
  			 	snow.fly()
  			 })
  			animation(render)
  		}

  		render();
		
  


  
  }
}
</script>
