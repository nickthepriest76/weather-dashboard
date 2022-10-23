var searchHistory = []

if (localStorage.getItem("cityHistory") != null) {
    searchHistory = JSON.parse(localStorage.getItem("cityHistory"));
}

function renderHistory(searchHistory) {
    $(".search-item").remove()
    const container = $("#search-history-container");
    searchHistory.forEach(item => {
        const searchElement = document.createElement("li");
        searchElement.classList.add("search-item");
        searchElement.innerHTML = `<h5>`+item+`</h5>`;
        container.append(searchElement);
    })
    addClicktosearch();
}


async function getWeather(cityName) {
    console.log("GetWeather:" + cityName);
    const queryString = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=320ce88045d7808143e938abb91b6704"
    const res = await fetch(queryString);
    
    if (res.ok) {
        const data = await res.json();
        const dataList = data.list;
        const dailyReport = []
        for (let i = 0; i < dataList.length; i = i + 8) { 
            dailyReport.push(dataList[i]);
        }
        return dailyReport;
    }
    else {
        throw new Error("404");
    }
 
}


function getHTMLCardfromData({ type,date,iconUrl, temp, wind, humidity } = {}) {
    const template = document.createElement('div');

    template.innerHTML = `

    <p>`+ date +`</p>
    <img class="icon-img" src=`+ iconUrl + ` alt="icon" id="iconImage">
    <div class="metric-container">
        <div class="metric">
            <i class="fa-solid fa-temperature-three-quarters"></i>
            <p>Temperature: </p>
            <p>`+ temp + ` ºC</p>
        </div>
        <div class="metric">
            <i class="fa-solid fa-wind"></i>
            <p>Wind Speed: </p>
            <p>`+ wind + ` MPH</p>
        </div>
        <div class="metric">
            <i class="fa-solid fa-droplet"></i>
            <p>Humidity: </p>
            <p>`+ humidity + ` %</p>
        </div>
    </div>`;
    if (type === "small") {
        template.classList.add("small-card","card");
    }
    else {
        template.classList.add("main-card", "card");
    }

    return template;
}


function getDateString(date) {
    const dt = new Date(date*1000);
    return dt.toLocaleDateString();
} 


function getWeatherObject(data) {
    const obj = {
        date: getDateString(data.dt),
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        iconUrl:"https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png"
    }

    return obj;
}

function renderWeather(cityName) {

    getWeather(cityName).then((data) => {
        console.log("api fetched");
        $("#search-box").val("");
        addtoSearchHistory(cityName);
        $("#error-container").css("display", "none");
        $("#weather-display-container").css("display", "inherit");
        $(".card").remove();
        $("#cityName").html(cityName);
        $("#future-text").html("5 Day Forecast");
        const currData = getWeatherObject(data[0]);
        renderMainWeatherCard(currData)
        for (let i = 1; i < data.length; i++){
            const futureData = getWeatherObject(data[i]);
            const smallCard = getSmallWeatherCard(futureData);
            $("#future").append(smallCard)
        }
        
    }).catch(err => {
        console.log(err);
        $("#error-container").css("display", "inherit");
        $("#weather-display-container").css("display", "none");
    })
}


function renderMainWeatherCard(weatherObject) {
    const weatherCard = getHTMLCardfromData({ type:"main",date:weatherObject.date, iconUrl:weatherObject.iconUrl, temp:weatherObject.temp, wind: weatherObject.wind, humidity:weatherObject.humidity})
    const container = document.getElementById("weather-display-container")
    container.insertBefore(weatherCard, container.children[1]);
}


function getSmallWeatherCard(weatherObject) { 
    const weatherCard = getHTMLCardfromData({ type: "small", date:weatherObject.date, iconUrl: weatherObject.iconUrl, temp: weatherObject.temp, wind: weatherObject.wind, humidity: weatherObject.humidity })
    return weatherCard
}



function addtoSearchHistory(item) {
    console.log(searchHistory);
    if (searchHistory.includes(item) == false) {
        searchHistory.unshift(item)
        localStorage.setItem("cityHistory", JSON.stringify(searchHistory));
        renderHistory(searchHistory);
    }
}


function handleCityChange() {
    const newCity = $("#search-box").val()
    renderWeather(newCity);
}


function addClicktosearch() {
    const searchItems = document.querySelectorAll(".search-item");
    searchItems.forEach((item) => {
    item.addEventListener('click', () => {
        console.log("clicked");
        renderWeather(item.innerText);
    })
})
}

renderHistory(searchHistory);
console.log("rendered search history");
addClicktosearch();





