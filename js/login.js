async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("https://freddy.codesubmit.io/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json().then((res) => res);
  localStorage.setItem("tokens", JSON.stringify(data));
  autoRedirect();
}

document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    login();
  });
