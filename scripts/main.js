$(document).ready(function(){
  function rowclicks(){
    $('#recipe .rowclick tr').click(function(e){
      $(this).toggleClass('selected');
    });
  };
  function recipefile(id){
    return 'recipes/'+id+'.json';
  }
  function numfmt(num,precision){
    return (Math.round(precision*num)/precision).toString();
  };
  function tooltip(str,match,hover){
    match = match.replace(/ *\([^)]*\) */,'');
    var re = new RegExp('([^\\w])('+match+')([^\\w])','g')
    var tool = '$1<span class="tip">$2<span class="tiptext">'+hover+'</span></span>$3';
    return str.replace(re,tool);
  };
  function htmlobject(obj,str,props=null){
    if (props == null){
      return '<'+obj+'>'+str+'</'+obj+'>';
    } else {
      return '<'+obj+' '+props+'>'+str+'</'+obj+'>';
    };
  };
  function trow(str,props=null){
    return htmlobject('tr',str,props);
  };
  function tcell(str,props=null){
    return htmlobject('td',str,props);
  };
  function iscale(amount,scale,precision=100){
    split = amount.match('(.*?)\\s(\\S*)')
    if (split == null) {
      return numfmt(scale*parseFloat(amount),  precision);
    } else {
      return numfmt(scale*parseFloat(split[1]),precision)+' '+split[2];
    };
  };
  function genicons(tags){
    str = ''
    for (var t in tags){
      str += '<div class="nav-filter selected icon-div '+tags[t]+'" id="'+tags[t]+'">'+
             '<img class="icon" src="icon/'+tags[t]+'.png"/>'+
             '</div>';
    };
    return str;
  };
  function genimgs(imgs){
    str = ''
    for (var i in imgs){
      str += '<img width="100%" src="img/'+imgs[i]+'""/>';
    };
    return str;
  };
  function genitable(ingredients,scale,precision){
    str = '';
    for (var ingredient in ingredients){
      str += trow(
        tcell(iscale(ingredients[ingredient],scale,100))+
        tcell(ingredient)
      );
    };
    return str;
  };
  function genstable(steps,ingredients,scale,precision){
    str = '';
    for (var index in steps){
      step = steps[index]
      for (var ingredient in ingredients){
        step = tooltip(step,ingredient,iscale(ingredients[ingredient],scale,100));
      }
      str += trow(
        tcell(parseInt(index)+1,'valign="top"')+
        tcell(step)
      );
    };
    return str;
  };
  function genfilternav(){
    return $.getJSON('list.json',function(list){
      $('#navtable').html('');
      for (var i in list){(function(i){
        $.getJSON(recipefile(list[i]),function(data){
          var tagfilters = Array.from($('#navtags .nav-filter.selected'),function(o){
            return o.id;
          });
          if (data['tags'].map(tag => tagfilters.indexOf(tag)).some(i => i>-1)) {
            $('#navtable').append(trow(tcell(data['title']),'class="nav-item" id="'+list[i]+'"'));
          };
        });
      })(i)};
    });
  };
  function loadrecipe(id){
    $.getJSON(recipefile(id),function(data){
      history.pushState(null,null,'#'+id);
      $('.nav-item').removeClass('selected');
      $('#'+id).addClass('selected');
      // servings
      serves = parseInt(data['serves']);
      $('#serves')[0].value = serves;
      // overview
      $('#title')     .html(data['title']);
      $('#page-title').html(data['title']);
      $('#prep-time') .html(data['time']['prep']);
      $('#cook-time') .html(data['time']['cook']);
      // icons
      $('#tags').html(genicons(data['tags']));
      // images
      $('#images').html(genimgs(data['images']));
      // link
      $('#link').html('<a href="'+data['link']+'" target="_blank">source</a>');
      // ingredients
      $('#ingredients').html(genitable(data['ingredients'],1,100));
      // steps
      $('#steps').html(genstable(data['steps'],data['ingredients'],1,100));
      // listener: click-able table rows
      rowclicks();
      // listeners: change serving size
      $('#serves').change(function(e){
        var scale = parseFloat($(this)[0].value) / parseFloat(serves);
        $('#ingredients').html(genitable(              data['ingredients'],scale,100));
        $('#steps')      .html(genstable(data['steps'],data['ingredients'],scale,100));
        rowclicks();
      });
    });
  };
  // build the navbar
  $('#navtags').html(genicons(['breakfast','veggie','fish','meat','dessert']));
  genfilternav();
  // listeners: nav-item click -> change recipe
  $(document).on('click','.nav-item',function(e){
    loadrecipe(this.id);
  });
  // listeners: nav-filter click -> filter recipes
  $(document).on('click','.nav-filter',function(e){
    $(this).toggleClass('selected');
    genfilternav();
  });
  // listeners: collapse sections
  $('.collapse-button').click(function(e){
    $(this).toggleClass('closed');
    $(this).next('.collapse-content').toggleClass('hidden');
  });
  loadrecipe('oatmeal-pancakes');
});
