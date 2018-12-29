(function(){

  var _hideMessage = tyrano.plugin.kag.key_mouse.hidemessage;
  tyrano.plugin.kag.key_mouse.hidemessage = function(){
    $back = $('.rightClickButton');
    if($back[0]){
      $back.click();
      return;
    }
    _hideMessage.call(this);
  };

})();