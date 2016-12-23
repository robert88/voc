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