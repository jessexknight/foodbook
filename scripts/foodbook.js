$(document).ready(function(){
  function showHome(home){
    if (home){
      $('#home').removeClass('hidden');
      $('#recipe').addClass('hidden');
      $('#page-title').html('Foodbook');
    } else {
      $('#home').addClass('hidden');
      $('#recipe').removeClass('hidden');
    }
  }
  function rowClicks(){
    $('#recipe .rowclick tr').off('click').on('click',function(e){
      $(this).toggleClass('selected');
    });
  }
  function selectNav(){
    var id = window.location.hash.substr(4);
    $('.nav-item.selected').not('#-'+id).removeClass('selected');
    $('#-'+id).addClass('selected');
  }
  function recipeFile(id){
    return 'recipes/'+id+'.json';
  }
  function fmtNum(num,precision){
    return (Math.round(precision*num)/precision).toString();
  }
  function tooltip(str,match,hover){
    match = match.replace(/ *\([^)]*\) */,'');
    var re = new RegExp('([^\\w])('+match+')([^\\w])','g');
    var tool = '$1<span class="tip">$2<span class="tiptext">'+hover+'</span></span>$3';
    return str.replace(re,tool);
  }
  function htmlObject(obj,str,props){
    if (props === undefined){
      return '<'+obj+'>'+str+'</'+obj+'>';
    } else {
      return '<'+obj+' '+props+'>'+str+'</'+obj+'>';
    }
  }
  function tRow(str,props){
    return htmlObject('tr',str,props);
  }
  function tCell(str,props){
    return htmlObject('td',str,props);
  }
  function ingrScale(amount,scale,precision){
    if (precision === undefined) {
      precision = 100;
    }
    split = amount.match('(.*?)\\s(\\S*)');
    if (split == null) {
      return fmtNum(scale*parseFloat(amount),  precision);
    } else {
      return fmtNum(scale*parseFloat(split[1]),precision)+' '+split[2];
    }
  }
  function genIcons(tags){
    str = '';
    for (var t in tags){
      str += '<div class="nav-filter icon-div '+tags[t]+' tip" id="'+tags[t]+'">'+
             '<img class="icon" src="icon/'+tags[t]+'.png"/>'+
             '<span class="tiptext">'+tags[t]+'</span>'+
             '</div>';
    }
    return str;
  }
  function genImages(imgs,max){
    if (max === undefined){
      max = 100;
    }
    str = '';
    for (var i in imgs){
      if (i >= max){console.log(max); break;}
      str += '<img width="100%" src="img/'+imgs[i]+'""/>';
    }
    return str;
  }
  function genIngrTable(ingredients,scale,precision){
    str = '';
    for (var ingredient in ingredients){
      str += tRow(
        tCell(ingrScale(ingredients[ingredient],scale,100))+
        tCell(ingredient)
      );
    }
    return str;
  }
  function genStepTable(steps,ingredients,scale,precision){
    str = '';
    for (var index in steps){
      step = steps[index];
      for (var ingredient in ingredients){
        step = tooltip(step,ingredient,ingrScale(ingredients[ingredient],scale,100));
      }
      str += tRow(
        tCell(parseInt(index)+1,'valign="top"')+
        tCell(step)
      );
    }
    return str;
  }
  function genCard(id){
    return  htmlObject('div',
              htmlObject('div',null,
              'class="card-img"')+
              htmlObject('div',
                htmlObject('div',null,
                'class="overlay"'),
              'class="card-item"'),
            'class="card-container col-xs-12 col-sm-4 col-md-6 col-lg-4"'+
            'id="card-'+id+'"');
  }
  function genCards(){
    return $.getJSON('list.json',function(list){
      cards = $('#cards');
      for (var i in list){
        cards.append(genCard(list[i]));
      }
      for (i in list){(function(i){
        $.getJSON(recipeFile(list[i]),function(data){
          card = $('#card-'+list[i]);
          card.find('.card-img').html(genImages(data.images));
          card.find('.overlay').html(data.title);
          card.attr('data-tags',data.tags);
        });
      })(i);}
    });
  }
  function filterCards(){
    var tagsOn  = Array.from($('#navtags .nav-filter.toggle-on' ),function(o){ return o.id; });
    var tagsOff = Array.from($('#navtags .nav-filter.toggle-off'),function(o){ return o.id; });
    $.getJSON('list.json',function(list){
      for (var i in list){
        card = $('#card-'+list[i]);
        tags = card.attr('data-tags').split(',');
        if ((tagsOn.every(function(tag){ return tags.includes(tag); })) &&
           !(tags.some(function(tag) { return tagsOff.includes(tag); }))){
          card.removeClass('hidden');
        } else {
          card.addClass('hidden');
        }
      }
    });
  }
  function genNav(){
    return $.getJSON('list.json',function(list){
      nav = $('#navtable');
      nav.html('');
      for (var i in list){
        nav.append(tRow(null,
          'class="nav-item"'+
          'id="nav-'+list[i]+'"'
        ));
      }
      for (i in list){(function(i){
        $.getJSON(recipeFile(list[i]),function(data){
          navrow = $('#nav-'+list[i]);
          navrow.html(tCell(data.title));
          navrow.attr('data-tags',data.tags);
        });
      })(i);}
    });
  }
  function filterNav(){
    var tagsOn  = Array.from($('#navtags .nav-filter.toggle-on' ),function(o){ return o.id; });
    var tagsOff = Array.from($('#navtags .nav-filter.toggle-off'),function(o){ return o.id; });
    $.getJSON('list.json',function(list){ // TODO: don't need to load JSON; iterate through nav
      for (var i in list){
        navrow = $('#nav-'+list[i]);
        tags = navrow.attr('data-tags').split(',');
        if ((tagsOn.every(function(tag){ return tags.includes(tag); })) &&
           !(tags.some(function(tag) { return tagsOff.includes(tag); }))){
          navrow.removeClass('hidden');
        } else {
          navrow.addClass('hidden');
        }
      }
    });
  }
  function loadRecipe(){
    var id = window.location.hash.substr(1);
    if (id) { // id is not empty: try to load id.json (no change if not found)
      $.getJSON(recipeFile(id),function(data){
        // initialization
        showHome(false);
        // servings
        serves = parseInt(data.serves);
        $('#serves')[0].value = serves;
        // overview
        $('#title')     .html(data.title);
        $('#page-title').html(data.title);
        $('#prep-time') .html(data.time.prep);
        $('#cook-time') .html(data.time.cook);
        // icons
        $('#tags').html(genIcons(data.tags));
        // images
        $('#images').html(genImages(data.images));
        // link
        $('#link').html('<a href="'+data.source+'" target="_blank">source</a>');
        // ingredients
        $('#ingredients').html(genIngrTable(data.ingredients,1,100));
        if (data.tags.indexOf('vegan') == -1) {
          $('#vegan-msg').addClass('hidden');
        } else {
          $('#vegan-msg').removeClass('hidden');
        }
        // steps
        $('#steps').html(genStepTable(data.steps,data.ingredients,1,100));
        // listener: click-able table rows
        rowClicks();
        // listeners: change serving size
        $('#serves').change(function(e){
          var scale = parseFloat($(this)[0].value) / parseFloat(serves);
          $('#ingredients').html(genIngrTable(           data.ingredients,scale,100));
          $('#steps')      .html(genStepTable(data.steps,data.ingredients,scale,100));
          rowClicks();
        });
      });
    } else { // id is empty: load homepage
      showHome(true);
    }
    window.scrollTo(0, 0);
  }
  // build the navbar
  alltags = ['breakfast','snack','vegan','veggie','fish','meat','dessert','gluten-free'];
  $('#navtags').html(genIcons(alltags));
  genNav();
  genCards();
  // listener: change hash -> load recipe
  $(window).on('hashchange',function(e){
    loadRecipe();
    selectNav();
  });
  // listener: nav-item click -> change hash
  $(document).on('click','.nav-item',function(e){
    window.location.hash = this.id.substr(4);
  });
  // listener: card-container click -> change hash
  $(document).on('click','.card-container',function(e){
    window.location.hash = this.id.substr(5);
  });
  // listener: nav-filter click -> cycle filters: on | off | neutral; filter nav-items
  $(document).on('click','.nav-filter',function(e){
    if ($(this).hasClass('toggle-on')) {
      $(this).removeClass('toggle-on');
      $(this).addClass('toggle-off');
    } else if ($(this).hasClass('toggle-off')) {
      $(this).removeClass('toggle-off');
    } else {
      $(this).addClass('toggle-on');
    }
    filterNav();
    filterCards();
  });
  // listener: collapse sections
  $('.collapse-button').click(function(e){
    $(this).toggleClass('closed');
    $(this).next('.collapse-content').toggleClass('hidden');
  });
  // listener: home page
  $('#home-link').click(function(e){
    window.location.hash = '';
  });
  // listener: dark / light mode
  $('#dark-light').click(function(e){
    $('body').toggleClass('dark');
    $('body').toggleClass('light');
    if ($('body').hasClass('dark')){
      $('#dark-light-img').attr('src','icon/light.png');
      $('#dark-light-tip').html('light mode');
    } else if ($('body').hasClass('light')){
      $('#dark-light-img').attr('src','icon/dark.png');
      $('#dark-light-tip').html('dark mode');
    }
  });
  // load any initial recipe (silent js error if not found)
  loadRecipe();
});
