let search = "";
let current_page = 1;
getOrdersData();

async function isLoggedIn() {
  const tokensStored = localStorage.getItem("tokens");
  const tokens = JSON.parse(tokensStored);
  return tokens;
}
async function getOrdersData() {
  const { access_token } = await isLoggedIn();
  if (access_token) {
    const response = await fetch(
      `https://freddy.codesubmit.io/orders?page=${current_page}&q=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res)
      .catch((error) => console.error(error));
    const status = response.status;
    const data = await response.json().then((res) => res);

    if (status === 401 && data.msg === "Token has expired") {
      await getNewAccessToken();
      await getOrdersData();
    }

    const el_current_page = document.getElementById("current-page");
    const el_total_pages = document.getElementById("total-pages");

    const totalPages = Math.ceil(data.total / data.orders.length);
    el_current_page.innerHTML = data.page;
    el_total_pages.innerHTML = totalPages ? totalPages : 1;
    populateTable(data.orders);
  }
}

function populateTable(data) {
  const tbody = document.querySelector("tbody");
  let result = "";
  if (data != "null") {
    data.forEach((row) => {
      result += `<tr>
              <td>${row.product["name"]}</td>
              <td>${new Date(row.created_at)
                .toISOString()
                .substring(0, 10)}</td>
              <td>${row.currency} ${row.total}</td>
              <td>${row.status}</td>
              </tr>`;
    });
  }
  tbody.innerHTML = result;
}
