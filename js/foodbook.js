// main ---------------------------------------------------
$(document).ready(function(){
  if (window.matchMedia('(prefers-color-scheme:dark)').matches){ mode() }
  serv = $('#serv')
  $.getJSON('index.json',function(foods){
    cards = $('#menu').html(majo(foods,genCard)).find('.card-box')
    search = function(q){
      cards.attr('hidden',false)
      if (q === undefined || q.length == 0){ return }
      var fuse = new Fuse(Object.values(foods),
        {keys:['title','ingrs','steps','tags'],ignoreLocation:true,threshold:0.2})
      var ids = fuse.search(q).map(i => '#'+i.item.id).join(',')
      cards.not(ids).attr('hidden',true)
    }
    reload = function(e){
      var [id,q] = window.location.hash.substr(1).split('q=')
      if (id){
        genRecipe(foods.filter(food => food.id==id)[0])
        $('#home').hide()
        $('#recipe').show()
      } else {
        search(q)
        $('#recipe').hide()
        $('#home').show()
      }
      window.scrollTo(0,0)
    }
    $('#mode').on('click',mode)
    $('#copy').on('click',copy)
    $('#search').on('keypress',query)
    $(window).on('hashchange',reload)
    reload()
  })
})
// home ---------------------------------------------------
function mode(e){
  var body = $('body')
  body.toggleClass('dark')
  body.toggleClass('light')
  $('#mode').attr('src','img/icon/'+body.attr('class')+'.png')
}
function query(e){ if (e.which==13){
  window.location.hash = '#q='+$('#search')[0].value
}}
function genCard(food){
  return '<div class="cell card-box" id="'+food.id+'"><a href="#'+food.id+'"><div class="card">'+
    '<img src="img/food/'+food.image+'"/><div class="overlay"><h3>'+food.title+'</h3></div>'+
  '</div></a></div>'
}
// recipe -------------------------------------------------
function genRecipe(food){
  $('#page-title').html(food.title+' | Foodbook')
  $('#title').html(food.title)
  $('#tags').html(food.tags.map(genTag).join(''))
  $('#prep-time').html(food.time.prep)
  $('#cook-time').html(food.time.cook)
  $('#link').html('<a href="'+food.source+'">link</a>')
  $('#image').attr('src','img/food/'+food.image)
  serv.change(function(e){
    var scale = parseFloat(serv.val()) / parseFloat(food.serves)
    var itab = mojo(food.ingrs,genIngrRow,scale)
    var stab = majo(food.steps,genStepRow)
    stab = addTooltips(stab,food.ingrs,scale)
    $('#tab-ingrs').html(itab).find('tr').on('click',rowclick)
    $('#tab-steps').html(stab).find('tr').on('click',rowclick)
  })
  serv.val(parseInt(food.serves)).change()
}
function genTag(tag){
  return '<div class="icon-box '+tag+'"><img class="icon" src="img/icon/tag/'+tag+'.png"/></div>'
}
function scaleIngr(qty,scale,prec=100){
  var qtys = qty.split(' ')
  qtys[0] = (Math.round(parseFloat(scale*qtys[0])*prec)/prec).toString()
  return qtys.join('&nbsp')
}
function genIngrRow(ingr,qty,scale){
  var ingrs = ingr.split('; ')
  ingrs[0] = '<b>'+ingrs[0]+'</b>'
  return '<tr><td>'+scaleIngr(qty,scale)+'</td><td>'+ingrs.join(', ')+'</td></td>'
}
function genStepRow(step,i){
  return '<tr><td>'+(i+1).toString()+'</td><td>'+step+'</td></td>'
}
function addTooltips(str,ingrs,scale){
  for (var ingr in ingrs){
    var qty = scaleIngr(ingrs[ingr],scale)
    var sub = ingr.split('; ')[0]
    var tip = '<b><span class="tip">'+sub+'<span class="tiptext">'+qty+'</span></span></b>'
    var re = new RegExp('\\b('+sub+')\\b','g')
    str = str.replace(re,tip)
  }
  return str
}
function copy(e){
  var str = $('#tab-ingrs').html()
    .replace(/<\/tr>/g,'\n')
    .replace(/<\/td><td>/g,' ')
    .replace(/<\/?.*?>/g,'')
  navigator.clipboard.writeText(str)
}
function rowclick(e) {
  $(this).toggleClass('selected')
}
// utils --------------------------------------------------
majo = function(arr,fun,...args){ return arr.map(fun,...args).join('') }
mojo = function(obj,fun,...args){ str = ''
  for (var key in obj){ str += fun(key,obj[key],...args) }
  return str }
