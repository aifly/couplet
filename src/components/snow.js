export default class ZmitiSnow {
	constructor(option = {}) {
		this.x = option.x;
		this.y = option.y;
		this.r = 2;
		this.opacity = Math.random() + .3;
		this.draw(option.cxt);
		this.context = option.cxt;
		this.width = option.cxt.canvas.width;
		this.height = option.cxt.canvas.height;
	}
	draw(context) {
		var opacity = this.opacity.toFixed(2);
		context.fillStyle = 'rgba(0,0,0,' + opacity + ')';
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
		context.closePath();
		context.fill();
	}
	fly(fn) {

		this.y += 3;;
		this.x += .2;
		fn && fn();
		this.draw(this.context);

		if (this.y > this.height + this.r * 2) {
			this.y = 0;
		}
	}

}