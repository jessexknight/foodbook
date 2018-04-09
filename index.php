<html lang="en"><head>
  <meta charset="UTF-8">
  <title id='page-title'>Recipes</title>
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <link href='https://fonts.googleapis.com/css?family=Ubuntu&subset=cyrillic,latin' rel='stylesheet' type='text/css' />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
</head>
<body>
  <div id='navbar' style='display: inline-block;'>
    <h3>Cook Book</h3>
    <div id='navlist'>
    <table class='rowclick'>
      <?php include 'scripts/get-recipes.php';?>
    </table>
    </div>
  </div>
  <div id='recipe' style='display: inline-block;'>
    <h1 id='title'>The Recipe</h1>
    <div id='overview'>
      <table>
        <tr><td>Prep Time:</td><td id='prep-time'></td></tr>
        <tr><td>Cook Time:</td><td id='cook-time'></td></tr>
        <tr><td>Serves:</td><td id='serves'></td></tr>
      </table>
    </div>
    <div>
      <a class='collapse-button closed'><h2>Images</h2></a>
      <div class='collapse-content hidden' id='images'>
      </div>
    </div>
    <div>
      <a class='collapse-button'><h2>Ingredients</h2></a>
      <table class='rowclick collapse-content' id='ingredients'>
      </table>
    </div>
    <div>
      <a class='collapse-button'><h2>Instructions</h2></a>
      <table class='rowclick collapse-content' id='instructions'>
      </table>
    <div style='margin-top: 30px' id='link'></div>
    </div>
  </div>
  <script src='scripts/load.js'></script>
</body>
</html>
