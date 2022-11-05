let search = "";
let totalPages;
let currentPage = 1;
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const current_page_element = document.getElementById("current-page");
const total_pages_element = document.getElementById("total-pages");

getOrdersData();

async function getOrdersData(current_page = 1, search = "") {
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

    totalPages = Math.ceil(data.total / data.orders.length);
    currentPage = data.page;
    current_page_element.innerHTML = data.page;
    total_pages_element.innerHTML = totalPages ? totalPages : 1;
    populateTable(data.orders);
    if (data.page > 1) {
      previous.classList.remove("hide");
    }

    if (data.page < totalPages) {
      next.classList.remove("hide");
    }
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

next.addEventListener("click", nextPage);
function nextPage() {
  if (currentPage < totalPages) {
    currentPage = currentPage + 1;
    current_page_element.innerHTML = currentPage;
    getOrdersData(currentPage);
  }
  if (currentPage === 20) {
    next.classList.add("hide");
  }
}

previous.addEventListener("click", previousPage);
function previousPage() {
  if (currentPage > 1) {
    currentPage = currentPage - 1;
    current_page_element.innerHTML = currentPage;
    getOrdersData(currentPage);
  }
  if (currentPage === 1) {
    previous.classList.add("hide");
  }
}

document.getElementById("search").addEventListener("submit", getSearch);

function getSearch(e) {
  e.preventDefault();
  search = document.getElementById("search_input").value;
  getOrdersData(currentPage, search);
}
