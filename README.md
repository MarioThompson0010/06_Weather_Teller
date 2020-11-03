# Weather Reader

## Screenshot:

![Weather Viewer](https://github.com/MarioThompson0010/06_Weather_Teller/blob/main/Assets/ScreenshotWeather.PNG)
![Weather Viewer 2](https://github.com/MarioThompson0010/06_Weather_Teller/blob/main/Assets/ScreenshotWeather2.PNG)

List of technologies: localStorage, CSS, HTML, Javascript, JQuery, and APIs.

This program retrieves relevant data relevant to a city entered by the user: the name of the city, the current date, and an icon showing pictorially what the weather is.  The temperature, humidity, and windspeed of the current weather comes from the Current Weather Data API.

Information is retrieved from the "Current Weather Data" API (found here: https://openweathermap.org/api).  More information is gathered, from another API ("5 Day/3 Hour Forecast".

The forecast data fills in the 5 day forecast section, easily visible as you come to the screen--it's on the lower-right.  

The information on the screen comes from three APIs: Current Weather Data, 5 Day/3 Hour Forecast, and UV Index.  The UV Index field comes from the UV Index API.  The Forecast section comes from the 5 Day/3 Hour Forecast.  The rest of the fields get their information from the Current Weather Data API.

On the left, there's a list of buttons whose text contents contain the name of the city that the user searched for.  The button, when clicked, does a search against that city.  All the fields get populated with that city's weather data.  The user may not delete any of these buttons via the weather web site.  Every time the user searches for a city's data, a button gets prepended to the list, below, which the name of the city on it.  This list gets stored on local storage; the page refreshes itself with the last searched for city.

Above the history of cities searched for, is a textbox that takes user input.  The user simply enters the name of the city and in return gets all the important data about the weather of that city.  The search button is the icon of the magnifying glass.  Press Enter or click that button to fire off the search.

### 5 Day Weather Forecast Algorithm


The assumption for the forecast is that the user is interested in the same time of day for each succeeding day, as the current time of day.  

The 5 day weather forecast is computed, first, by retrieving the second item of a 40-element array.  This is still not the next day, so you don't need to worry about retrieving irrelevant data.  The JSON retrieved from the 5 Day/3 Hour API has 40 elements in an array. The first few are relevant to the current day, not a future one. the user is interested in the next 5 days, not the current one (for the forecast). 

The hour is retrieved from the first element of the 40 element array.  This is the hour closest to the current time of day.  It is probably not exact, but this is the best we can do.  That hour is then used to obtain the next day's forecast.  A search for that hour retrieved is done against the rest of the elements. An equality search is performed, for each succeeding day (except the last). This approximates the next day's forecast, at approximately the same time the user clicked the search button.  It then retrieves information for the next four days, following the algorithm--except for the last day.  The 5th day's forecast is retrieved simply by grabbing the last element's data.  This is a good approximation for a 5 day forecast. 

List of technologies used: weather API, HTML, Bootstrap, Javascript


Link to application:

[Link to weather](https://mariothompson0010.github.io/06_Weather_Teller/)
