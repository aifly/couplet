<template>
  <div>
  	<canvas @touchstart='touchstart($event)' @touchend='touchend' @touchmove='touchmove($event)' ref='canvas' id="canvas" :width='viewW*.7' :height='viewW*.7/(400/692)'></canvas>
  	<canvas ref='bg-canvas' class="zmiti-bg-canvas" :width='viewW' :height='viewH'></canvas>
  	 <img src="../assets/bg.jpg" class="zmiti-cache-img" ref='zmiti-cache-img'>
  	 <img src="../assets/reel.png" class="zmiti-cache-img" ref='reel'>

  	 <div class="zmiti-btn-group">
  	 	<div><img src='../assets/rewrite.png'/></div>
  	 	<div><img src='../assets/done.png'/></div>
  	 </div>
  </div>
</template>

<script>
import $ from 'jquery';
import './css/index.css';
import ZmitiSnow from './snow.js';
export default {
  name: 'index',
  data () {
    return {
      viewW:document.documentElement.clientWidth,
      viewH:document.documentElement.clientHeight,
      lineMin:10,
      lineMax:40,
      linePressure:2.5,
      smoothness:100,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
  
  },
  methods:{
  	touchstart(e){
  		this.startX = e.changedTouches[0].pageX;
  		this.startY = e.changedTouches[0].pageY;
  		/*this.context.beginPath();
  		this.context.lineWidth =10;
  		this.context.lineJoin='round';
  		this.context.moveTo(this.startX,this.startY);*/

  		this.moveFlag = true;  
	    this.has = this.has || [];  
	    this.upof = this.getXY(e);  
  	},
  	touchmove(e){
		this.endX = e.changedTouches[0].pageX;
  		this.endY = e.changedTouches[0].pageY;
  		/*this.startX = e.changedTouches[0].pageX;
  		this.startY = e.changedTouches[0].pageY;
  		this.context.lineTo(this.endX,this.endY);
  		this.context.stroke();*/

  		 if (!this.moveFlag)  
		     return;  
	    var of = this.getXY(e);  
	    var up = this.upof;  
	    var ur = this.radius;  
	    this.has.unshift({time:new Date().getTime() ,dis:this.distance(up,of)});  
	    var dis = 0;  
	    var time = 0;  
	    for (var n = 0; n < this.has.length-1; n++) {  
	        dis += this.has[n].dis;  
	        time += this.has[n].time-this.has[n+1].time;  
	        if (dis>this.smoothness)  
	            break;  
	    }  
	    var or = Math.min(time/dis*this.linePressure+this.lineMin , this.lineMax) / 2;  
	    this.radius = or;  
	    this.upof = of;  
	    if (this.has.length<=1)  
	        return;  
	    var len = Math.round(this.has[0].dis/2)+1;  
	    for (var i = 0; i < len; i++) {  
	        var x = up.x + (of.x-up.x)/len*i;  
	        var y = up.y + (of.y-up.y)/len*i;  
	        var r = ur + (or-ur)/len*i;  
	        this.ctx.beginPath();  
	        this.ctx.arc(x,y,r/2,0,2*Math.PI,true);  
	        this.ctx.fill();  
	    }  
  
  	},
  	touchend(){
  		 this.moveFlag = false;  
  	},
  	getXY(e){
  		var e = e.changedTouches[0];
  		return {  
	        x : e.clientX - this.canvas.offsetLeft + (document.body.scrollLeft || document.documentElement.scrollLeft),  
	        y : e.clientY - this.canvas.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop)  
	    }  
  	},
  	distance(a,b){
  		 var x = b.x-a.x , y = b.y-a.y;  
    	return Math.sqrt(x*x+y*y);
  	},
  	drawReel(context){
  		var img = this.$refs['reel'];
  		img.onload = function(){
  			context.drawImage(img,0,0,context.canvas.width,context.canvas.height)
  		}.bind(this)
  	}
  },

  mounted (){
  	var canvas = this.$refs.canvas;
  	this.canvas = canvas;
  	var context = canvas.getContext('2d');
  	this.ctx = context;
  	this.ctx.fillStyle = "rgba(239,66,61,0.25)";

  	//this.drawReel(this.ctx);

  	var bgCanvas = this.$refs['bg-canvas'];
  	var self = this;

  	var bgContext = bgCanvas.getContext('2d');
  	this.$refs['zmiti-cache-img'].onload = function(){
  		bgContext.drawImage(this.$refs['zmiti-cache-img'],0,0,this.viewW,this.viewH);

  		var snowArr = [];
  		for(var i=0;i<400;i++){
  			snowArr.push(new ZmitiSnow({
		  		x:Math.random()*this.viewW,y:-10,
		  		cxt:bgContext
		  	}));
  		}

  		console.log(snowArr)

  		var animation = requestAnimationFrame || webkitRequestAnimationFrame;
  		//context.clearRect(0, 0, this.width, this.height)

  		function render(){
  			 snowArr.forEach(snow=>{
  			 	snow.fly(()=>{
  			 		bgContext.drawImage(self.$refs['zmiti-cache-img'],0,0,self.viewW,self.viewH);
  			 	})
  			 })
  			animation(render)
  		}


  		render();
		
  	}.bind(this)

  
  }
}
</script>
