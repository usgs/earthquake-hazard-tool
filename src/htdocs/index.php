<?php
if (!isset($TEMPLATE)) {
  // Page title. Shows up as <title> in <head> and an <h1> in content.
  $TITLE = 'Page Title';

  // True, flase, or actual navigation markup
  $NAVIGATION = true;

  // Additional tags to add to <head> section. Typically stylesheets.
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  // Additional tags to add to bottom of body section. Typically javascripts.
  $FOOT = '
    <script src="js/index.js"></script>
  ';

  include_once 'template.inc.php';
}
?>

<p>
  Page Content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Vestibulumsollicitudin eros fermentum nulla lacinia, vitae vehicula mauris
  vulputate. Nam et feugiat arcu, in lacinia purus. Morbi ultrices nibh
  vulputate augue blandit placerat. Suspendisse aliquet, ex at vulputate
  rutrum, tellus dui ultricies mi, non pharetra lorem ligula eget felis.
  Suspendisse eros odio, viverra eget velit in, dapibus sollicitudin odio.
  Phasellus eget hendrerit nunc. Aliquam erat volutpat. Nullam maximus est
  eget eleifend condimentum. In ullamcorper, lacus a dictum vehicula, enim
  urna ornare velit, sit amet vehicula quam sapien eu orci. Vestibulum cursus
  lacinia libero nec malesuada. Sed ornare magna et tortor accumsan, eget
  condimentum elit aliquet. Nullam diam lacus, vehicula eu condimentum et,
  vulputate eget quam. Quisque quis quam urna. Sed eu congue ex.
</p>
