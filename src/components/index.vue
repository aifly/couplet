<template>
  <div>


  	<div  class="zmiti-bg-canvas" :style="{width:viewW+'px',height:viewH+'px'}" :width='viewW' :height='viewH'>
  		<img v-if='src' src='../assets/cover.png' />
  		<img v-if='!src && !isshare' src="../assets/cover1.jpg" height="1207" width="750">
  		<div v-if='src' class="zmiti-wish-img">
  			<h1 style="height: .4rem;"></h1>
  			<div v-html="'*****'" :style='{fontWeight:"bold"}'></div>
  			<div>赠予你一个大“福”字</div>
  			<img class="zmiti-wish-bg" src="../assets/wish-bg.png"/>
  			<img class="zmiti-wish-src" :src='src'/>

  		</div>
  	</div>
  	<div class="zmiti-play" :class="{'active':bgPlay}" @click="toggleMusic">
  		<img src="../assets/bg-ico2.png">
  	</div>
  	<div class="zmiti-index-main-ui lt-full" :class="{'active':showIndex}">
  		<canvas v-show='!removeCanvas' :class="{'active':rotateCanvas}" @touchstart='touchstart($event)' @touchend='touchend' @touchmove='touchmove($event)' ref='canvas' id="canvas" :width='canvasSize' :height='canvasSize'></canvas>
  	<canvas v-if='!removeReelCanvas' class="zmiti-real-canvas" ref='zmiti-real-canvas' :width='viewW' :height="viewH"></canvas>

  	<canvas :class="{'show':showSnowCanvas}" class="zmiti-snow-canvas" ref='snow-canvas' :width='viewW' :height='viewH'></canvas>
 

  	
  	<div @click='showMask = true' :class="{'active':showShareBtn}" class="zmiti-share-btn"><img src='../assets/share-btn.png'/></div>
  	 <img src="../assets/bg.jpg" class="zmiti-cache-img" ref='zmiti-cache-img'>
  	 <img src="../assets/reel.png" class="zmiti-cache-img" ref='reel'>
  	 <img src="../assets/f1.png" class="zmiti-cache-img" ref='f1'>
  	 <img src="../assets/f2.png" class="zmiti-cache-img" ref='f2'>
  	 <img src="../assets/qrcode.png" class="zmiti-cache-img" ref='qrcode'>
  	 <img v-if='showTian' src="../assets/tian.png" :style="{width:this.canvasSize+'px'}" class="zmiti-tian-img" ref='tian'>

  	 <div class="zmiti-btn-group" v-if='showBtnGroup'>
  	 	<div @click='rewrite'><img src='../assets/rewrite.png'/></div>
  	 	<div @click='finish'><img src='../assets/done.png'/></div>
  	 </div>
  	 <div class="zmiti-generate-img" :class="{'active':showgenerateImg}">
  	 	<img v-if='generateSrc'  :src='generateSrc'/>
  	 </div>
  	 <audio src='http://h5.zmiti.com/public/couplet/media/photo.mp3' preload="load" ref='photo'></audio>
  	 <div v-if="showMask" @touchstart="showMask = false" class="zmiti-mask lt-full">
  	 	<img src='../assets/share-info.png'/>
  	 </div>
  	</div>

  	<div class="zmiti-cover-main-ui lt-full" :class="{'hide':showIndex}" >
  	 <div class="zmiti-begin-btn" ref='btn' @click='entryIndex'>
      <img src='../assets/begin-btn.png' />
  	 </div>
  	 <audio src='http://h5.zmiti.com/public/couplet/media/bg.mp3' autoplay  loop="loop" ref='bg-music'></audio>
  	 <canvas ref='bg-canvas' class="zmiti-cover-bg-canvas" :width='viewW' :height='viewH'></canvas>
  </div>
  </div>
</template>

<script>
import $ from 'jquery';
import './css/index.css';
import './css/cover.css';
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
      isshare:false,
      canvasSize:0,
      nickname:'',
	  showgenerateImg:false,
	  showMask:false,
      removeReelCanvas:false,
      rotateCanvas:false,
      src:'',
      showTian:true,
      showSnowCanvas:false,
      showIndex:false,
      sendNickname:"",
      beginSendWidth:false,
      showBtnGroup:true,
      bgPlay:false,
      showShareBtn:false,
      generateSrc:'',//http://api.zmiti.com/zmiti_ele/public/7fb7762a4cf7356308ad6e5e1d63c44e.png',

      smoothness:100,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){



  },
  methods:{

    	entryIndex(){
    		this.beginSendWidth = true
    		setTimeout(()=>{
    			this.showIndex = true;
    		},1000)
    	},
    	rewrite(){//重写
    		this.ctx.clearRect(0,0,this.canvasSize,this.canvasSize)
    	},

    	sendWish(){//去送祝福
    		this.dieSnowArr.forEach((snow,i)=>{
    			snow.spX = snow.spX === undefined ? (Math.random()*3+3) *(Math.random()-.5>0?1:-1) : snow.spX;
    			snow.spY = snow.spY === undefined ? -(Math.random()*10+3):snow.spY;
    			snow.spY++;
    			snow.y += snow.spY;
    			snow.x += snow.spX;
    			if(snow.y>this.viewH){
    				this.dieSnowArr.splice(i,1)
    			}

    		});
    	},

    	toggleMusic(){
    		this.$refs['bg-music'][this.$refs['bg-music'].paused?'play':'pause']();
    		this.bgPlay = !this.bgPlay;
    	},

    	snow(){
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
  	    var offsetTop = 500;
  	    setTimeout(()=>{
      	 offsetTop = this.$refs['btn'].offsetTop
      	},2000)

  	  	var bgContext =canvas.getContext('2d');
  	  	var dieSnowArr = [];
  	  	this.dieSnowArr = dieSnowArr;

      	function render(){
    		    bgContext.clearRect(0, 0, self.viewW, self.viewH)

    			 snowArr.forEach(snow=>{
  				snow.alive && snow.fly()
  				if(snow.x>3*rem+10 && snow.x<7*rem-10 && Math.abs(snow.y-offsetTop)<=2){
  					snow.speedY = 0;
  					snow.y = offsetTop+Math.random()*4; 
  					snow.speedX = 0;
  					snow.alive = false;

  					dieSnowArr.push(snow);

  			
  				}

  				if(!snow.alive){
  					snow.alive = true;
  					  snowArr.length<=260&&snowArr.push(new ZmitiSnow({
  		                    x:Math.random()*self.viewW,
  		                    y:-Math.random()*200+50,
  		                    cxt:bgContext
  		              }));
  				}
    			 });


    			 self.beginSendWidth && self.sendWish()
    			 if(!self.showIndex ){
    			 	animation(render)	
    			 }else{
    			 	snowArr.length = 0;
    			 }
    		   
    		}

    		render();
    	},

    	shareSnow(){
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
    	  var canvas = this.$refs['snow-canvas'];
    	  var bgContext = canvas.getContext('2d');
    	  var self = this;
        function render(){
    		    bgContext.clearRect(0, 0, self.viewW, self.viewH)
    			 snowArr.forEach(snow=>{
    			    snow.fly()
    			 })
    			animation(render)
    		}


    		render();
  		
    	},

    	filterOpacity(canvas){
    		var context = canvas.getContext('2d');
    		var imgData = context.getImageData(0,0,this.canvasSize,this.canvasSize);
    		var width = imgData.width,
    			height = imgData.height,
    			data = imgData.data;
    		for(var i =0;i<data.length;i+=4){
    			if(data[i]===255 && data[i+1]===255&&data[i+2]===255){
    				data[i+3]=0;
    			}
    		}
    		context.clearRect(0,0,this.canvasSize,this.canvasSize)
  		context.putImageData(imgData, 0, 0);

    	},

    	finish(){//完成
    		this.rotateCanvas = true;
    		this.drawQrcode();
    		this.showTian = false;
    		this.showBtnGroup = false,
    		this.showSnowCanvas = true;
    		this.isshare = true;
    		setTimeout(()=>{
    			this.removeCanvas = true;

    			this.shareSnow();

    			//this.reelContext.translate(this.viewW/2+this.canvasSize/2,this.ctx.canvas.offsetTop+this.canvasSize)
  	  		this.reelContext.save();
  	  		
  	  		//this.reelContext.rotate(180*Math.PI/180)
  	  		this.reelContext.drawImage(this.ctx.canvas,this.viewW/2-this.canvasSize/2,3.2*this.viewW /10);
  	  		this.reelContext.restore();
  	  		this.$refs['photo'].play();

  	  		var wishCanvas = this.$refs['canvas'];

  	  		$.ajax({
                   url: 'http://api.zmiti.com/v2/share/base64_image/',
                   type: 'post',
                   data: {
                       setcontents: wishCanvas.toDataURL('image/png'),
                       setwidth: this.canvasSize|0,
                       setheight: this.canvasSize|0
                   }
               }).done(data=>{
               	   if (data.getret === 0) {
                           var src = data.getimageurl;

                           console.log(src);

                           var nickname = this.nickname;

                           var URI = window.location.href.split('#')[0];
        							URI = this.changeURLPar(URI, 'nickname', nickname);
        							URI = this.changeURLPar(URI, 'src', src);
                      nickname ='*****'
        							this.wxConfig('收到'+nickname+'为你写的"福"字','快打开看看吧',URI);
                             
                             }
                     })
  	  	
  	  		 $.ajax({
                   url: 'http://api.zmiti.com/v2/share/base64_image/',
                   type: 'post',
                   data: {
                       setcontents: this.reelContext.canvas.toDataURL(),
                       setwidth: this.viewW|0,
                       setheight: this.viewH|0
                   }
               }).done(data=>{
               	   if (data.getret === 0) {
                           var src = data.getimageurl;

                           
                           this.generateSrc = src;
                           var img = new Image();
                           img.onload = ()=>{
                           	this.showgenerateImg = true;
                           	setTimeout(()=>{
                           		this.showShareBtn = true;
                           	},500)
                           };
                           img.src =src;
                           this.removeReelCanvas = true;
                       }
               })



    		},1200)
    		

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
    	wxConfig: function(title, desc,  url) {
  		var s = this;
  		var img = 'http://h5.zmiti.com/public/couplet/300.jpg';
  		var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

  		var durl = url || location.href.split('#')[0];
  		var code_durl = encodeURIComponent(durl);

  		$.ajax({
  			type: 'get',
  			url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
  			dataType: 'jsonp',
  			jsonp: "callback",
  			jsonpCallback: "jsonFlickrFeed",
  			error: function() {

  			},
  			success: function(data) {
  				wx.config({
  					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  					appId: appId, // 必填，公众号的唯一标识
  					timestamp: '1488558145', // 必填，生成签名的时间戳
  					nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
  					signature: data.signature, // 必填，签名，见附录1
  					jsApiList: ['checkJsApi',
  							'onMenuShareTimeline',
  							'onMenuShareAppMessage',
  							'onMenuShareQQ',
  							'onMenuShareWeibo',
  							'hideMenuItems',
  							'showMenuItems',
  							'hideAllNonBaseMenuItem',
  							'showAllNonBaseMenuItem'
  						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  				});

  				wx.ready(function() {

  					//朋友圈

  					wx.onMenuShareTimeline({
  						title: title, // 分享标题
  						link: durl, // 分享链接
  						imgUrl: img, // 分享图标
  						desc: desc,
  						success: function() {},
  						cancel: function() {}
  					});
  					//朋友
  					wx.onMenuShareAppMessage({
  						title: title, // 分享标题
  						link: durl,
  						imgUrl: img, // 分享图标
  						type: "link",
  						dataUrl: "",
  						desc: desc,
  						success: function() {},
  						cancel: function() {}
  					});
  					//qq
  					wx.onMenuShareQQ({
  						title: title, // 分享标题
  						link: durl, // 分享链接
  						imgUrl: img, // 分享图标
  						desc: desc,
  						success: function() {},
  						cancel: function() {}
  					});
  				});
  			}
  		});

  	},
  	getQueryString: function(name) {
  		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  		var r = window.location.search.substr(1).match(reg);
  		if (r != null) return (r[2]);
  		return null;
  	},

  	getOauthurl: function() {
  		var s = this;
  		var data = {
  			wxappid: 'wxfacf4a639d9e3bcc',
  			wxappsecret: "149cdef95c99ff7cab523d8beca86080"
  		}
  		$.ajax({
  			type: 'post',
  			url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
  			data: {
  				code: s.getQueryString('code'),
  				wxappid: data.wxappid,
  				wxappsecret: data.wxappsecret
  			},
  			error: function() {},
  			success: function(dt) {

  				if (dt.getret === 0) {


  					s.openid = dt.userinfo.openid;
  					s.nickname = dt.userinfo.nickname;
  					s.headimgurl = dt.userinfo.headimgurl;

  					window.nickname = s.nickname;
  					window.headimgurl = s.headimgurl;

  					var opt = {
  						nickname: s.nickname,
  						headimgurl: s.headimgurl
  					}
            s.nickname = '*****';
  					s.wxConfig('收到'+s.nickname+'为你写的"福"字','快打开看看吧');
  					


  				} else {
  					if (s.isWeiXin()) {
  						var nickname = s.getQueryString('nickname');
  						var src = s.getQueryString('src');

  						var redirect_uri = window.location.href.split('?')[0];

  						if (nickname) {
  							redirect_uri = s.changeURLPar(redirect_uri, 'nickname', (nickname));
  						}
  						if(src){
  							redirect_uri = s.changeURLPar(redirect_uri, 'src', (src));	
  						}

  						$.ajax({
  							url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
  							type: 'post',
  							data: {
  								redirect_uri: redirect_uri,
  								scope: 'snsapi_userinfo',
  								worksid: 30,
  								state: new Date().getTime() + ''
  							},
  							error: function() {},
  							success: function(dt) {
  								if (dt.getret === 0) {

  									window.location.href = dt.url;

  								}
  							}
  						})
  					} else {}

  				}


  			}
  		});
  	},
  	changeURLPar: function(url, arg, val) {
  		var pattern = arg + '=([^&]*)';
  		var replaceText = arg + '=' + val;
  		return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
  	},
  	isWeiXin: function() {
  		var ua = window.navigator.userAgent.toLowerCase();
  		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  			return true;
  		} else {
  			return false;
  		}
  	},
  	initParams(){
  		var s = this;
  		var nickname = s.getQueryString('nickname');
  		var src = s.getQueryString('src');

  		this.sendNickname = nickname;
  		this.src = src;


  	}
  },
  mounted (){
  	var canvas = this.$refs.canvas;
  	this.canvas = canvas;
  	var context = canvas.getContext('2d');
  	this.ctx = context;

  	var self = this;
  	document.addEventListener("WeixinJSBridgeReady", function() {
         WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
             self.$refs['bg-music'].play();
         });
     }, false);

  	this.initParams();

  	//this.$refs['bg-music'].play();
  	this.$refs['bg-music'].addEventListener('play',()=>{
  		this.bgPlay = true;
  	});

  	this.$refs['bg-music'].addEventListener('pause',()=>{
  		this.bgPlay = false;
  	})


  	var reelContext = this.initReelCanvas();
  	this.reelContext = reelContext;

  	this.snow();

  	//

  	//var bgCanvas = this.$refs['bg-canvas'];
 

  	//var bgContext = bgCanvas.getContext('2d');
  	this.$refs['zmiti-cache-img'].onload = function(){
  		///bgContext.drawImage(this.$refs['zmiti-cache-img'],0,0,this.viewW,this.viewH);

  		reelContext.drawImage(this.$refs['zmiti-cache-img'],0,0,reelContext.canvas.width,reelContext.canvas.height);
  		reelContext.drawImage(this.$refs['f1'],this.viewW - 70,0,70,53);
  		reelContext.drawImage(this.$refs['f2'],0,this.viewH/3,57,99);

  		//this.getOauthurl();
  		this.wxConfig('春节送祝福','春节送祝福，快来看看吧');
  		
  	}.bind(this) 
  }
}
</script>

<style scoped>
	.zmiti-cover-main-ui{
	/* 	background: url(../assets/cover.png) no-repeat center top;
	background-size: cover; */
	}
</style>