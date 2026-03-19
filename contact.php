<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>log art services</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
   
    <?php include 'includes/header.php'; ?>

<section class="contact-section">

    <h1>Contact Us</h1>

    <div class="contact-container">

        <form method="POST" class="contact-form">

            <div class="input-group">
                <label>Full Name</label>
                <input type="text" name="name" placeholder="please enter your name" required>
            </div>

            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="please enter your email" required>
            </div>

            <div class="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" placeholder="please enter your phone number">
            </div>

            <div class="input-group">
                <label>Your Message</label>
                <textarea name="message" rows="5" required></textarea>
            </div>

            <button type="submit" name="send">Sent Message</button>
            
        </form>


        <div class="contact-info">
            <h3>Our Office</h3>
            <p>Douala, Cameroon</p>
            <p>Phone: +237 683408960</p>
            <p>Email: info@logartservices.com</p>
        </div>

    </div>


</section>
<?php include 'includes/footer.php'; ?>
<?php
include 'includes/db.php';

if(isset($_POST['send'])) {

    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $phone = $_POST['phone'];

    $sql = "INSERT INTO contact_messages (name, email, message,phone)
            VALUES ('$name', '$email', '$message', '$phone')";

    $conn->query($sql);

    echo '<p>Message sent successfully!</p>';
}
?>


</body>
</html>