$(document).ready(function(){
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
  function itable(ingredients,scale,precision){
    str = '';
    for (var ingredient in ingredients){
      str += trow(
        tcell(iscale(ingredients[ingredient],scale,100))+
        tcell(ingredient)
      );
    };
    return str;
  };
  function stable(steps,ingredients,scale,precision){
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
  function loadrecipe(id){
    $.getJSON(recipefile(id),function(data){
      // store static data
      serves = parseInt(data['serves']);
      $('#serves')[0].value = serves;
      // overview
      $('#title')     .html(data['title']);
      $('#page-title').html(data['title']);
      $('#prep-time') .html(data['time']['prep']);
      $('#cook-time') .html(data['time']['cook']);
      // images
      $('#images').html('');
      for (var i in data['images']){
        $('#images').append('<img class="image" src="img/'+data['images']+'""/>');
      };
      // link
      $('#link').html('<a href="'+data['link']+'" target="_blank">source</a>');
      // ingredients
      $('#ingredients').html(itable(data['ingredients'],1,100));
      // steps
      $('#steps').html(stable(data['steps'],data['ingredients'],1,100));
      // listener: click-able table rows
      $('#recipe .rowclick tr').click(function(e){
        $(this).toggleClass('selected');
      });
      // listeners: change serving size
      $('#serves').change(function(e){
        var scale = parseFloat($(this)[0].value) / parseFloat(serves);
        $('#ingredients').html(itable(              data['ingredients'],scale,100));
        $('#steps')      .html(stable(data['steps'],data['ingredients'],scale,100));
      });
    });
  };
  // build the navbar
  $.getJSON('list.json',function(list){
    for (var i in list){(function(i){
      $.getJSON(recipefile(list[i]),function(data){
        $('#recipe-table').append(trow(tcell(data['title'],'class="nav-item" id="'+list[i]+'"')));
      });
    })(i)};
  });
  // listeners: navbar clicks (change recipe)
  $(document).on('click','.nav-item',function(e){
    history.pushState(null,null,'#'+this.id);
    $('.nav-item').removeClass('selected');
    $(this).addClass('selected');
    loadrecipe(this.id);
  });
  // listeners: collapse sections
  $('.collapse-button').click(function(e){
    $(this).toggleClass('closed');
    $(this).next('.collapse-content').toggleClass('hidden');
  });
});
