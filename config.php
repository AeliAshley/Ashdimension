<?php
$conn = mysqli_connect("localhost", "root", "", "logart_db");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>