(function(){

  var waitNoClick = {
    vital : ['time'],
    pm: {
      time: 0
    },
    start : function(pm) {
      var that = this;
      this.kag.stat.is_wait = true;
      this.kag.layer.hideEventLayer();
      that.kag.tmp.wait_id = setTimeout(function() {
          that.kag.stat.is_wait = false;
          that.kag.layer.showEventLayer();
          that.kag.ftag.nextOrder();
      }, pm.time);
    }
  };
  

  TYRANO.kag.ftag.master_tag.waitNoClick = object(waitNoClick);
  TYRANO.kag.ftag.master_tag.waitNoClick.kag = TYRANO.kag;

})();


