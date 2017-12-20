<template>
  <div>
  	<canvas v-if='!removeCanvas' :class="{'active':rotateCanvas}" @touchstart='touchstart($event)' @touchend='touchend' @touchmove='touchmove($event)' ref='canvas' id="canvas" :width='canvasSize' :height='canvasSize'></canvas>
  	<canvas v-if='!removeReelCanvas' class="zmiti-real-canvas" ref='zmiti-real-canvas' :width='viewW' :height="viewH"></canvas>
	<!-- <div class="zmiti-reel-C lt-full">
	
		<div class="zmiti-real-top">
			<img src="../assets/reell-top.png" />
		</div>
		<div ref='reel-content' class="zmiti-real-content" :class="{'active':showReel}">
			<img src='../assets/reel.png'/>
		</div>
		<div class="zmiti-real-bottom">
			<img src="../assets/reel-bottom.png" />
		</div>
	</div> -->

  	<div ref='bg-canvas' class="zmiti-bg-canvas" :style="{width:viewW+'px',height:viewH+'px'}" :width='viewW' :height='viewH'></div>
  	 <img src="../assets/bg.jpg" class="zmiti-cache-img" ref='zmiti-cache-img'>
  	 <img src="../assets/reel.png" class="zmiti-cache-img" ref='reel'>
  	 <img src="../assets/f1.png" class="zmiti-cache-img" ref='f1'>
  	 <img src="../assets/f2.png" class="zmiti-cache-img" ref='f2'>
  	 <img src="../assets/qrcode.png" class="zmiti-cache-img" ref='qrcode'>
  	 <img v-if='showTian' src="../assets/tian.png" :style="{width:this.canvasSize+'px'}" class="zmiti-tian-img" ref='tian'>

  	 <div class="zmiti-btn-group" v-if='!showgenerateImg'>
  	 	<div @click='rewrite'><img src='../assets/rewrite.png'/></div>
  	 	<div @click='finish'><img src='../assets/done.png'/></div>
  	 </div>
  	 <div class="zmiti-generate-img" :class="{'active':showgenerateImg}">
  	 	<img v-if='generateSrc'  :src='generateSrc'/>
  	 </div>
  	 <audio src='../src/media/photo.mp3' preload="load" ref='photo'></audio>
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
      removeCanvas:false,
      canvasSize:0,
	  showgenerateImg:false,

      removeReelCanvas:false,
      rotateCanvas:false,
      showTian:true,
      generateSrc:'',//http://api.zmiti.com/zmiti_ele/public/7fb7762a4cf7356308ad6e5e1d63c44e.png',

      smoothness:100,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){



  },
  methods:{
  	rewrite(){//重写
  		this.ctx.clearRect(0,0,this.canvasSize,this.canvasSize)
  	},
  	finish(){//完成
  		this.rotateCanvas = true;
  		this.drawQrcode();
  		this.showTian = false;
  		setTimeout(()=>{
  			this.removeCanvas = true;

  			this.reelContext.translate(this.viewW/2+this.canvasSize/2,this.ctx.canvas.offsetTop+this.canvasSize)
	  		this.reelContext.save();
	  		
	  		this.reelContext.rotate(180*Math.PI/180)
	  		this.reelContext.drawImage(this.ctx.canvas,0,0);
	  		this.reelContext.restore();
	  		this.$refs['photo'].play();
	  	
	  		 $.ajax({
                 url: 'http://api.zmiti.com/v2/share/base64_image/',
                 type: 'post',
                 data: {
                     setcontents: this.reelContext.canvas.toDataURL(),
                     setimage_w: this.viewW,
                     setimage_h: this.viewH
                 }
             }).done(data=>{
             	   if (data.getret === 0) {
                         var src = data.getimageurl;
                         this.generateSrc = src;
                         var img = new Image();
                         img.onload = ()=>{
                         	this.showgenerateImg = true;
                         };
                         img.src =src;
                         this.removeReelCanvas = true;
                     }
             })
  		},500)
  		

  	},
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

	    this.ctx.fillStyle = "rgba(239,66,61,0.25)";
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
	        x : e.clientX - (this.viewW-this.canvasSize)/2 + (document.body.scrollLeft || document.documentElement.scrollLeft),  
	        y : e.clientY - this.canvas.offsetTop  + (document.body.scrollTop || document.documentElement.scrollTop)  
	    }  
  	},
  	distance(a,b){
  		 var x = b.x-a.x , y = b.y-a.y;  
    	return Math.sqrt(x*x+y*y);
  	},
  	drawQrcode(){
  		var img = this.$refs['qrcode'];

  		this.reelContext.save();
		this.reelContext.translate(0,0);
		this.reelContext.drawImage(img,(this.viewW-70)/2,this.viewH - 80,70,70);
		this.reelContext.restore();
  	},
  	drawReel(context){

  		var img = this.$refs['reel'];
  		img.onload = function(){
  			var scale = .8;
  			var width = img.width*scale;
  			var height = img.height*scale;
  			this.reelWidth = width;
  			this.reelHeight=  height;
  			context.save();
  			//context.translate(this.viewW/2,this.viewH/2)
  			//context.rotate(180*Math.PI/180)
  			context.drawImage(img,(this.viewW-width)/2,.5*this.viewW/10,width,height);
  			context.restore();

  			this.canvasSize = width*.65

  		}.bind(this);


  	},
  	initReelCanvas(){
  		var canvas = this.$refs['zmiti-real-canvas'];
  		var context = canvas.getContext('2d');
  		this.drawReel(context);
  		return context;
  	},
  },
  mounted (){
  	var canvas = this.$refs.canvas;
  	this.canvas = canvas;
  	var context = canvas.getContext('2d');
  	this.ctx = context;
  	

  	var reelContext = this.initReelCanvas();
  	this.reelContext = reelContext;



  	//

  	//var bgCanvas = this.$refs['bg-canvas'];
  	var self = this;

  	//var bgContext = bgCanvas.getContext('2d');
  	this.$refs['zmiti-cache-img'].onload = function(){
  		///bgContext.drawImage(this.$refs['zmiti-cache-img'],0,0,this.viewW,this.viewH);

  		reelContext.drawImage(this.$refs['zmiti-cache-img'],0,0,reelContext.canvas.width,reelContext.canvas.height);
  		reelContext.drawImage(this.$refs['f1'],this.viewW - 70,0,70,53);
  		reelContext.drawImage(this.$refs['f2'],0,this.viewH/3,57,99);

  		var snowArr = [];
  		

  	/*	var t = setInterval(()=>{
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

      function render(){
  		    bgContext.clearRect(0, 0, self.viewW, self.viewH)
  			 snowArr.forEach(snow=>{
  			 	//snow.fly()
  			 })
  			animation(render)
  		}


  		render();*/
		
  	}.bind(this)


  
  }
}
</script>
