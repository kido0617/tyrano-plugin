(function(){

  var cp = tyrano.plugin.kag.tag.chara_ptext;
  var start = cp.start;
  cp.start = function(pm){
    if(pm.name) this.kag.stat.f.charaName = pm.name;
    start.call(this, pm);
  };

})();