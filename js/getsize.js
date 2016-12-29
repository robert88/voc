var curTarget;
var drag =function(seletor){
    var x,y,flag
    var left,top;

    $(seletor).on("mousedown",function (e) {
        x = e.pageX;
        y = e.pageY;
        flag = true;
        curTarget = $(this);
        updateLeftTop();
    })

    $(document).on("mousemove",function (e) {
        if(flag){
            var dx = e.pageX-x;
            var dy = e.pageY-y
            move(dx,dy)
        }
    }).on("mouseup",function () {
        flag = false;
        // curTarget = null;
    }).on("keydown",function (e) {

        if(e.key=="ArrowRight"){
            updateLeftTop();
            move(1,0)
            return false;
        }else if(e.key=="ArrowLeft"){
            updateLeftTop();
            move(-1,0)
            return false;
        }
        else if(e.key=="ArrowUp"){
            updateLeftTop();
            move(0,-1)
            return false;
        }
        else if(e.key=="ArrowDown"){
            updateLeftTop();
            move(0,1)
            return false;
        }
    })
    function updateLeftTop(){
        if(curTarget.css("position")!="absolute"){
            curTarget.css({
                position:"absolute",
                left:"0px",
                top:"0px"
            });
            left=0;
            top=0;
        }else{
            left = curTarget.position().left;
            top = curTarget.position().top;
        }
    }
    function move(dx,dy) {
        if(curTarget){
            curTarget.css({left:(left+dx)+"px",top:(top+dy)+"px"})
        }
    }
}
var infoData=[];

var getInfo =function(seletor){
    var c = $(seletor)[0];
    var ctx = c.getContext("2d");
    var x,y,flag
    var left,top;
    var curInfo;
    $(seletor).on("mousedown",function (e) {

        curInfo = {
            x:e.pageX-$(this).offset().left,
            y:e.pageY-$(this).offset().top
        }
        infoData.push(curInfo);
        drawArc()
    })

    $(document).on("keydown",function (e) {

        if(e.key=="ArrowRight"){
            if(curInfo){
                curInfo.x++;
            }
            drawArc()
        }else if(e.key=="ArrowLeft"){
            if(curInfo){
                curInfo.x--;
            }
            drawArc()
        }
        else if(e.key=="ArrowUp"){
            if(curInfo){
                curInfo.y--;
            }
            drawArc()
        }
        else if(e.key=="ArrowDown"){
            if(curInfo){
                curInfo.y++;
            }
            drawArc()
        }
    })
    function drawArc() {
        c.width = c.width;
        for(var i=0;i<infoData.length;i++){
            drawArcOne(infoData[i])
        }
    }
    function drawArcOne(dian) {

        //开始一个新的绘制路径
        ctx.beginPath();
        //设置弧线的颜色为蓝色
        r =1
        ctx.fillStyle = "red";
        //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
        ctx.arc(dian.x, dian.y, r, 0, Math.PI * 2, false);
        ctx.fill()
    }
}