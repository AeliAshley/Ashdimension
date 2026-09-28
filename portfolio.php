<?php
include "includes/db.php";
$sql="SELECT* FROM portfolio ORDER BY created_at DESC";
$result=mysqli_query($conn,$sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>log art services</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
<?php include 'includes/header.php';?>
<section class="portfolio">

<h1>Our Printing Portfolio</h1>
<p>Some of our latest designs</p>

<div class="portfolio-grid">

<!-- HARD-CODED DESIGNS -->
<!--long-->
<div class="portfolio-card">
<img src="images/Chloé copy.png">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>for chloe fashion</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/ille copy.jpg">
<div class="portfolio-info">
<h3>flyer</h3>
<p>happy new month AUGUST</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/3 fly copy.png">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Mechanical engineering</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/da2 copy 2.png">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Mechanical engineering</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250715-WA0106.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Education in France</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250716-WA0046.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Phone Repair</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/mabel 1copy.png">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Vote Matho</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/PAA copy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Prestige Dry Cleaning</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/paa2-Recovered.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Prestige Dry Cleaning</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250718-WA0129.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Happy Weekend</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250719-WA0133.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Thank you</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250716-WA0048.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Flocage</p>
</div>
</div>



<!--short-->


<div class="portfolio-card">
<img src="images/xcopy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Meet or Match</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/55 copy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Ash DImension</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/IMG-20250722-WA0052.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Travel</p>
</div>
</div>

<div class="portfolio-card">
<img src="images/start copy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Defense</p>
</div>
</div>


<div class="portfolio-card">
<img src="images/yi.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Yimga Premium</p>
</div>
</div>


<div class="portfolio-card">
<img src="images/yi2 copy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Yimga web design</p>
</div>
</div>



<div class="portfolio-card">
<img src="images/yim1-Recovered.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Yimga graphic design</p>
</div>
</div>


<div class="portfolio-card">
<img src="images/yim3 copy.jpg">
<div class="portfolio-info">
<h3>Flyer</h3>
<p>Yimga CM</p>
</div>
</div>












<!-- DATABASE DESIGNS -->

<?php
$query="SELECT * FROM portfolio";
$result=mysqli_query($conn,$query);
while($row=mysqli_fetch_assoc($result)) { ?>

<div class="portfolio-card">

<img src="uploads/<?php echo $row['image']; ?>">

<div class="portfolio-info">
<h3><?php echo $row['title']; ?></h3>
<p><?php echo $row['category']; ?></p>
</div>

</div>

<?php } ?>

</div>
</section>
<?php include 'includes/footer.php';?>
</body>
</html>

<?php
