(function(){
  var kag = TYRANO.kag;
  
  for(var i = 0; i <= 9; i++){
    setKey(i);
  }
  
  function setKey(num){
    kag.key_mouse.map_key[48 + num] = function(){
      kag.stat.is_strong_stop = false;
      var labels = getSortedLabels();
      if(num > 0 && num !=9 && !labels[num - 1])return;
      goToLabel(num, labels);
    };
  }

  function getSortedLabels(){
    var labels = Object.keys(kag.stat.map_label).map(function (key) {return kag.stat.map_label[key];});
    labels.sort(function(a, b){return a.index - b.index;});
    return labels;
  }

  function goToLabel(num, labels){
    if (num === 0) {
      kag.ftag.current_order_index = -1;
    }else if(num === 9){
      var tags = kag.ftag.array_tag;
      kag.ftag.current_order_index = tags.length - 2;
    }else{
      kag.ftag.current_order_index = labels[num - 1].index - 1;
    }
    kag.ftag.nextOrder();
    kag.getMessageInnerLayer().html("");
  }

  //Qキー
  kag.key_mouse.map_key[81] = function(){
    var jumper = $('#labelJumper');
    if(jumper[0]){
      jumper.remove();
      return;
    }
    var labels = getSortedLabels();
    var width = 500, height = 400;
    var div = $('<div id="labelJumper"></div>');
    div.css({
      'z-index': 999999999,
      position: 'absolute',
      padding: '40px',
      width: width,
      height: height,
      left: kag.config.scWidth / 2 - width / 2,
      top: kag.config.scHeight / 2 - height / 2,
      border: 'px solid #AAA', 
      'border-radius': '10px', 
      'background-color': 'white',
      'box-shadow': '10px 10px rgba(0,0,0,0.4)'
    });
    var append = function(index, name){
      var txt = index <= 9 ? index + '. '  : '-. ';
      txt += name;
      div.append('<a style="display:block; margin-top:10px; font-size:16px; color: black" href="#" data-index="' + index + '">' + txt + '</a>'); 
    };
    append(0, '最初');
    for(var i = 0; i < labels.length; i++){
      append(i + 1, labels[i].label_name);
    }
    append(9, '最後');
    div.find('a').click(function(e){
      e.preventDefault();
      var num = $(this).data('index');
      goToLabel(num, labels);
      div.remove();
    });
    $('body').append(div);
  };

})();