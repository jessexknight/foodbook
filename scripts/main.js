$(document).ready(function(){
  function recipefile(id){
    return 'recipes/'+id+'.json';
  }
  function numfmt(num,precision){
    return (Math.round(precision*num)/precision).toString();
  };
  function hoverover(str,match,hover){
    return str;//.replace('???',' {'+match+'} ')
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
  function scaleing(amount,ratio,precision=100){
    split = amount.match('(.*?)\\s(\\S*)')
    if (split == null) {
      return numfmt(ratio*parseFloat(amount),  precision);
    } else {
      return numfmt(ratio*parseFloat(split[1]),precision)+' '+split[2];
    };
  };
  function loadrecipe(id){
    $.getJSON(recipefile(id),function(data){
      // serving
      serves = parseInt(data['serves']);
      $('#serves')[0].value = serves;
      s = {};
      // title
      s['title']      = data['title'];
      s['page-title'] = data['title'];
      // overview
      s['prep-time']  = data['time']['prep'];
      s['cook-time']  = data['time']['cook'];
      // images
      s['images'] = '';
      for (var i in data['images']){
        s['images'] += '<img class="image" src="img/'+data['images']+'""/>'
      };
      // link
      s['link'] = '<a href="'+data['link']+'" target="_blank">source</a>'
      // ingredients
      s['ingredients'] = '';
      s['ingredients-cache'] = '';
      for (var ingredient in data['ingredients']){
        s['ingredients'] += trow(
          tcell(scaleing(data['ingredients'][ingredient],1,100))+
          tcell(ingredient)
        );
        s['ingredients-cache'] += trow(
          tcell(scaleing(data['ingredients'][ingredient],1,10000))+
          tcell(ingredient)
        );
      };
      // instructions
      s['instructions'] = '';
      for (var i in data['instructions']){
        s['instructions'] += trow(
          tcell(parseInt(i)+1,'valign="top"')+
          tcell(data['instructions'][i])
        );
      };
      // add the recipe content
      for (var id in s){
        $('#'+id).html(s[id]);
      }
      // listener: click-able table rows
      $('#recipe .rowclick tr').click(function(e){
        $(this).toggleClass('selected');
      });
      // listener: serving size
      $('#serves').change(function(e){
        var ratio = parseFloat($(this)[0].value) / parseFloat(serves);
        $('#ingredients-cache tr td:first-child').each(function(i){
          $('#ingredients tr td:first-child')[i].innerHTML = scaleing(this.innerHTML,ratio);
        });
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
  // listener: navbar clicks (change recipe)
  $(document).on('click','.nav-item',function(e){
    history.pushState(null,null,'#'+this.id);
    $('.nav-item').removeClass('selected');
    $(this).addClass('selected');
    loadrecipe(this.id);
  });
  $('.collapse-button').click(function(e){
    $(this).toggleClass('closed');
    $(this).next('.collapse-content').toggleClass('hidden');
  });
});
