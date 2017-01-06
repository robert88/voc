var CSS3FLAG = (function () {
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition': '',
		'OTransition': 'O',
		'MozTransition': 'Moz',
		'WebkitTransition': 'Webkit',
		'MsTransition': 'Ms'
	}
	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t]
		}
	}
	return "";
})();


/**
 * css3动画事件
 *
 * */
var css3AnimateEndEventMap = {
	'O': 'oTransitionEnd',
	'Moz': 'transitionend',
	'Webkit': 'webkitTransitionEnd'
}
var css3TransitionMap = {
	'O': 'OTransition',
	'Moz': 'MozTransition',
	'Webkit': 'WebkitTransition'
}

var css3AnimateEndEvent = css3AnimateEndEventMap[CSS3FLAG] || "transitionend";
var css3Transition = css3TransitionMap[CSS3FLAG] || "transition"


/**
 *
 * css3动画的promise
 *
 * */
var g_cont = 0;//用来统计多个css3动画同时开始
function addCSS3Animate($target, aniOpt, callBack) {
	var dtd = $.Deferred(); // 新建一个deferred对象
	var len = $target.length;
	var count = 0;
	g_cont++
	var def = {
		duration: ".2s",
		property: "all",
		timingFunction: "ease-in-out",
		delay: ".1s",
		klass: "animate-show"
	}
	if (typeof aniOpt == "function") {
		callBack = aniOpt;
		aniOpt = null;
	}
	var opt = $.extend({}, def, aniOpt);
	var initCont = g_cont;
	$target.each(function () {
		$(this).off(css3AnimateEndEvent).on(css3AnimateEndEvent, function () {
			if ($(this).parents(".page").data("status") == "stop") {
				$(this).off(css3AnimateEndEvent);
				return;
			}
			$(this).off(css3AnimateEndEvent);
			count++;
			if (count == len) {
				dtd.resolve(); // 改变deferred对象的执行状态
			}
		})
		if (!$(this).data("css3")) {
			$(this).data("css3", true).css(css3Transition, [opt.property, opt.duration, opt.timingFunction, opt.delay].join(" "));
		}


	});


	//需要等待Deferred完全处理，另开线程
	if (typeof  callBack == "function") {
		callBack($target);
	} else {
		$target.addClass(opt.klass);
	}
	return dtd.promise();
}