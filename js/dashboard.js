autoRedirect();
async function isLoggedIn() {
  const tokensStored = localStorage.getItem("tokens");
  const tokens = JSON.parse(tokensStored);
  return tokens;
}

async function autoRedirect() {
  const validLogin = await isLoggedIn();
  if (!validLogin && location.pathname === "/") {
    console.log("validLogin", validLogin);
    location.replace("/login.html");
  }
  if (validLogin && location.pathname === "/") redirect("/dashboard");
}

async function getDashboardData() {
    const {access_token} =isLoggedIn()
  const response = await fetch("https://freddy.codesubmit.io/dashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
  const data = response;

  console.log("res", data);
}
