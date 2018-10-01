/*
buttonタグのホバー時にx,y座標を変更するプラグイン
buttonタグのパラメータに enterimgXとenterimgYを追加
座標は現在座標からの相対位置になります
使用例: [button x=100 y=150 graphic="button1.png" target="gamestart" enterimg="button2.png" enterimgX="-20" enterimgY="-10"]
*/

(function(){
  var button = tyrano.plugin.kag.tag.button;
  var _setEvent = button.setEvent;
  button.setEvent = function(j_button, pm){
    _setEvent(j_button, pm);
    function setPos(pos, num){
      j_button.css("margin-" + pos, parseInt(num) + "px");
    }
    j_button.hover(function() {
      if (pm.enterimgX != "") {
        setPos("left", pm.enterimgX);
      }
      if (pm.enterimgY != "") {
        setPos("top", pm.enterimgY);
      }
    }, function() {
      if (pm.enterimgX != "") {
        setPos("left", 0);
      }
      if (pm.enterimgY != "") {
        setPos("top", 0);
      }
    });
  };
})();