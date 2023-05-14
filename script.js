
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const search = document.getElementById('search');

let currentInterval;


function nameSearch() {
    const city = document.getElementById('search-field').value;
    let res = /^[a-zA-Z]+$/.test('sfjd');
    if (res === true) {
        getLocation(city);
    }
    else {
        window.alert("Please enter a Valid City Name");
    }
}


async function getLocation(cityName) {

    const apiKey = 'a64de61c59b3574e79df286ee7ce5ad2';

    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    // Fetch the data from the API

    try {
        let response = await fetch(apiUrl);
        // console.log(response);
        let data = await (response.json())
        console.log(data);
        let lat = data[0].lat;
        let long = data[0].lon;
        let timezone = await getTimezone(lat, long);
        timezone = new Date(timezone);
        clearInterval(currentInterval);
        setTime(timezone);

        fetchWeatherData(lat, long);
        //getTimezone(lat, long);
        //time function ko lat long yha se bhjnege
    }
    catch (error) {
        alert("City name not found");
    }
}


async function getTimezone(lat, long) {
    const apiKey = 'd9c9f12eb2544e729d7caafb6cf99c1d';
    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${apiKey}`
   
    try {
        const response = await fetch(apiUrl, { method: 'GET' });
        let data = await response.json();
        console.log(data);
        let timezone = data.features[0].properties.timezone.name;

        let currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
        console.log(currentTime);
        return currentTime;
    } catch (error) {
        console.log(error);
    }
}






const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = 'e94f61d072249e52ee5dda89b70aa856';

function setTime(searchedTime) {

        currentInterval = setInterval(() => {
        
        const time = searchedTime ? searchedTime: new Date();
        const month = time.getMonth();
        const date = time.getDate();
        const day = time.getDay();
        const hour = time.getHours();
        const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
        const minutes = time.getMinutes();
        const ampm = hour > 12 ? 'PM' : 'AM'

        timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id = "am-pm">${ampm}</span>`

        dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];



    }, 1000);

}



init();
function init() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetchWeatherData(latitude, longitude);
        setTime();
        //time function ko lat long yha se bhjnege
    })
}


async function fetchWeatherData(latitude, longitude) {
    let response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
    let data = await (response.json());
    console.log(data);

    showWeatherData(data);

}




function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';


    currentWeatherItemsEl.innerHTML =
        ` <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
      </div>
      <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
      </div>
      <div class="weather-item">
            <div>Wind-Speed</div>
            <div>${wind_speed}</div>
      </div>
      <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm:a')}</div>
      </div>
      <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format('HH:mm:a')}</div>
</div>
      
      
      `;

    let OtherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>

            </div>
            
            `


        } else {
            OtherDayForecast += `
            <div class="weather-forecast" id="weather-forecast">
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>

                </div>


            </div>
            
            `

        }
    })

    weatherForecastEl.innerHTML = OtherDayForecast;

}



