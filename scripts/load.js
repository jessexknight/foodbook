$(document).ready(function(){
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
  function loadrecipe(id){
    $.getJSON(id,function(data){
      s = {};
      // title
      s['title'] = data['title'];
      s['page-title'] = data['title'];
      // overview
      s['prep-time']  = data['time']['prep'];
      s['cook-time']  = data['time']['cook'];
      s['serves']     = data['serves'];
      // images
      s['images'] = '';
      for (var i in data['images']){
        s['images'] += '<img class="image" src="img/'+data['images']+'""/>'
      }
      // link
      s['link'] = '<a href="'+data['link']+'" target="_blank">source</a>'
      // ingredients
      s['ingredients'] = '';
      for (var g in data['ingredients']){
        s['ingredients'] += trow(
          tcell(data['ingredients'][g])+
          tcell(g)
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
