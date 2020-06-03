
var APIKey = "adcd79e037a9e3c5d37cd3c98797ce1c";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid="+APIKey+"&q=";
var cityArray = [];
var longitude;
var latitude; 

$(document).ready(init);
function init(){
    //listen for search button click
    $("button").on("click", searchBtnClicked);
    getCityList();
    makeCityList();
}
function searchBtnClicked(){
    // get text from input
    let searchCity = $("input").val();
    citySearch(searchCity);
}
function btnClicked(e){
    let btnJustClicked = e.currentTarget;
    let searchCity = btnJustClicked.textContent;
    citySearch(searchCity);
}

function citySearch(searchCity){
    console.log(searchCity)
    // append search string for api
    let URL = queryURL+searchCity;
    // make ajax request
    $.ajax({
        url: URL,
        method: "GET"
      }).then(dataReturned).fail(function (xhr, status, err){
          console.log(err);
      });
}
function makeCityList () {
    let ul = document.querySelector("nav ul");
    ul.innerHTML = "";
    console.log(cityArray)
    cityArray.forEach(function (city) {
        let li = document.createElement('li');
        ul.appendChild(li);    
        li.innerHTML += "<button>"+city+"</button>";
    });
    $("nav ul button").on("click", btnClicked);
}
function addCity(city){
    if (cityArray.includes(city)){
        return;
    }
    cityArray.push(city);
    saveCityList();
    makeCityList();
}

function saveCityList (){
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
}
function getCityList (){
    let str = localStorage.getItem("cityArray");
    if (!str) { 
        cityArray = [];
    }
    else {
        cityArray = JSON.parse(str);
    }
}
function reloadData() {
    $("#city-title").empty();
    $("#temperature").empty();
    $("#wind-speed").empty();
  };
function dataReturned (data) {
    console.log(data)
    longitude = data.coord.lon;
    latitude = data.coord.lat;
    addCity (data.name);
    console.log(longitude);
    console.log(latitude);
  var icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
      $('#icon').html(`<img src="${icon}">`);
      $('#icon').attr("class", "icon")
      $("#city-title").empty()
      $("#city-title").append(data.name)
      $(".city").attr("style", "font-weight: bold; font-size: 30px")
      $("#wind-speed").empty()
      $("#wind-speed").append("Wind speed: " + data.wind.speed + " MPH")
      var convert = data.main.temp
      var F = (convert - 273.15) * 1.80 + 32
      F = F.toFixed(0)
      $("#temperature").empty()
      $("#temperature").append("Temperature: " + F + "°")
      GetUVData();
      GetFiveDayData();
}

    function GetUVData(){
   $("#UV-index").empty() 
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+latitude+"&lon="+longitude;
     $.ajax({
      url: uvURL,
      method: "GET"
    }).then(uvdataReturned);
}

    function uvdataReturned (uvdata) {
        console.log(uvdata.value)
            
        $("#UV-index").text("UV Index: " +uvdata.value)
        if(uvdata.value > 7){
            $("#UV-index").removeClass()
            $("#UV-index").addClass("badge badge-danger")
        }
        if(uvdata.value < 3){
            $("#UV-index").removeClass()
            $("#UV-index").addClass("badge badge-success")
        }
        if(uvdata.value > 3 && uvdata.value < 7){
            $("#UV-index").removeClass()
            $("#UV-index").addClass("badge badge-warning")
        }
    };
        
    function GetFiveDayData(){
    let day5QueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid="+APIKey;

   
        $.ajax({
                url: day5QueryURL,
                type: "GET"
            }).then(fiveDayDatareturned);
          }

function fiveDayDatareturned(response5Day){
    console.log(response5Day);
    for (let i = 0; i < 5; i++){
        console.log(response5Day.current.dt);
        let currentDate = (response5Day.current.dt);
        let stringCurrentDate = new Date(currentDate).toLocaleDateString("en-US");
        
        console.log(stringCurrentDate);
        let cardbodyElem = $("<div>").addClass("card-body");

        let fiveDayCard = $("<div>").addClass(".cardbody");
        let fiveDate = (response5Day.daily[i].dt)
        let stringFiveDate = new Date(fiveDate).toLocaleDateString("en-US");
        let headlineFiveDate = $("<h5>").text(stringFiveDate);
        fiveDayCard.addClass("headline");

        let fiveDayTemp = $("<p>").text("Temp: " + response5Day.daily[i].temp.max + "°");
        fiveDayTemp.attr("id", "#fiveDayTemp[i]");

        let fiveHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(response5Day.daily[i].humidity) + "%");
        fiveHumidity.attr("id", "#fiveHumidity[i]");

        let iconCode = response5Day.daily[i].weather[0].icon;
        let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        let weatherImgDay = $("<img>").attr("src", iconURL);
        $("#testImage").attr("src", iconURL);

        cardbodyElem.append(fiveDate);
        cardbodyElem.append(weatherImgDay);
        cardbodyElem.append(fiveDayTemp);
        cardbodyElem.append(fiveHumidity);
        fiveDayCard.append(cardbodyElem);
        $("#five-day").append(fiveDayCard);
        $("#fiveDayTemp[i]").empty();
        $("five-day-section").append(cardbodyElem);
    }
}