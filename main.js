;
(function () {

	//等比
	function getResize(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	function getRagen(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}

	function getMedia(minh, maxh) {
		var str = [
			'',
			'.height1-6{',
			'height:{0}rem;',
			'}',
			'.height1-6.mid{',
			'line-height:{0}rem;',
			"}",
			'.height1-12{',
			'height: {1}rem;',
			'}',
			'.height1-12.mid{',
			'line-height:{1}rem;',
			"}",
			'.height1-3{',
			'height: {2}rem;',
			'}',
			'.height1-3.mid{',
			'line-height:{2}rem;',
			"}",
			'.height1-4{',
			'height: {3}rem;',
			'}',
			'.height1-4.mid{',
			'line-height:{3}rem;',
			"}",
			'.height1-8{',
			'height: {4}rem;',
			'}',
			'.height1-8.mid{',
			'line-height:{4}rem;',
			"}",
			"}"
		]
		if (minh && !maxh) {
			str[0] = '@media screen and (max-height: {0}px){'.tpl(minh);
		} else if (minh && maxh) {
			str[0] = '@media screen and (min-height: {0}px) and (max-height: {1}px) {'.tpl(minh, maxh);
		} else {
			str[0] = '@media screen and (min-height: {0}px)  {'.tpl(maxh);
		}
		var curh = (maxh || minh);
		var remroot = getResize(800, 350, curh, 125, 75);
		var setH = curh / (remroot / 100 * 16);

		return str.join("").tpl(setH / 6, setH / 12, setH / 3, setH / 4, setH / 8);

	}


	function initStyle() {
		var styleStr = [
			getMedia(350, null)
		]

		for (var i = 350; i < 800; i += 50) {
			styleStr.push(getMedia(i, i + 50))
		}
		styleStr.push(getMedia(null, 800))
		$("head").append("<style>{0}</style>".tpl(styleStr.join("")));
	}


	var preh;

	function changeRootrem() {
		var h = getRagen($(window).height(), 1080, 350);
		var remroot = getResize(800, 350, h, 125, 75)
		if (preh == h) {
			return remroot;
		}
		preh = h;
		/*12/16=0.75,20/16=1.25*/
		$("html").css("font-size", remroot + "%");
		return remroot;
	}


	function bindbackBtn() {
		$(document).on("click", ".header .icon-cancel", function () {
			window.history.back(-1);
		})
	}

	function bindCheckBox() {
		/*自定义checkbox*/
		$(document).on("click", ".J-label-box", function () {

			var $this = $(this);

			var $checkbox = $this.find("input");

			var $radioGroup = $this.parents(".J-label-radio-group");

			//radio
			if ($radioGroup.length) {
				$radioGroup.find("input").prop("checked", false).trigger("change");
				$radioGroup.find(".label-box").removeClass("checked");
				if (!$checkbox.prop("checked")) {
					$this.addClass("checked")
					$checkbox.prop("checked", true).trigger("change");

				}
				//checkbox
			} else {
				if ($checkbox.prop("checked")) {
					$this.removeClass("checked")
					$checkbox.prop("checked", false).val(0).trigger("change");

				} else {
					$this.addClass("checked")
					$checkbox.prop("checked", true).val(1).trigger("change");
				}
			}
		})
	}

	function getNavClass(href) {
		var map ={
			"01home":"navhome",
			"02team":"navteam",
			"03commonList":"navmeadia",
			"04artList":"navmeadia",
			"05picList":"navproduct",
			"06product":"navproduct",
			"07business":"navbusiness",
			"08sigin":"navhome",
			"08signup":"navhome",
			"09vip1":"",
			"09vip2":"",
			"09vip3":"",
		}
		for(var i in map){
            if( ~href.indexOf(i) ){
            	return map[i];
			}
		}
		return map["01home"]
    }

	function setNav(){
		var current  = getNavClass(window.location.href);
		$("html").addClass(current)
	}
    setNav();

	changeRootrem();
	initStyle();
	$(document).on("pageloaded", function () {
		$(".ls-container").css("min-height", $(window).height() + "px")
	});
	$(window).on("resize", function () {
		changeRootrem();
		$(".ls-container").css("min-height", $(window).height() + "px")
	});
	bindbackBtn();
	bindCheckBox();

	/*页面加载完毕之后*/
	$(function(){

        $(document).trigger("pageloaded");

		if($(".bannar-carousel").length){
			var vSwiper = new Swiper('.bannar-carousel',{
				autoplay: 3000,
				speed: 1000
			})
		}

	})

})();



