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
        console.log(res);
        console.log(forecast);
    } catch (error) {
        console.log(error)
    }
}

fetchData();