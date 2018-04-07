$(document).ready(function(){
  function hoverover(str,match,hover){
    return str;//.replace('???',' {'+match+'} ')
  }
  function checkbox(){
    return '<input type="checkbox"/>'
  }
  function trow(str){
    return '<tr>'+str+'</tr>';
  }
  function tcell(str,spec=''){
    return '<td '+spec+'>'+str+'</td>';
  }
  $.getJSON('recipes/enchilada-casserole.json',function(data){
    s = {}
    // title
    s['title'] = data['title']
    s['page-title'] = data['title']
    // overview
    s['overview'] = '<table>'+
      trow(tcell('Prep Time:')+tcell(data['time']['prep']))+
      trow(tcell('Cook Time:')+tcell(data['time']['cook']))+
      trow(tcell('Serves:')+tcell(data['serves']))+
      '</table>';
    // images
    s['images'] = ''
    for (var i in data['images']){
      s['images'] += '<img src="img/'+data['images']+'""/>'
    }
    +data['images']
    // ingredients
    s['ingredients'] = '<table>'
    for (var g in data['ingredients']){
      s['ingredients'] += trow(
        tcell(data['ingredients'][g])+
        tcell(g)
      )
    }
    s['ingredients'] += '</table>'
    // instructions
    s['instructions'] = '<table>'
    for (var i in data['instructions']){
      instruction = data['instructions'][i]
      for (var g in data['ingredients']){
        instruction = hoverover(instruction,g.replace(/ *\([^)]*\) */g, ""),'')
      }
      s['instructions'] += trow(
        tcell(parseInt(i)+1,'valign="top"')+
        tcell(instruction)
      )
    }
    s['instructions'] += '</table>'
    // link
    s['link'] = '<a href="'+data['link']+'" target="_blank">source</a>'
    // update the dom
    $('#page-title').html(data['title'])
    for (id in s){
      $('#'+id).html(s[id])
    };
    // row reactive
    $('.rowclick tr').click(function(event) {
      $(this).toggleClass('selected');
      if (event.target.type !== 'checkbox') {
        $(':checkbox', this).attr('checked', function() {
          return !this.checked;
        });
      }
    });
  });
});
