$(document).ready(function(){
  function hoverover(str,match,hover){
    return str;//.replace('???',' {'+match+'} ')
  }
  function checkbox(value=false){
    return '<input type="checkbox" value='+value+'></input>'
  }
  function trow(str){
    return '<tr>'+str+'</tr>';
  }
  function tcell(str,spec=''){
    return '<td '+spec+'>'+str+'</td>';
  }
  $.getJSON('recipes/oatmeal-pancakes.json',function(data){
    s = {}
    // title
    s['title'] = data['title']
    s['page-title'] = data['title']
    // time
    s['time'] = '<table>'+
      trow(tcell('Prep Time:')+tcell(data['time']['prep']))+
      trow(tcell('Cook Time:')+tcell(data['time']['cook']))+
      '</table>';
    // serves
    s['serves'] = 'Serves: '+data['serves']
    // ingredients
    s['ingredients'] = '<table>'
    for (var g in data['ingredients']){
      s['ingredients'] += trow(
        tcell(checkbox())+
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
        tcell(checkbox(),   'valign="top"')+
        tcell(parseInt(i)+1,'valign="top"')+
        tcell(instruction)
      )
    }
    s['instructions'] += '</table>'
    // link
    s['link'] = '<a href="'+data['link']+'" target="_blank">original recipe</a>'
    // update the dom
    $('#page-title').html(data['title'])
    for (id in s){
      $('#'+id).html(s[id])
    };
  });
});
