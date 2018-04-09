$(document).ready(function(){
  function numfmt(num,precision){
    return (Math.round(precision*num)/precision).toString();
  };
  function hoverover(str,match,hover){
    return str;//.replace('???',' {'+match+'} ')
  };
  function table(str){
    return '<table>'+str+'</table>';
  };
  function trow(str){
    return '<tr>'+str+'</tr>';
  };
  function tcell(str,spec=''){
    return '<td '+spec+'>'+str+'</td>';
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
    $.getJSON(id,function(data){
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
      // update the dom
      for (var id in s){
        $('#'+id).html(s[id]);
      }
      // add listeners
      $('#recipe .rowclick tr').click(function(e){
        $(this).toggleClass('selected');
      });
      $('#serves').change(function(e){
        var ratio = parseFloat($(this)[0].value) / parseFloat(serves);
        $('#ingredients-cache tr td:first-child').each(function(i){
          $('#ingredients tr td:first-child')[i].innerHTML = scaleing(this.innerHTML,ratio);
        });
      });
    });
  };
  $('.nav-item').click(function(e){
    $('.nav-item').removeClass('selected');
    $(this).addClass('selected');
    loadrecipe(this.id);
  });
  $('.collapse-button').click(function(e){
    $(this).toggleClass('closed');
    $(this).next('.collapse-content').toggleClass('hidden');
  });
});
