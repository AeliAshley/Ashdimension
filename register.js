const API_URL = "https://ashdimension-1.onrender.com/api/register";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    // Stop the page from refreshing
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Account created successfully!";
            registerForm.reset();
        } else {
            message.textContent = data.message;
        }

    } catch (error) {
        console.log(error);
        message.textContent = "Unable to connect to the server.";
    }
});