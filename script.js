const input = document.querySelector(".jumbotron input");

input.addEventListener("input", function () {
  const suggestions = document.querySelector(".suggestions");
  const value = document.querySelector(".jumbotron input").value.trim();

  let url2 =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    value +
    "&count=10&language=en&format=json";

  async function fetchKota() {
    try {
      const pull = await fetch(url2);
      const result = await pull.json();
      const city = result.results;
      // test function search preview
      function searchPreview(keyword) {
        if (keyword < 2) return;
        suggestions.innerHTML = "";
        for (const cty of city) {
          const li = document.createElement("li");
          li.setAttribute("key", cty.id);
          li.innerHTML = `${cty.name}, ${cty.admin3 ? cty.admin3 + ", " : ""}${
            cty.admin2 ? cty.admin2 + ", " : ""
          }${cty.admin1 ? cty.admin1 + ", " : ""}${cty.country}`;
          suggestions.append(li);
        }
        suggestions.classList.add("visible");

        // Handle clicks on suggestion items
        const suggestionsEl = document.querySelectorAll(".suggestions li");
        suggestionsEl.forEach(function (e) {
          e.addEventListener("click", function () {
            const val = e.innerHTML;
            document.querySelector(".jumbotron input").value = val;
            suggestions.classList.remove("visible");
            let key = e.getAttribute("key");

            city.forEach(function (e) {
              if (e.id == key) {
                const detailAddress = document.querySelector(
                  ".jumbotron .detail-address"
                );
                const cityPlace = document.querySelector(".jumbotron span");
                let location = `Prakiraan cuaca di ${e.name}, ${
                  e.admin3 ? e.admin3 + ", " : ""
                }${e.admin2 ? e.admin2 + ", " : ""}${
                  e.admin1 ? e.admin1 + ", " : ""
                }${e.country}`;
                cityPlace.innerHTML = e.name;
                detailAddress.innerHTML = location;
                const url3 =
                  "https://api.open-meteo.com/v1/forecast?latitude=" +
                  e.latitude +
                  "&longitude=" +
                  e.longitude +
                  "&daily=weather_code,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&hourly=,temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,wind_direction_10m,visibility&current=relative_humidity_2m,temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto";

                async function fetchData() {
                  try {
                    const headline = document.querySelector(".headline");
                    const buttonBox = document.querySelector(".button-box");
                    const cardContainer =
                      document.querySelector(".card-container");
                    const res = await fetch(url3);
                    const forecast = await res.json();

                    const headerList = `
        <img
            src="img/${forecast.current.weather_code}.png"
            alt="${weatherCode(forecast.current.weather_code)}"
          />
        <div class="box-head">
        <p class="waktu">${formatDate(forecast.current.time)} ${timeZone(
                      forecast.timezone_abbreviation
                    )}</p>
          <div class="box-suhu">
            <p>${forecast.current.temperature_2m}&deg;C</p>
            <p>${weatherCode(forecast.current.weather_code)} <span>.</span></p>
            <p>di ${e.name}</p>
          </div>
          <div class="box-legend">
            <p>💦 <span class="note">Kelembapan: </span><span class="bold">${
              forecast.current.relative_humidity_2m
            }%</span></p>
            <p>💨 <span class="note">Kecepatan angin: </span><span class="bold">${
              forecast.current.wind_speed_10m
            }km/jam</span></p>
            <p>🧭 <span class="note">Arah angin dari: </span><span class="bold">${direction(
              forecast.current.wind_direction_10m
            )}</span></p>
            <p>👀 <span class="note">Jarak pandang: </span><span class="bold">${
              forecast.hourly.visibility[0] / 1000
            } km</span></p>
          </div>
    </div>`;
                    headline.innerHTML = "";
                    headline.innerHTML += headerList;
                    buttonBox.innerHTML = "";
                    cardContainer.innerHTML = "";

                    for (let i = 0; i < forecast.daily.time.length; i++) {
                      // date button items
                      const buttonList = `<button value="${forecast.daily.time[
                        i
                      ].slice(0, 10)}">${formatDate3(
                        forecast.daily.time[i]
                      )}</button>`;
                      buttonBox.innerHTML += buttonList;
                      // card items
                      const newList = `
            <div class="card">
          <h4>${formatDate2(forecast.daily.time[i])}</h4>
          <img
            src="img/${forecast.daily.weather_code[i]}.png"
            alt="${weatherCode(forecast.daily.weather_code[i])}"
          />
          <p class="suhu">${forecast.daily.temperature_2m_min[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            forecast.daily.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${forecast.hourly.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${forecast.daily.wind_speed_10m_max[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              forecast.daily.wind_direction_10m_dominant[i]
            )}</span></p>
            <p>👀 <span>${forecast.hourly.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
                      cardContainer.innerHTML += newList;
                    }

                    const button =
                      document.querySelectorAll(".button-box button");
                    button.forEach((btn) =>
                      btn.addEventListener("click", (e) => {
                        let param = e.target.value;

                        const title = document.querySelector(".title span");
                        const titleDate = formatDate2(param);
                        title.innerHTML = titleDate;

                        // hourly data index
                        const indexFilteredDate = forecast.hourly.time
                          .map((element, index) =>
                            element.includes(param) ? index : -1
                          )
                          .filter((index) => index !== -1);

                        // return object of filtered value by index
                        const filteredObj = Object.fromEntries(
                          Object.entries(forecast.hourly).map(
                            ([key, values]) => [
                              key,
                              values.filter((element, index) =>
                                indexFilteredDate.includes(index)
                              ),
                            ]
                          )
                        );
                        cardContainer.innerHTML = "";

                        for (let i = 0; i < filteredObj.time.length; i++) {
                          // card items
                          const newList2 = `
            <div class="card">
          <h4>${filteredObj.time[i].slice(11, 16)} ${timeZone(
                            forecast.timezone_abbreviation
                          )}</h4>
          <img
            src="img/${filteredObj.weather_code[i]}.png"
            alt="${weatherCode(filteredObj.weather_code[i])}"
          />
          <p class="suhu">${filteredObj.temperature_2m[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            filteredObj.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${filteredObj.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${filteredObj.wind_speed_10m[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              filteredObj.wind_direction_10m[i]
            )}</span></p>
            <p>👀 <span>${filteredObj.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
                          cardContainer.innerHTML += newList2;
                        }
                      })
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }

                fetchData();
              }
            });
          });
        });

        // Close suggestions if clicking outside
        document.addEventListener("click", (e) => {
          if (!search.contains(e.target)) {
            suggestions.classList.remove("visible");
          }
        });
      }
      searchPreview(value);
    } catch (error) {
      //   const errMessage = document.querySelector(".jumbotron p");
      //   errMessage.style.display = "block";
      //   function show() {
      //     errMessage.style.display = "none";
      //   }
      //   setTimeout(show, 1000);
      //   console.log(error);
    }
  }
  fetchKota();
});

const search = document.querySelector(".jumbotron form");
search.addEventListener("submit", function (event) {
  event.preventDefault();
  const suggestions = document.querySelector(".suggestions");
  const value = document.querySelector(".jumbotron input").value.trim();
  suggestions.classList.remove("visible");
  let url2 =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    value +
    "&count=10&language=en&format=json";

  async function fetchKota() {
    try {
      const cityPlace = document.querySelector(".jumbotron span");
      const detailAddress = document.querySelector(
        ".jumbotron .detail-address"
      );
      const pull = await fetch(url2);
      const result = await pull.json();
      const city = result.results;

      function getCity(kota) {
        let hasil;
        city.forEach(function (e) {
          if (e.name.toLowerCase().includes(kota)) {
            let location = `Prakiraan cuaca di ${e.name}, ${
              e.admin3 ? e.admin3 + ", " : ""
            }${e.admin2 ? e.admin2 + ", " : ""}${
              e.admin1 ? e.admin1 + ", " : ""
            }${e.country}`;
            cityPlace.innerHTML = e.name;
            detailAddress.innerHTML = location;
            hasil = e;
            return;
          }
        });
        return hasil;
      }

      let detail = getCity(value);

      // trial fetch data after klik button ------------------
      const url3 =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        detail.latitude +
        "&longitude=" +
        detail.longitude +
        "&daily=weather_code,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&hourly=,temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,wind_direction_10m,visibility&current=relative_humidity_2m,temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto";

      async function fetchData() {
        try {
          const headline = document.querySelector(".headline");
          const buttonBox = document.querySelector(".button-box");
          const cardContainer = document.querySelector(".card-container");
          const res = await fetch(url3);
          const forecast = await res.json();

          // see fetch data
          //   console.log(forecast);
          const headerList = `
        <img
            src="img/${forecast.current.weather_code}.png"
            alt="${weatherCode(forecast.current.weather_code)}"
          />
        <div class="box-head">
        <p class="waktu">${formatDate(forecast.current.time)} ${timeZone(
            forecast.timezone_abbreviation
          )}</p>
          <div class="box-suhu">
            <p>${forecast.current.temperature_2m}&deg;C</p>
            <p>${weatherCode(forecast.current.weather_code)} <span>.</span></p>
            <p>di ${detail.name}</p>
          </div>
          <div class="box-legend">
            <p>💦 <span class="note">Kelembapan: </span><span class="bold">${
              forecast.current.relative_humidity_2m
            }%</span></p>
            <p>💨 <span class="note">Kecepatan angin: </span><span class="bold">${
              forecast.current.wind_speed_10m
            }km/jam</span></p>
            <p>🧭 <span class="note">Arah angin dari: </span><span class="bold">${direction(
              forecast.current.wind_direction_10m
            )}</span></p>
            <p>👀 <span class="note">Jarak pandang: </span><span class="bold">${
              forecast.hourly.visibility[0] / 1000
            } km</span></p>
          </div>
    </div>`;
          headline.innerHTML = "";
          headline.innerHTML += headerList;
          buttonBox.innerHTML = "";
          cardContainer.innerHTML = "";

          for (let i = 0; i < forecast.daily.time.length; i++) {
            // date button items
            const buttonList = `<button value="${forecast.daily.time[i].slice(
              0,
              10
            )}">${formatDate3(forecast.daily.time[i])}</button>`;
            buttonBox.innerHTML += buttonList;
            // card items
            const newList = `
            <div class="card">
          <h4>${formatDate2(forecast.daily.time[i])}</h4>
          <img
            src="img/${forecast.daily.weather_code[i]}.png"
            alt="${weatherCode(forecast.daily.weather_code[i])}"
          />
          <p class="suhu">${forecast.daily.temperature_2m_min[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            forecast.daily.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${forecast.hourly.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${forecast.daily.wind_speed_10m_max[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              forecast.daily.wind_direction_10m_dominant[i]
            )}</span></p>
            <p>👀 <span>${forecast.hourly.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
            cardContainer.innerHTML += newList;
          }

          const button = document.querySelectorAll(".button-box button");
          button.forEach((btn) =>
            btn.addEventListener("click", (e) => {
              let param = e.target.value;

              const title = document.querySelector(".title span");
              const titleDate = formatDate2(param);
              title.innerHTML = titleDate;

              // hourly data index
              const indexFilteredDate = forecast.hourly.time
                .map((element, index) => (element.includes(param) ? index : -1))
                .filter((index) => index !== -1);

              // return object of filtered value by index
              const filteredObj = Object.fromEntries(
                Object.entries(forecast.hourly).map(([key, values]) => [
                  key,
                  values.filter((element, index) =>
                    indexFilteredDate.includes(index)
                  ),
                ])
              );
              //   console.log(filteredObj);
              cardContainer.innerHTML = "";

              for (let i = 0; i < filteredObj.time.length; i++) {
                // card items
                const newList2 = `
            <div class="card">
          <h4>${filteredObj.time[i].slice(11, 16)} ${timeZone(
                  forecast.timezone_abbreviation
                )}</h4>
          <img
            src="img/${filteredObj.weather_code[i]}.png"
            alt="${weatherCode(filteredObj.weather_code[i])}"
          />
          <p class="suhu">${filteredObj.temperature_2m[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            filteredObj.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${filteredObj.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${filteredObj.wind_speed_10m[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              filteredObj.wind_direction_10m[i]
            )}</span></p>
            <p>👀 <span>${filteredObj.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
                cardContainer.innerHTML += newList2;
              }
            })
          );
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
    } catch (error) {
      const errMessage = document.querySelector(".jumbotron p");
      errMessage.style.display = "block";
      function show() {
        errMessage.style.display = "none";
      }
      setTimeout(show, 1000);

      //   console.log("Kota yang anda cari tidak tersedia");
      console.log(error);
    }
  }
  fetchKota();
});

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };
  let result = new Date(date).toLocaleDateString("id-ID", options);
  return result;
}

function formatDate2(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let result = new Date(date).toLocaleDateString("id-ID", options);
  return result;
}

function formatDate3(date) {
  const options = {
    month: "long",
    day: "numeric",
  };
  let result = new Date(date).toLocaleDateString("id-ID", options);
  return result;
}

function weatherCode(code) {
  const codeList = new Map([
    [0, "Langit cerah"],
    [1, "Sebagian besar cerah"],
    [2, "Sebagian besar berawan"],
    [3, "Sebagian besar mendung"],
    [45, "Berkabut"],
    [48, "Berkabut es"],
    [51, "Gerimis ringan"],
    [53, "Gerimis sedang"],
    [55, "Gerimis lebat"],
    [56, "Gerimis beku ringan"],
    [57, "Gerimis beku padat"],
    [61, "Hujan ringan"],
    [63, "Hujan sedang"],
    [65, "Hujan lebat"],
    [66, "Hujan beku ringan"],
    [67, "Hujan beku lebat"],
    [71, "Hujan salju ringan"],
    [73, "Hujan salju sedang"],
    [75, "Hujan salju lebat"],
    [77, "Butiran salju"],
    [80, "Hujan gerimis ringan"],
    [81, "Hujan gerimis sedang"],
    [82, "Hujan gerimis lebat"],
    [85, "Hujan salju ringan"],
    [86, "Hujan salju lebat"],
    [95, "Badai petir ringan atau sedang"],
    [96, "Badai petir dengan hujan es ringan"],
    [99, "Badai petir dengan hujan es lebat"],
  ]);
  let weather = codeList.get(code);
  return weather;
}

function direction(degree) {
  if (degree === 0 || degree === 360) {
    return "Utara ↓";
  }
  if (degree === 90) {
    return "Timur ←";
  }
  if (degree === 180) {
    return "Selatan ↑";
  }
  if (degree === 270) {
    return "Barat →";
  }
  if (degree > 0 && degree < 90) {
    return "Timur Laut ↙";
  }
  if (degree > 90 && degree < 180) {
    return "Tenggara ↖";
  }
  if (degree > 180 && degree < 270) {
    return "Barat Daya ↗";
  }
  if (degree > 270 && degree < 360) {
    return "Barat Laut ↘";
  }
}

// set GMT timeZone display
function timeZone(gmt) {
  if (gmt == "GMT+7") {
    return "WIB";
  }
  if (gmt == "GMT+8") {
    return "WITA";
  }
  if (gmt == "GMT+7") {
    return "WIT";
  } else {
    return gmt;
  }
}

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.1818&longitude=106.8223&daily=weather_code,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&hourly=,temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,wind_direction_10m,visibility&current=relative_humidity_2m,temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto";

async function fetchData() {
  try {
    const headline = document.querySelector(".headline");
    const cardContainer = document.querySelector(".card-container");
    const res = await fetch(url);
    const forecast = await res.json();

    // see fetch data
    // console.log(forecast);
    const headerList = `
        <img
            src="img/${forecast.current.weather_code}.png"
            alt="${weatherCode(forecast.current.weather_code)}"
          />
        <div class="box-head">
        <p class="waktu">${formatDate(forecast.current.time)} ${timeZone(
      forecast.timezone_abbreviation
    )}</p>
          <div class="box-suhu">
            <p>${forecast.current.temperature_2m}&deg;C</p>
            <p>${weatherCode(forecast.current.weather_code)} <span>.</span></p>
            <p>di Jakarta</p>
          </div>
          <div class="box-legend">
            <p>💦 <span class="note">Kelembapan: </span><span class="bold">${
              forecast.current.relative_humidity_2m
            }%</span></p>
            <p>💨 <span class="note">Kecepatan angin: </span><span class="bold">${
              forecast.current.wind_speed_10m
            }km/jam</span></p>
            <p>🧭 <span class="note">Arah angin dari: </span><span class="bold">${direction(
              forecast.current.wind_direction_10m
            )}</span></p>
            <p>👀 <span class="note">Jarak pandang: </span><span class="bold">${
              forecast.hourly.visibility[0] / 1000
            } km</span></p>
          </div>
    </div>`;
    headline.innerHTML += headerList;

    for (let i = 0; i < forecast.daily.time.length; i++) {
      // date button items
      const buttonBox = document.querySelector(".button-box");
      const buttonList = `<button value="${forecast.daily.time[i].slice(
        0,
        10
      )}">${formatDate3(forecast.daily.time[i])}</button>`;
      buttonBox.innerHTML += buttonList;
      // card items
      const newList = `
            <div class="card">
          <h4>${formatDate2(forecast.daily.time[i])}</h4>
          <img
            src="img/${forecast.daily.weather_code[i]}.png"
            alt="${weatherCode(forecast.daily.weather_code[i])}"
          />
          <p class="suhu">${forecast.daily.temperature_2m_min[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            forecast.daily.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${forecast.hourly.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${forecast.daily.wind_speed_10m_max[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              forecast.daily.wind_direction_10m_dominant[i]
            )}</span></p>
            <p>👀 <span>${forecast.hourly.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
      cardContainer.innerHTML += newList;
    }

    const button = document.querySelectorAll(".button-box button");
    button.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        let param = e.target.value;

        const title = document.querySelector(".title span");
        const titleDate = formatDate2(param);
        title.innerHTML = titleDate;

        // hourly data index
        const indexFilteredDate = forecast.hourly.time
          .map((element, index) => (element.includes(param) ? index : -1))
          .filter((index) => index !== -1);

        // return object of filtered value by index
        const filteredObj = Object.fromEntries(
          Object.entries(forecast.hourly).map(([key, values]) => [
            key,
            values.filter((element, index) =>
              indexFilteredDate.includes(index)
            ),
          ])
        );
        // console.log(filteredObj);
        cardContainer.innerHTML = "";

        for (let i = 0; i < filteredObj.time.length; i++) {
          // card items
          const newList2 = `
            <div class="card">
          <h4>${filteredObj.time[i].slice(11, 16)} ${timeZone(
            forecast.timezone_abbreviation
          )}</h4>
          <img
            src="img/${filteredObj.weather_code[i]}.png"
            alt="${weatherCode(filteredObj.weather_code[i])}"
          />
          <p class="suhu">${filteredObj.temperature_2m[i]}&deg;C</p>
          <p class="weather-name">${weatherCode(
            filteredObj.weather_code[i]
          )}</p>
          <div class="card-box">
            <p>💦 <span>${filteredObj.relative_humidity_2m[i]}%</span></p>
            <p>💨 <span>${filteredObj.wind_speed_10m[i]}km/jam</span></p>
            <p>🧭 <span>${direction(
              filteredObj.wind_direction_10m[i]
            )}</span></p>
            <p>👀 <span>${filteredObj.visibility[i] / 1000} km</span></p>
          </div>
        </div>`;
          cardContainer.innerHTML += newList2;
        }
      })
    );
  } catch (error) {
    console.log(error);
  }
}

fetchData();
