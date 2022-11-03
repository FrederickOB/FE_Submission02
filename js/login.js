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
  console.log("res", data);
}

document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    login();
  });

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "./login.html";
}

async function isLoggedIn() {
  const tokensStored = localStorage.getItem("tokens");
  const tokens = JSON.parse(tokensStored);
  console.log(tokens);
  if (!tokens) return false;
  if (tokens) return true;
}

async function autoRedirect() {
  console.log("hello");
  const validLogin = await isLoggedIn();
  console.log("validLogin", validLogin);
  if (validLogin && location.pathname === "/login.html") location.replace("/");
}
