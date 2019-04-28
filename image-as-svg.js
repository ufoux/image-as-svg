// ---------------------------------------- imageAsSvg --------------------------------------- // 

function imageAsSvg(parent, imgs, param) {
    var _imgs = [], parent = document.getElementById(parent);
    if (!param) param = {};
    param.imgN=[];param.imgW=[];param.imgH=[];param.pI=0 // for pairing image from preLoadImages
    
    // ----- input 'imgs' detection (array of objects, array of sources, just one source) ----- //
    if (imgs instanceof Array && typeof imgs[0] == 'object' && imgs[0] instanceof Object) { // if array with objects
        _imgs = imgs;
    }
    else if (!Array.isArray(imgs)) {_imgs[0] = {}, _imgs[0].src = [imgs]} // if just one string without array
    else { for (var i = 0, l = imgs.length; i < l; i++) { // if array with strings
            _imgs[i] = {}; _imgs[i].src = imgs[i]; // set just sources
    }}
    
    // ----- input 'param' settings ----- //
    param.id = param.id || "svg_"+ parent.id;
    param.width === undefined && (param.width = parent.clientWidth);
    param.height === undefined && (param.height = parent.clientHeight);
    param.viewBox = param.viewBox || '0 0 '+param.width+' '+param.height;
    param.others = param.others || '';
    param.defsId = param.id ? param.id+'_defs' : undefined;
    param.defsHTML = param.defsSrcId !== undefined ? param.defsSrcId.innerHTML : ''; // set defs, only if defined
    param.gOthers = param.gOthers || '';
    param.gId = param.id ? param.id+'_g' : undefined;
    
    param.defsSrcId !== undefined && param.defsSrcId.parentElement.remove(); // if defs presets used, delet it
    console.log(param);
    
    function init() {
        // Get width and height of preloaded image, then set it to image with that name in template.
        function getDimension(dimension) {
            var imgIndex = param.imgN.indexOf(iName),
                imgW = param.imgW[imgIndex],
                imgH = param.imgH[imgIndex];
            return dimension == "w" ? imgW : imgH;
        }
        
        // ----- template ----- //
        var template = '<svg id='+param.id+' width='+param.width+' height='+param.height+' viewBox="'+param.viewBox+'" '+param.others+'><defs id='+param.defsId+'>'+param.defsHTML+'</defs><g id='+param.gId+' '+param.gOthers+'>';
        for (var i = 0, iName, l = _imgs.length; i < l; i++) {
            iName = /[\w-]+(?=\..{3}$)/.exec(_imgs[i].src)[0]; // get name of image from his path
            _imgs[i].id === undefined && (_imgs[i].id = iName);
            _imgs[i].x = _imgs[i].x || 0;
            _imgs[i].y = _imgs[i].y || 0;
            _imgs[i].width = _imgs[i].width || getDimension("w");
            _imgs[i].height = _imgs[i].height || getDimension("h");
            _imgs[i].others = _imgs[i].others || '';

            template += '<image id='+_imgs[i].id+' href='+_imgs[i].src+' x='+_imgs[i].x+' y='+_imgs[i].y+' width='+_imgs[i].width+' height='+_imgs[i].height+' '+_imgs[i].others+'/>';
        }
        template += '</g></svg>';

        parent.innerHTML += template;
        if (param.callback) param.callback(); // callback is needed if using param.defsSrcId
    }
    
    function preLoadImages(preloadImages) {
        var newImages = [], l = preloadImages.length;
        for (var i = 0; i < l; i++) {
            newImages[i] = new Image(); newImages[i].src = preloadImages[i].src; // sources in objects
            newImages[i].onerror = function() { l-- }
            newImages[i].onload = function() {
                param.imgW[param.pI] = this.width;
                param.imgH[param.pI] = this.height;
                param.imgN[param.pI] = /[\w-]+(?=\..{3}$)/.exec(this.src)[0];
                param.pI++;
                if(!--l) { init(); /* <- callback */ }
        }} if (!l) init(); // <- callback if array empty
    }

    preLoadImages(_imgs); // start
}

// ---------------------------------------- imageAsSvg - end ---------------------------------------- // 