const url= "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_min,weather_code&hourly=,temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,wind_direction_10m,visibility&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=Asia%2FBangkok";

function formatDate(date){
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    let result = new Date(date).toLocaleDateString("id-ID", options);
    return result;
}

function formatDate2(date){
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    let result = new Date(date).toLocaleDateString("id-ID", options);
    return result;
}

function formatDate3(date){
    const options = {
        month: "long",
        day: "numeric"
    };
    let result = new Date(date).toLocaleDateString("id-ID", options);
    return result;
}

function weatherCode(code){
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
    ])
    let weather = codeList.get(code);
    return weather;
}

function direction(degree){
    if (degree === 0 || degree === 360){
        return "Utara ↓";
    }
    if (degree === 90){
        return "Timur ←";
    }
    if (degree === 180){
        return "Selatan ↑";
    }
    if (degree === 270){
        return "Barat →";
    }
    if(degree > 0 && degree < 90){
        return "Timur Laut ↙";
    }
    if(degree > 90 && degree < 180){
        return "Tenggara ↖";
    }
    if(degree > 180 && degree < 270){
        return "Barat Daya ↗";
    }
    if(degree > 270 && degree < 360){
        return "Barat Laut ↘";
    }
}

const now = new Date();
const formattedDate = now.toISOString().slice(0, 19);
console.log(formattedDate);
console.log(Date.now());

async function fetchData(){
    try {
        const boxHead = document.querySelector(".box-head");
        const cardContainer = document.querySelector(".card-container");
        const res = await fetch(url);
        const forecast = await res.json();
        // see fetch data
        console.log(forecast);
        const headerList = `
        <p class="waktu">${formatDate(forecast.current.time)}</p>
          <div class="box-suhu">
            <p>${forecast.current.temperature_2m}&deg;C</p>
            <p>${weatherCode(forecast.current.weather_code)} <span>.</span></p>
            <p>di Jakarta</p>
          </div>
          <div class="box-legend">
            <p>💦 Kelembapan: <span>${forecast.current.relative_humidity_2m}%</span></p>
            <p>💨 Kecepatan angin: <span>${forecast.current.wind_speed_10m}km/jam</span></p>
            <p>🧭 Arah angin dari: <span>${direction(forecast.current.wind_direction_10m)}</span></p>
            <p>👀 Jarak pandang: <span>${forecast.hourly.visibility[0]/1000} km</span></p>
          </div>`;
        boxHead.innerHTML += headerList;

        for(let i = 0; i < forecast.daily.time.length; i++){
            // date button items
            const buttonBox = document.querySelector(".button-box")
            const buttonList = `<button>${formatDate3(forecast.daily.time[i])}</button>`
            buttonBox.innerHTML += buttonList;
            // card items
            const newList = `
            <div class="card">
          <h4>${formatDate2(forecast.daily.time[i])}</h4>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSyCftnvcb2Sqg4hg7wzqpNbyf48WEBWWQsQ&s"
            alt=""
          />
          <p class="suhu">${forecast.daily.temperature_2m_min[i]}&deg;C</p>
          <p class="weather-name">Cerah Berawan</p>
          <div class="card-box">
            <p>💦 <span>79%</span></p>
            <p>💨 <span>2km/jam</span></p>
            <p>🧭 <span>Barat laut</span></p>
            <p>👀 <span>> 10 km</span></p>
          </div>
        </div>`;
        cardContainer.innerHTML += newList;
        }
    } catch (error) {
        console.log(error)
    }
}

fetchData();