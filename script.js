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

async function fetchData(){
    try {
        const cardContainer = document.querySelector(".card-container");
        const res = await fetch(url);
        const forecast = await res.json();
        console.log(forecast);

        for(let i = 0; i < forecast.daily.time.length; i++){
            const newList = `
            <div class="card">
          <h4>${forecast.daily.time[i]}</h4>
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