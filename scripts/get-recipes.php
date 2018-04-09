<?php
$root = "recipes";
$iter = new RecursiveIteratorIterator(
  new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS),
  RecursiveIteratorIterator::SELF_FIRST,
  RecursiveIteratorIterator::CATCH_GET_CHILD
);
$recipes = array();
foreach ($iter as $path => $file) {
  if ($file->isFile()) {
    echo '<tr class="nav-item" id="'.$path.'"><td>'.
         json_decode(file_get_contents($path),true)['title'].
         '</td></tr>';
    // array_push($recipes,$path);
  }
}
// $recipes = json_encode($recipes);
?>
