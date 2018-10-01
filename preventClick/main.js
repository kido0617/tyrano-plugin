(function(){

  var preventClick = {
    vital : [],
    pm: {
      off: false
    },
    start : function(pm) {
      var layer = $('#tyrano_base');
      if(pm.off){
        layer.find('#preventClick').remove();
      }else{
        var div = $('<div id="preventClick"></div>');
        div.css({
          width: '100%',
          height: '100%',
          'z-index': 199999999,
          position: 'absolute'
        });
        layer.append(div);
      }
      
      this.kag.ftag.nextOrder();
    }
  };
  

  TYRANO.kag.ftag.master_tag.preventClick = object(preventClick);
  TYRANO.kag.ftag.master_tag.preventClick.kag = TYRANO.kag;

})();