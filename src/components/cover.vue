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
  
  
  	var self = this;

  	//var bgContext = bgCanvas.getContext('2d');
  	var snowArr = [];
  		var t = setInterval(()=>{
  			if(snowArr.length>=200){
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
    var rem = this.viewW / 10;
    var offsetTop = this.$refs['btn'].offsetTop;
  	var bgContext =canvas.getContext('2d');

      function render(){
  		    bgContext.clearRect(0, 0, self.viewW, self.viewH)
  			 snowArr.forEach(snow=>{
  			 	!snow.die && snow.fly()
          if(snow.x>3*rem+10 && snow.x<7*rem-10 && Math.abs(snow.y-offsetTop)<=2){
            snow.speedY = 0;
            snow.speedX = 0;
            //snow.die = true;
            /*snowArr.push(new ZmitiSnow({
                    x:Math.random()*self.viewW,
                    y:-Math.random()*200+50,
                    cxt:bgContext
              }));*/
          }
  			 })
  			animation(render)
  		}

  		render();
		
  


  
  }
}
</script>
