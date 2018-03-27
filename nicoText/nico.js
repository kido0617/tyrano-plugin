/*
 * nicoText Ver.1.0 2018/03/27
 * ニコニコっぽいテキストを表示するプラグイン
 * 詳しい説明は以下URLを参照
 * http://kido0617.github.io/tyrano/2018-03-26-nico-text/
 * ティラノスクリプト ver4.61 で動作確認済み
 * Author: @kido0617
 * ライセンス: 完全に自由にどうぞ。クレジットの表記もいりません。
*/

(function(){

  var divClass = "nicoDiv";
  var textClass = "nicoText";
  var nakaClass = "nicoNaka";
  var shitaClass = "nicoShita";
  var ueClass = "nicoUe";

  if(!TYRANO.kag.stat.nicoText){
    TYRANO.kag.stat.nicoText = {
      adlib: [],
      ueLanes: [],
      shitaLanes: [],
      nakaLanes: [],
      adlibSetting: {
        start: 0,
        minDelay: 100,
        maxDelay: 200
      }
    };
  }

  var nicoSetting = {
    vital : ["layer", "x", "y", "width", "height"],
    pm: {
      fontFace: "",
      fontSize: 24,
      displayTime: 5000
    },
    start : function(pm) {
      $("." + divClass).remove();  //既に存在してたら消す
      this.parse(pm);
      this.kag.stat.nicoText.setting = pm;
      
      var div = $("<div></div>");
      div.css({
        "font-size": pm.fontSize + "px",
        "white-space": "nowrap",
        overflow: "hidden",
        position: "absolute",
        width: pm.width + "px",
        height: pm.height + "px",
        top: pm.y +"px",
        left: pm.x + "px"
      });
      if(pm.border){
        div.css({border: "2px solid white"});
      }
      if(pm.fontFace)div.css("font-family", pm.fontFace);
      div.addClass(divClass);
      var layer = "." + pm.layer + "_fore";
      $(layer).append(div);
      var lanes = Math.floor(pm.height / pm.fontSize);
      var laneNames = ["ueLanes", "shitaLanes", "nakaLanes"];
      laneNames.forEach(function(name){
        var lane = [];
        for(var i = 0; i < lanes; i++){
          if(name != "nakaLanes" && i >= lanes / 2)break; //ue shita は半分でいい
          lane.push(false);
        }
        pm[name] = lane;
      });
      this.kag.ftag.nextOrder();
    },
    parse: function(pm){
      pm.width = parseInt(pm.width);
      pm.height = parseInt(pm.height);
      pm.x = parseInt(pm.x);
      pm.y = parseInt(pm.y);
      pm.displayTime = parseInt(pm.displayTime);
      pm.fontSize = parseInt(pm.fontSize);
    }
  };
  var nicoAdlib = {
    vital : ["text"],
    pm: {
      pos: "naka",
      color: "white",
      size: "m"
    },
    start : function(pm) {
      var checked = NicoTextMaker.checkPM(pm);
      if(checked){
        this.kag.error(checked);
      }else{
        this.kag.stat.nicoText.adlib.push(pm);
      }
      this.kag.ftag.nextOrder();
    }
  };
  var nicoAdlibSetting = {
    start : function(pm) {
      var setting = this.kag.stat.nicoText.adlibSetting;
      if(pm.clear) this.kag.stat.nicoText.adlib = [];
      var start = parseInt(pm.start);
      if(!isNaN(start))setting.start = start;
      var minDelay = parseInt(pm.minDelay);
      if(!isNaN(minDelay))setting.minDelay = minDelay;
      var maxDelay = parseInt(pm.maxDelay);
      if(!isNaN(maxDelay))setting.maxDelay = maxDelay;
      if(setting.minDelay > setting.maxDelay){
        this.kag.error("minDelayはmaxDelayより大きくできません");
      }
      this.kag.ftag.nextOrder();
    }
  };

  var nicoRemove = {
    start: function(){
      $("." + divClass).remove();
      this.kag.ftag.nextOrder();
    }
  };
  var nicoText = {
    vital : ["text"],
    pm: {
      pos: "naka",
      color: "white",
      size: "m",
      delay: 100
    },
    start : function(pm) {
      var div = $("." + divClass);
      var checked = NicoTextMaker.checkPM(pm);
      if(!div[0]){
        this.kag.error("nicoSettingタグを使って初期化する必要があります");
      }
      else if(checked){
        this.kag.error(checked);
      }
      else NicoTextMaker.make(this.kag.stat.nicoText.setting, pm, div);
      this.kag.ftag.nextOrder();
    }
  };

  var NicoTextMaker = {
    setting: null,
    checkPM: function(pm){
      if(["naka", "ue", "shita"].indexOf(pm.pos) == -1){
        return "posはnaka ue shita のいずれかを指定してください";
      }
      if(["s", "m", "b"].indexOf(pm.size) == -1){
        return "sizeはs m b のいずれかを指定してください";
      }
      if(["white","black","red","blue","orange","green","pink","cyan","purple","yellow"].indexOf(pm.color) == -1){
        return "colorはwhite black red blue orange green pink cyan purple yellow のいずれかを指定してください";
      }
      pm.delay = parseInt(pm.delay);
      return null;
    },
    make: function(setting, pm, div) {
      this.setting = setting;
      var $text = $("<span></span>");
      $text.text(pm.text);
      $text.addClass(textClass);
      $text.css({
        position: "absolute",
        color: pm.color,
        "text-shadow": "1px 1px 0 #000"
      });
      $text.attr("delay", this.getLastDelay() + (pm.delay ? pm.delay : 0));
      if(pm.size == "s") $text.css("font-size", "66%");
      else if(pm.size == "b") $text.css("font-size", "150%");
      div.append($text);
      if(pm.pos == "shita") {
        this.addUeShita($text, false);
      }else if(pm.pos == "ue") {
        this.addUeShita($text, true);
      }else {
        this.addNaka($text);
      }
      return $text;
    },
    addNaka: function($text){
      $text.css("left", this.setting.width + "px");
      var lane = this.getRandomLane(this.setting.nakaLanes);
      $text.attr("lane", lane);
      if(lane == -1) $text.css("top", Math.floor(Math.random() * (this.setting.height - $text.height()) + "px"));
      else {
        $text.css("top", lane * this.setting.fontSize + "px");
        this.fixTop($text);
        this.setting.nakaLanes[lane] = true;
      }
      $text.addClass(textClass + " " + nakaClass);
    },
    addUeShita: function($text, isUe){
      var lanes, top;
      if(isUe) {
        lanes = this.setting.shitaLanes;
        top = 0;
        $text.addClass(ueClass);
      }else {
        lanes = this.setting.ueLanes;
        top = this.setting.height - this.setting.fontSize;
        $text.addClass(shitaClass);
      }
      var width = $text.width();
      $text.css({
        left: (this.setting.width / 2 - width / 2) + "px",
        top: top +"px",
        opacity: 0
      });
      
      var direction = isUe ? 1: -1;
      var lane = this.getLane(lanes);
      
      $text.attr({
        lane: lane,
        time: this.setting.displayTime
      });
      //レーンが空いてない場合は完全ランダム位置
      if(lane == -1)$text.css("top", top + direction * Math.floor(Math.random() * this.setting.height / 2));   
      else {
        $text.css("top", top + direction * lane * this.setting.fontSize);
        lanes[lane] = true;
      }
      this.fixTop($text);
    },
    getLastDelay: function(){
      var delay = 0;
      $("." + textClass).each(function(){
        var d = parseInt($(this).attr("delay"));
        if(delay < d)delay = d;
      });
      return delay;
    },
    getRandomLane: function(lanes){
      var falseLanes = [];
      for(var i = 0; i < lanes.length; i++){
        if(!lanes[i])falseLanes.push(i);
      }
      if(falseLanes.length ==0) return -1;
      return falseLanes[Math.floor(Math.random() * falseLanes.length)];
    },
    getLane: function(lanes){
      for(var i = 0; i < lanes.length; i++){
        if(!lanes[i])return i;
      }
      return -1;
    },
    fixTop: function($text){
      if($text.position().top + $text.height() > this.setting.height){
        $text.css("top", this.setting.height - $text.height());
      }
    }
  };

  var NicoManager = {
    isWorking: false,
    interval: 100,
    boot: function(){
      if(this.isWorking) return;
      this.isWorking = true;
      this.nextAdlibTime = -1;
      var that = this;
      this.timer = setInterval(function(){
        var div = $("." + divClass + ":visible");
        if(!div[0]) return;
        var setting = TYRANO.kag.stat.nicoText.setting;
        if(!setting) return;
        var nakaList = div.find("." + nakaClass);
        nakaList.each(function(){
          if(!$(this).attr("working")){
            if(!that.calcDelay($(this)))return;
            $(this).animate({
              left: -$(this).width()
            }, setting.displayTime, "linear", function(){
              $(this).remove();
            }.bind(this));
          }
          if(!$(this).is(':animated')){
            //セーブ、ロードした場合、workingだがanimationしてない状態になる
            var w = $(this).width();
            var ps = (setting.width + w) / setting.displayTime;  //[pixel/msec]
            var remain = ($(this).position().left + w) / ps;
            $(this).animate({
              left: -$(this).width()
            }, remain, "linear", function(){
              $(this).remove();
            }.bind(this));
          }
          var lane = parseInt($(this).attr("lane"));
          if(lane == -1) return;
          if($(this).width() + $(this).position().left < setting.width){
            setting.nakaLanes[lane] = false;
          }
        });
        var ueShitaList = div.find("." + shitaClass + ", ."  + ueClass);
        ueShitaList.each(function(){
          if(!$(this).attr("working")){
            if(!that.calcDelay($(this)))return;
            $(this).css("opacity", 1);
          }
          var time = parseInt($(this).attr("time"));
          $(this).attr("time", time - 100);
          if(time <= 0){
            var lane = parseInt($(this).attr("lane"));
            if($(this).hasClass(shitaClass))setting.shitaLanes[lane] = false;
            else setting.ueLanes[lane] = false;
            $(this).remove();
          }
        });
        that.adlib(div, nakaList, ueShitaList);
      }, this.interval);
    },
    adlib: function(div, nakaList, ueShitaList){
      var adlib = TYRANO.kag.stat.nicoText.adlib;
      if(adlib.length == 0) return;
      var count = nakaList.filter(":not(.adlib)").length;
      count += ueShitaList.filter(":not(.adlib)").length;
      var adlibSetting = TYRANO.kag.stat.nicoText.adlibSetting;
      if(count > adlibSetting.start){
        this.nextAdlibTime = 0;
        return;
      }
      
      this.nextAdlibTime -= this.interval;
      if(this.nextAdlibTime <= 0){
        var setting = TYRANO.kag.stat.nicoText.setting;
        var pm = adlib[Math.floor(Math.random() * adlib.length)];
        var $text = NicoTextMaker.make(setting, pm, div);
        $text.addClass("adlib");
        this.nextAdlibTime = adlibSetting.minDelay + Math.floor(Math.random() * adlibSetting.maxDelay - adlibSetting.minDelay);
      }
    },
    calcDelay: function($text){
      var delay = parseInt($text.attr("delay"));
      delay -= this.interval;
      $text.attr("delay", delay);
      if(delay <= 0) {
        $text.attr("working", 1);
        return true;
      }
      return false;
    }
  };

  window.Kido_NicoManager = NicoManager;

  TYRANO.kag.ftag.master_tag.nicoSetting = object(nicoSetting);
  TYRANO.kag.ftag.master_tag.nicoSetting.kag = TYRANO.kag;
  TYRANO.kag.ftag.master_tag.nicoAdlib = object(nicoAdlib);
  TYRANO.kag.ftag.master_tag.nicoAdlib.kag = TYRANO.kag;
  TYRANO.kag.ftag.master_tag.nicoAdlibSetting = object(nicoAdlibSetting);
  TYRANO.kag.ftag.master_tag.nicoAdlibSetting.kag = TYRANO.kag;
  TYRANO.kag.ftag.master_tag.nicoText = object(nicoText);
  TYRANO.kag.ftag.master_tag.nicoText.kag = TYRANO.kag;
  TYRANO.kag.ftag.master_tag.nicoRemove = object(nicoRemove);
  TYRANO.kag.ftag.master_tag.nicoRemove.kag = TYRANO.kag;
})();