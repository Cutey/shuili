function output() {undefined

    var isfirst = true;html
    
    //画布转img
    
    function convertCanvasToImage(canvas) {undefined
    
    var image = new Image();
    
    image.src = canvas.toDataURL("image/png", 0.1);
    
    return image;
    
    }canvas
    
    //克隆DOM元素到画布
    
    function convertHtml2Canvas() {undefined
    
    var btn = document.getElementById("Btn");
    
    btn.setAttribute("disabled", "true");
    
    btn.innerHTML = "正在输出...";
    
    html2canvas(document.getElementById("map"), {undefined
    
    useCORS: true,          //容许跨域
    
    allowTaint: false,         //容许跨域数据污染'被污染'的canvas
    
    foreignObjectRendering: true,    //在浏览器支持的状况下使用ForeignObject模式渲染图片
    
    taintTest: true,
    
    scale: 1                      //比例，越大分辨率越高，图片越小
    
    }).then(function (canvas) {undefined
    
    var img = convertCanvasToImage(canvas);
    
    btn.disabled = false;
    
    btn.innerHTML = "发布";
    
    shuiyin("", img);
    
    document.getElementById("yujingWindow").style.visibility = "visible";

    
    }).catch(function (e) {undefined
    
    console.error('error', e);
    
    });
    
    }
    
    map.centerAndZoom(centerpoint, 4000000 / map.getScale());      //地图缩放至设定中心点及设定zoom
    
    map.on("update-end", function () {                                                  //地图内容更新完毕后事件
    
    if (isfirst)
    
    {undefined
    
    convertHtml2Canvas();
    
    isfirst = false;
    
    }
    
    });
    
    }