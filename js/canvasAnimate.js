
window.requestAnimationFrame = (function () {

	return window.requestAnimationFrame ||    //IE10以及以上版本，以及最新谷歌，火狐版本

		window.webkitRequestAnimationFrame ||  //谷歌老版本

		window.mozRequestAnimationFrame ||//火狐老版本

		function (callback) {  //IE9以及以下版本

			return window.setTimeout(callback, 1000 / 60);//这里强制让动画一秒刷新60次，这里之所以设置为16.7毫秒刷新一次，是因为requestAnimationFrame默认也是16.7毫秒刷新一次。

		}
})();

window.cancelAnimationFrame = (function () {

	return window.cancelAnimationFrame ||    //IE10以及以上版本，以及最新谷歌，火狐版本

		window.webkitCancelAnimationFrame ||  //谷歌老版本

		window.mozCancelAnimationFrame ||//火狐老版本

		window.clearTimeout
})();


/**
 *
 *
 * 画布对象
 *
 *
 *
 * */

function CanvasAnimate(opts) {
	this.opts = $.extend(true, {}, opts);
	this.c = opts.c;
	this.ctx = opts.c.getContext("2d");
	this.object2dAnimateQueue = [];
	this.loopAnimate();
	return this
}
/**
 *
 *
 * 为动画添加效果和时效*
 *
 * */
function AnimateCounter(opts) {
	var def = {
		start: 0,
		end: 0,
		duration: 500,
		animateType: "easeOutQuad",
		loop: false,//值会跳会开始位置
		rockback: false//值会回滚到原来位置
	}
	$.extend(this, def, opts);
}
/**
 *
 * 粒子对象
 *
 * */
function Particle(opts) {
	var def = {

		//划线
		animateLineOpts: {
			duration: 500,
			animateType: "easeOutQuad",
		},
		x: 0,
		y: 0,
		src: ""
	}

	$.extend(this, def, opts);

	//图片对象
	if (this.src) {
		this.image = new Image();
		this.image.src = this.src;
		var that = this;
		this.image.onload = function () {
			that.image.status = "ready";
		}
	}

}


/**
 *
 * 动画对象
 *
 *
 * */
function Object2d(opts) {

	var def = {
		rotateAnimateOpts: {
			start: 0, end: 360,
			loop: true,
			animateType: "linear"
		},
		promise: $.Deferred(),
		id: this.__proto__.uuid++,
		render: null,
		delay: 0, //延迟时间
		count: 0,
		drawData: [],
		opts: {
			data: []
		}
	}

	$.extend(this, def, opts);

	//将原始数据转换为粒子对象
	for (var i = 0; i < opts.data.length; i++) {
		this.opts.data.push(new Particle(opts.data[i]))
	}

	this.copyData = $.extend([], this.opts.data);

	return this
}


/**
 *
 *
 * 将单个整体的动画添加到画布中
 *
 *
 * */
CanvasAnimate.prototype.pushAnimate = function (object2d) {
	this.object2dAnimateQueue.push(object2d);
	return object2d.promise;
}

/**
 *
 *
 *
 * 画布遍历对象开始画图
 *
 *
 * */
CanvasAnimate.prototype.loopAnimate = function () {

	//画布对象
	var canvasObj = this;

	//一组动画对象
	var object2dGroup = canvasObj.object2dAnimateQueue;

	//重新绘制
	canvasObj.c.width = canvasObj.c.width;

	//防止连续调用
	cancelAnimationFrame(canvasObj.timer);

	var len = object2dGroup.length;
	var j = 1;
	for (var i = 0; i < j; i++) {
		//前面已经ok了就可以播放下个
		if (object2dGroup[i] && object2dGroup[i].draw(canvasObj) === true) {
			j++;
			if (j > len) {
				j == len;
			}
		}
	}

	//直接锁住画布，可以停在重绘
	if (!canvasObj.lock) {
		canvasObj.timer = requestAnimationFrame(function () {
			canvasObj.loopAnimate();
		});
	}
}

/**
 *
 * 动画函数
 * t: current time, b: begInnIng value, c: change In value, d: duration
 *
 * */
AnimateCounter.prototype.animateFunc = {
	easeInQuad: function (x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	linear: function (x, t, b, c, d) {
		if (t - d > 0) {
			t = d * 2 - t;
		}
		return c * t / d + b;
	}
};

/**
 *
 *
 *
 * 画点闪烁
 *
 *
 *
 * */
CanvasAnimate.prototype.drawGroupDian = function (dian, animateCounter,r) {

	//根据粒子对象
	if(animateCounter){
        r = animateCounter.getCount();
	}

	//开始一个新的绘制路径
	var ctx = this.ctx;
	ctx.beginPath();
	if (r > 0) {
		ctx.arc(dian.x, dian.y, r, 0, Math.PI * 2, false);
	}
	ctx.fill()
}


/**
 *
 *
 *
 * 获取当前动画的参数
 *
 *
 *
 * */
AnimateCounter.prototype.getCount = function () {

	if (!this._startTime) {
		this._startTime = new Date().getTime();
	}

	this._currentTime = new Date().getTime() - this._startTime;

	//不循环动画
	if (this.loop) {
		if (this._currentTime > this.duration) {
			this._startTime = new Date().getTime();
			this._currentTime = this.duration;
		}
		//循环动画
	} else if (this.rockback) {
		if (this._currentTime > (this.duration * 2)) {
			this._startTime = new Date().getTime();
			this._currentTime = this.duration * 2;
		}
	} else {
		if (this._currentTime > this.duration) {
			this._currentTime = this.duration;
		}
	}
	return this.animateFunc[this.animateType](null, this._currentTime, this.start, this.end - this.start, this.duration)
}

/**
 *
 *
 *
 * 旋转动画
 *
 *
 * */
CanvasAnimate.prototype.rotate = function (animatecounter, rotateObj) {

	//开始一个新的绘制路径
	var ctx = this.ctx;
	var x = rotateObj.x;
	var y = rotateObj.y;
	var width = rotateObj.width;
	var height = rotateObj.height;
	ctx.translate(x + .5 * width, y + .5 * height);
	ctx.rotate(animatecounter.getCount() * Math.PI / 180);
	ctx.translate(-x - .5 * width, -y - .5 * height);
}
/**
 *
 *
 *
 * 显示动画
 *
 *
 * */
CanvasAnimate.prototype.show = function (animatecounter) {
	var ctx = this.ctx;
	ctx.globalAlpha = animatecounter.getCount();
}
/**
 *
 *
 *
 * 由一个点对应多个点逐步画线,已经显示的点才可以连线
 *
 *
 * */
CanvasAnimate.prototype.drawGroupLine = function (dian, object2d) {
	dian.visibility = true;


	var lineTos = dian.lineTo.split(",");
	var count = 0;
	for (var i = 0; i < lineTos.length; i++) {

		//根据对应的点来画线
		var dian2 = object2d.opts.data[(lineTos[i] * 1)];

		//这两个点都存在，且已经显示
		if (dian2 && dian2.visibility) {

			//已两个点作为线对象的id

			var lineId = "dian" + dian.index + "dian" + dian2.index;

			var lineObj = dian[lineId] = dian[lineId] || new AnimateCounter(dian.animateLineOpts);

			this.drawLine(dian, dian2, lineObj);

			if (lineObj.lineok) {
				count++
			}
		}

	}

	// 该点对应的线全部ok了
	if (count >= lineTos.length) {
		dian.lineok = true;
	}
}
/**
 *
 *
 *
 * 由一个点对应多个点逐步画线
 *
 *
 * */
CanvasAnimate.prototype.drawLine = function (dian1, dian2, lineObj) {

	var x, y;

	if (dian1.x == dian2.x) {
		x = dian1.x;
		lineObj.start = dian1.y;
		lineObj.end = dian2.y
		y = lineObj.getCount();
	} else {
		lineObj.start = dian1.x;
		lineObj.end = dian2.x;
		x = lineObj.getCount();
		y = (x - dian2.x) / (dian1.x - dian2.x) * (dian1.y - dian2.y) + dian2.y;
	}

	/*误差在0.5之内算ok*/
	if (Math.abs(y - dian2.y) < 0.5) {
		lineObj.lineok = true;
	}

	var c = this.c;
	var ctx = this.ctx;
	ctx.beginPath();
	ctx.moveTo(dian1.x, dian1.y);
	ctx.lineTo(x, y);
	ctx.stroke();
}
CanvasAnimate.prototype.drawImage = function (imgParticle) {
	if (imgParticle.image.status == "ready") {
		var c = this.c;
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.drawImage(imgParticle.image, imgParticle.x, imgParticle.y, imgParticle.image.width, imgParticle.image.height)
	}
}
CanvasAnimate.prototype.drawRect = function (kuangParticle, animatecounter) {
	var ctx = this.ctx;
	ctx.beginPath();
	var w = animatecounter.getCount();
	ctx.fillRect(kuangParticle.x, kuangParticle.y, w, kuangParticle.h);

}


Object2d.prototype.uuid = 0;

/**
 *
 *
 *
 * 开启画笔
 *
 *
 * */
Object2d.prototype.draw = function (canvasObj) {

	//第一次的开始时间
	if (!this._startTime) {
		this._startTime = new Date().getTime();
	}

	//当前时间
	this._currentTime = new Date().getTime() - this._startTime;

	//延时
	if (this._currentTime > this.delay) {
		if (typeof this.render == "function") {

			/*已返回值来做判断动画可以过渡到下一帧*/
			var status = this.render(canvasObj);

			// 提供一个整体的时间，执行了1666次之后归0
			this.count++;
			if (this.count > 100000) {
				this.count = 0
			}

			//返回状态
			return status;
		}
	}
}

/**
 *
 *
 *
 * 绘画的时间分解
 *
 *
 * */
Object2d.prototype.pll = function (callback, time) {
	var flag = this.count % Math.floor(time / 16.7);//3*16.7
	if (flag == 0) {
		callback.call(this)
	}
}
