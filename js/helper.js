async function isLoggedIn() {
  const tokensStored = localStorage.getItem("tokens");
  const tokens = JSON.parse(tokensStored);
  return tokens;
}

async function autoRedirect() {
  const validLogin = await isLoggedIn();
  if (!validLogin && location.pathname !== "/login.html") {
    location.replace("/login.html");
  }
  if (validLogin && location.pathname === "/login.html") {
    location.replace("/");
  }
}

async function getNewAccessToken() {
  const { refresh_token } = await isLoggedIn();
  const response = await fetch("https://freddy.codesubmit.io/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
  }).then((res) => res.json());
  const auth = {
    refresh_token,
    access_token: response.access_token,
  };
  localStorage.setItem("tokens", JSON.stringify(auth));
}

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "./login.html";
}

document.querySelector("body").onload = function () {
  autoRedirect();
};
