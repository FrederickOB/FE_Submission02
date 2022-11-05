let week = {};
let year = {};
let days = [];
let months = [];
let days_data = [];
let months_data = days.map((month) => {
  return months[month].total;
});
let bestsellers = [];

getDashboardData();

async function getDashboardData() {
  const { access_token } = await isLoggedIn();
  if (access_token) {
    const response = await fetch("https://freddy.codesubmit.io/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res)
      .catch((error) => console.error(error));
    const status = response.status;
    const data = await response.json().then((res) => res);

    if (status === 401 && data.msg === "Token has expired") {
      await getNewAccessToken();
      await getDashboardData();
    }

    bestsellers = data.dashboard.bestsellers;
    week = data.dashboard.sales_over_time_week;
    year = data.dashboard.sales_over_time_year;
    days = Object.keys(week);
    months = Object.keys(year);
    days_data = days.map((day) => {
      return week[day].total;
    });
    months_data = days.map((month) => {
      return year[month].total;
    });

    for (let i = 0; i < days.length; i++) {
      if (i === 0) {
        days[i] = "today";
      } else if (i === 1) {
        days[i] = "yesterday";
      } else {
        days[i] = "day " + days[i];
      }
    }

    for (let j = 0; j < months.length; j++) {
      if (j === 0) {
        months[j] = "this month";
      } else if (j === 1) {
        months[j] = "last month";
      } else {
        months[j] = "month " + months[j];
      }
    }

    cardData(data);
    createChart(days_data, days);
    createChart(months_data, months, "yearChart");
    populateTable();
  }
}

function cardData() {
  let week_orders = [];
  let week_total = [];
  Object.values(week).map((value) => {
    week_orders.push(value.orders);
    week_total.push(value.total);
  });

  week_orders = week_orders.reduce((a, b) => a + b);
  week_total = week_total.reduce((a, b) => a + b);
  const stat_card_today = document.getElementById("stat-card-today");
  const stat_card_week = document.getElementById("stat-card-week");
  const stat_card_month = document.getElementById("stat-card-month");
  let today_card_html = `<p>today</p>
    <h1>$${week[7].total}/ ${week[7].orders} orders</h1>`;
  let week_card_html = `<p>week</p>
    <h1>$${week_total}/ ${week_orders} orders</h1>`;
  let month_card_html = `<p>month</p>
    <h1>$${year[12].total}/ ${year[12].orders} orders</h1>`;
  stat_card_today.innerHTML = today_card_html;
  stat_card_week.innerHTML = week_card_html;
  stat_card_month.innerHTML = month_card_html;
}

function createChart(dataset, labels, id = "weekChart") {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Sales",
        data: dataset,
        backgroundColor: ["rgb(255, 255, 255, 0.2)"],
        borderColor: ["rgb(151, 151, 151)"],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "",
        },
      },
    },
  };

  const myChart = new Chart(document.getElementById(id), config);
}

const toggle = document.getElementById("toggle_input");
toggle.addEventListener("change", switchChart);

function switchChart() {
  const chart_heading = document.getElementById("rev_heading");
  const week_chart = document.getElementById("week-chart");
  const year_chart = document.getElementById("year-chart");

  if (toggle.checked) {
    chart_heading.innerHTML = "Revenue (Last 12 months)";
    week_chart.classList.add("hide");
    year_chart.classList.remove("hide");
  } else {
    chart_heading.innerHTML = "Revenue (last 7 days)";
    year_chart.classList.add("hide");
    week_chart.classList.remove("hide");
  }
}

function populateTable() {
  const tbody = document.querySelector("tbody");
  let result = "";
  if (bestsellers != "null") {
    bestsellers.forEach((row) => {
      result += `<tr>
            <td>${row.product["name"]}</td>
            <td>${row.revenue / row.units}</td>
            <td>${row.units}</td>
            <td>${row.revenue}</td>
            </tr>`;
    });
  }
  tbody.innerHTML = result;
}
