

$(document).ready(function () {

    var SAVE_INFO_KEY = "SaveWeather";

    var savedButtonsLocal = [];

    //var 
    var queryUVIndex = "https://api.openweathermap.org/data/2.5/uvi?";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&";

    // http://api.openweathermap.org/data/2.5/uvi?lat=33.75&lon=-84.39&appid=ec90fbe8c020a67a9574fc0fd22679be
    // var queryParams = { "api-key": "ec90fbe8c020a67a9574fc0fd22679be" };
    // bulma alternative to bootstrap
    var queryparam = "appid=ec90fbe8c020a67a9574fc0fd22679be&q=";
    var query5day = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&";

    var iconaddress = "https://openweathermap.org/img/wn/"; //04n;
    var pngpart = "@2x.png";

    populateButtonColumn(); // make list of buttons

    // look up information on the city--get the city from data-city
    function lookupCityClicked(event) {
        event.preventDefault();
        var city = $(this).attr("data-city");
        GetWeatherInfo(city);
    }

    // populate the list of cities, with buttons.  Also, get most recent city searched
    // information and populate the screen with it.
    function populateButtonColumn() {
        var parsedsaveInfo = JSON.parse(localStorage.getItem(SAVE_INFO_KEY));

        if (parsedsaveInfo !== null) {
            var cityToLookUp = parsedsaveInfo[parsedsaveInfo.length - 1];

            for (var i = parsedsaveInfo.length - 1; i >= 0; i--) {

                var city = parsedsaveInfo[i]; // most recent first
                var addbutt = addButtonOnly(city);
                $("#buttoncolumn").append(addbutt);
            }

            // $.each(parsedsaveInfo, function (idx, city) {
            // keep here for future reference
            // });

            GetWeatherInfo(cityToLookUp);
        }
    }

    // add a button. Don't append it to anyting in this function
    function addButtonOnly(nameOfCity) {
        var addbutt = $("<button>");
        addbutt.addClass("btn btn-light btn-outline-dark d-flex justify-content-start");
        addbutt.addClass("searchCity"); // $(".searchCity").on("click", lookupCityClicked);
        addbutt.attr("data-city", nameOfCity);
        addbutt.text(nameOfCity);

        return addbutt;
    }

    //user is searching for info on a city
    // the user just clicked on the search button
    function fabuttonClicked(event) {
        event.preventDefault();
        var getlocalstorage = JSON.parse(localStorage.getItem(SAVE_INFO_KEY));

        if (getlocalstorage === null) {
            getlocalstorage = [];
        }

        var nameoCity = $("#enterCity").val().trim(); // name of city, Irish style

        // don't duplicate names.  Not case sensitive.
        if (!getlocalstorage.includes(nameoCity)) {
            var searchedBy = addButtonOnly(nameoCity);
            searchedBy.bind("click", lookupCityClicked); // need this for looking up a city that was recently added
            $("#buttoncolumn").prepend(searchedBy);
            getlocalstorage.push(nameoCity);
            localStorage.setItem(SAVE_INFO_KEY, JSON.stringify(getlocalstorage));
            GetWeatherInfo(nameoCity);
        }

        $("#enterCity").val(""); // clear after search
    }

    // get weather info--mother of all functions in this program
    function GetWeatherInfo(nameCity) {

        // get urls for the two main APIs
        var regularquery = makeURL(queryURL, nameCity);
        var fiveDay = makeURL(query5day, nameCity);

        // asynchronous calls, so don't worry about performance
        $.ajax({
            url: regularquery,
            method: "GET"
        }).then(updatePage);

        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(updatePageForecast);
    }

    // I need to call a separate API just to get the UV index.  
    // 8 or more is severe
    // 0 to 2 is low
    // 3 to 7 is moderate
    //class="bg-danger text-white"
    //.bg-success favorable
    // .bg-warning
    function updateUVIndex(response) {

        $("#curruv").text(response.value);
        if (response.value >= 8) {
            $("#curruv").addClass("bg-danger text-white");
        }
        else if (response.value <= 2) {
            $("#curruv").addClass("bg-success text-white");
        }
        else {
            $("#curruv").addClass("bg-warning");
        }
    }

    // forecast is its own API call
    function Get5DayList(hourbase, listOfWeather) {

        var listarray = [];

        for (var i = 1; i < listOfWeather.length; i++) {
            var item = listOfWeather[i];
            var hourInList = item.dt_txt.substring(11, 13);
            if (hourbase === hourInList) {
                listarray.push(item);
            }
        }

        listarray.push(listOfWeather[listOfWeather.length - 1]); // last one close to current time
        return listarray;
    }

    // update forecast part of the page
    function updatePageForecast(response) {
        $(".forecasted").empty();

        var listOfWeather = response.list;
        var hourbase = listOfWeather[0].dt_txt.substring(11, 13);
        var listarray = Get5DayList(hourbase, listOfWeather);

        // build the forecast section
        for (var i = 0; i < listarray.length; i++) {

            var item = listarray[i];
            var rowforecast = $("#rowForecaster");

            var colBelowRow = $("<div>");
            colBelowRow.addClass("col col-md-2 px-1"); 
            colBelowRow.attr("id", "colBelowRow" + i);
            colBelowRow.appendTo(rowforecast);

            var divCard = $("<div>");
            divCard.addClass("card text-white bg-primary");
            divCard.appendTo(colBelowRow); 

            var divCardBody = $("<div>");
            divCardBody.addClass("card-body pl-1 pr-0");
            divCardBody.appendTo(divCard);

            var hDate = $("<h4>");
            hDate.addClass("card-title");
            var formatted = moment().add(i + 1, 'days').format('MM/DD/YYYY');
            hDate.text(formatted);
            hDate.appendTo(divCardBody);

            var doimg = $("<img>");
            doimg.attr("src", makePNG(item.weather[0].icon));
            doimg.appendTo(divCardBody);

            var dotemp = $("<p>");
            dotemp.addClass("card-text");
            dotemp.text("Temp: " + item.main.temp + " " + "\xB0" + "F");
            dotemp.appendTo(divCardBody);

            var dohumid = $("<p>");
            dohumid.addClass("card-text");
            dohumid.text("Humidity: " + item.main.humidity + "%");
            dohumid.appendTo(divCardBody);

        }
    }

    // make the URL here
    // parameters: current or forecast or uvi--all three API calls are made in this program
    // nameCity: name of the city
    function makeURL(currentOrForecastorUVI, nameCity) {
        var nameoCity = nameCity; 

        var splitted = nameoCity.split(' ');
        var plussed = '';
        $.each(splitted, function (idx, stringer) {

            if (plussed === '') {
                plussed = stringer;
            }
            else {
                plussed += "+" + stringer;
            }
        });

        var entireurl = currentOrForecastorUVI + queryparam + plussed;
        return entireurl;
    }

    // form the weather icon
    function makePNG(pngicon) {
        return iconaddress + pngicon + pngpart;
    }

    // current weather part
    function updatePage(response) {

        var currdate = moment().format("MM/DD/YYYY"); //get hours
        var formatteddate = "(" + currdate + ")"; //format date

        var currentcity = $("#currentCity").val(); // get current city

        // pull values from api
        var imgurl = makePNG(response.weather[0].icon); 
        var currtemp = response.main.temp;
        var currhumid = response.main.humidity;
        var windspeed = response.wind.speed;

        // header current weather
        $("#currentCity").text(response.name);
        $("#currentDatespan").text(formatteddate);
        $("#currentImage").attr("src", imgurl);

        // current weather
        $("#currtemp").text(currtemp);
        $("#currhumid").text(currhumid);
        $("#currspeed").text(windspeed);

        // need latitutde and longitude to get uv index
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        // the lattitude and longitude are needed for finding uv invex
        queryUVIndex += "lat=" + lat + "&lon=" + lon + "&";
        var uvind = makeURL(queryUVIndex, response.name);
        $.ajax({
            url: uvind,
            method: "GET"
        }).then(updateUVIndex);
    }

    $(".searchCity").on("click", lookupCityClicked); // click a button and search by its name, written on the button
    $("#fa_searchButton").on("click", fabuttonClicked); // magnifying glass
});






