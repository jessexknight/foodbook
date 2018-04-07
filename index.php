<html lang="en"><head>
  <meta charset="UTF-8">
  <title id='page-title'>Recipes</title>
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <link href='https://fonts.googleapis.com/css?family=Ubuntu&subset=cyrillic,latin' rel='stylesheet' type='text/css' />
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
    <h1 id='title'></h1>
    <div id='overview'></div>
    <!-- <div id='images'></div> -->
    <h2>Ingredients</h2>
    <div class='rowclick' id='ingredients'></div>
    <h2>Instructions</h2>
    <div class='rowclick' id='instructions'></div>
    <div style='margin-top: 30px' id='link'></div>
  </div>
  <script src='scripts/load.js'></script>
</body>
</html>
