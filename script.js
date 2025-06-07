const url= "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_min&timezone=auto";

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

async function fetchData(){
    try {
        const boxHead = document.querySelector(".box-head");
        const cardContainer = document.querySelector(".card-container");
        const res = await fetch(url);
        const forecast = await res.json();
        // see fetch data
        // console.log(forecast);
        const headerList = `
        <p class="waktu">${formatDate(forecast.daily.time[0])}</p>
          <div class="box-suhu">
            <p>${forecast.daily.temperature_2m_min[0]}&deg;C</p>
            <p>Cerah Berawan <span>.</span></p>
            <p>di Jakarta</p>
          </div>
          <div class="box-legend">
            <p>💦 Kelembapan: <span>79%</span></p>
            <p>💨 Kecepatan angin: <span>2km/jam</span></p>
            <p>🧭 Arah angin dari: <span>Barat laut</span></p>
            <p>👀 Jarak pandang: <span>> 10 km</span></p>
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