
var APIKey = "adcd79e037a9e3c5d37cd3c98797ce1c";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid="+APIKey+"&q=";
var cityArray = ["Austin"];
var longitude = "-97.74";
var latitude = "30.27"; 

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
    console.log(searchCity)
    // append search string for api
    let URL = queryURL+searchCity;
    // make ajax request
    $.ajax({
        url: URL,
        method: "GET"
      }).then(dataReturned);
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
    cityArray.push(data.name);
    var longitude = data.coord.lon;
    var latitude = data.coord.lat;
    saveCityList();
    makeCityList();
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
}

   $("#UV-index").empty() 
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+latitude+"&lon="+longitude;
              // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(uvdataReturned);
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
        }};
      