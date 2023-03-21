// This function will wait for the entire page to load and then check if there's an element with id 'preloader'. 
// If it exists, the preloader element will be faded out with a delay of 1 second and then removed from the DOM.
$(window).on('load', function () {
  if ($('#preloader').length) {
  $('#preloader').delay(1000).fadeOut('slow', function() {
  $(this).remove();
  });
  }
});
// Declare variables
var border;
var clickedLat;
var clickedLng;
var latNow;
var lonNow;
var currencyCode;
var countryName;
var capitalName;
// Define a  style object for country map border
var borderStyle = {
    'fillColor': '#9eed5f',
    'weight': 2,
    'opacity': 0.9,
    'color': 'rgb(232, 97, 113)',
    'fillOpacity': 0.3
    };
    
// Create a marker cluster group object
var markersCluster = L.markerClusterGroup();
//function to Convert Kelvin to celsius
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
//function to convert the country curreny into gbp,usd and eur 
$('#convertButton').click(function() {
    currencyConverter();
});
function currencyConverter() {
  // define an array to store the currency codes to convert to
const currencyCodes = ['USD', 'GBP', 'EUR'];
  
// loop through the currency codes and make an AJAX call for each one
currencyCodes.forEach(code => {
    $.ajax({
        url: "libs/php/currencyconverter.php",
        type: 'POST',
        dataType: 'json',
        data: {
            currency: currencyCode,
            currencyTo: code,
            amountNeed: $('#reqAmount').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                
                // use the currency code to dynamically update the corresponding element
                $('#ConvertedAmount' + code).html(result['data']['result']);
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
});
}
function weatherUpdate() {
  $.ajax({
    url: "libs/php/getWeather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        latit : latNow,
        long: lonNow
            },
        success: function(result) {
                 
  
        if (result.status.name == "ok") {
          
          const timestamp =result['data']['current']['dt'] ; // timestamp in milliseconds
          const dateObj = new Date(timestamp*1000);
          const hours = dateObj.getHours();
          const minutes = dateObj.getMinutes();
          const period = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12; // convert 24-hour time to 12-hour time
          const formattedMinutes = minutes.toString().padStart(2, '0'); // add leading zero if necessary
          const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
          
          console.log(formattedTime); // output: 01:30 AM
          const formattedDates = [];
          for (let i = 1; i <= 2; i++) {
            const timestamp = result['data']['daily'][i]['dt'];
            const dateObj = new Date(timestamp * 1000); // convert from Unix timestamp (in seconds) to JavaScript timestamp (in milliseconds)
            const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObj);
            const dayOfMonth = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(dateObj);
            const daySuffix = (dayOfMonth >= 11 && dayOfMonth <= 13) ? 'th' :
                               (dayOfMonth % 10 === 1) ? 'st' :
                               (dayOfMonth % 10 === 2) ? 'nd' :
                               (dayOfMonth % 10 === 3) ? 'rd' : 'th';
            const formattedDate = `${dayOfWeek} ${dayOfMonth}${daySuffix}`;
            formattedDates.push(formattedDate); // add the formatted date to the array
          }
          $('#weatherModalLabel').html(capitalName + ", " + countryName);
          $('#todayConditions').html(capitalizeFirstLetter(result['data']['daily'][0]['weather'][0]['description']));
          $('#todayIcon').attr("src",'https://openweathermap.org/img/w/'+result['data']['daily'][0]['weather'][0]['icon']+'.png' ) ;
          $('#todayMaxTemp').html(result['data']['daily'][0]['temp']['max']);
          $('#todayMinTemp').html(result['data']['daily'][0]['temp']['min']);
          $('#day1Icon').attr("src",'https://openweathermap.org/img/w/'+result['data']['daily'][1]['weather'][0]['icon']+'.png');
          $('#day1MinTemp').text(result['data']['daily'][1]['temp']['min']);
          $('#day1MaxTemp').text(result['data']['daily'][1]['temp']['max']);
          $('#day2Icon').attr("src",'https://openweathermap.org/img/w/'+result['data']['daily'][2]['weather'][0]['icon']+'.png');
          $('#day2MinTemp').text(result['data']['daily'][2]['temp']['min']);
          $('#day2MaxTemp').text(result['data']['daily'][2]['temp']['max']);
          $('#day1Date').text(formattedDates[0]);
          $('#day2Date').text(formattedDates[1]);
          $('#lastUpdated').text(formattedTime);
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    }   
  });
}
  
// This  creates a Leaflet map object and sets the initial view to fit the world.
var map = L.map('mapDiv').fitWorld();
var map1=L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=l13PzqBUaJPEHgwbyl6HEIqBU0KXmLFCI4ZkeDdWfGKe7YY90o10qiyzhtWYWCmI',{
    minZoom:3,
    maxZoom:20,
    tileSize: 512,
    zoomOffset: -1,
    attribution:"<a href='https://www.jawg.io\' target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors",
    
})
map1.addTo(map);
var map2=L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=l13PzqBUaJPEHgwbyl6HEIqBU0KXmLFCI4ZkeDdWfGKe7YY90o10qiyzhtWYWCmI',{
  minZoom:3,
  maxZoom:20,
  tileSize: 512,
  zoomOffset: -1,
    attribution:"<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"

})
var map3=L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=l13PzqBUaJPEHgwbyl6HEIqBU0KXmLFCI4ZkeDdWfGKe7YY90o10qiyzhtWYWCmI',{
   minZoom:3,
    maxZoom:20,
    tileSize: 512,
   zoomOffset: -1,
    attribution:"<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors"

})
var map4 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom:3,
    maxZoom:20,
    tileSize: 512,
    zoomOffset: -1,
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
var basemaps = {
  "Streets": map1,
  "Terrain": map2,
  "Dark":map3,
  "Satellite":map4
};
var layerControl = L.control.layers(basemaps).addTo(map);
// Adding scale control to the map
L.control.scale().addTo(map);

// Locating the user and setting the view with a maximum zoom level of 5
map.locate({setView: true, maxZoom: 5});

// Setting up Easy buttons for modals
var informationModal = L.easyButton('fa-solid fa-info', function(){
$('#informationModal').modal('show');
}).addTo(map);
var newsModal = L.easyButton('fa-solid fa-newspaper', function(){
$('#newsModal').modal('show');
}).addTo(map);
var currencyModal = L.easyButton('fa-solid fa-money-bill-transfer', function(){
  currencyConverter();
$('#currencyModal').modal('show');
}).addTo(map);
var weatherModal = L.easyButton('fa-solid fa-cloud', function(){
weatherUpdate();
$('#weatherModal').modal('show');
}).addTo(map);

// Define a function to be called when the user's location is found
function locationFound(e) {
    // Get the current latitude and longitude from the event object
    const lat = e.latitude;
    const lng = e.longitude;

    // Send a request to the weather.php script with the current latitude and longitude
    $.ajax({
        url: 'libs/php/weather.php',
        type: 'POST',
        dataType: 'json',
        data: { 
            latit: lat,
            long: lng 
        },

        success: function(result) {
            // If the request is successful, update the country code input with the result
            if (result.status.name === 'ok') {
                const country = result.data.sys.country;
                $('#countryCode').val(country).change();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // If there is an error with the request, log the error information to the console
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
}
// Call the locationFound function when the location is found
map.on('locationfound', locationFound);

function locationError(e) {
  alert(e.message + "  Unable to detect location" );
}
map.on('locationerror',locationError);
//function to select the country on the map by double clicking on it 
function dblcountry(a, b) {
    $.ajax({
        url: 'libs/php/weather.php',
        type: 'POST',
        dataType: 'json',
        data: { 
            latit: a,
            long: b 
        },
    
        success: function(result) {
            if (result.status.name === 'ok') {
                const country = result.data.sys.country;
                $('#countryCode').val(country).change();
                latNow = clickedLat;
                lonNow = clickedLng;
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
};
map.on('dblclick', function(e) {
    const doubleClickedLat = e.latlng.lat;
    const doubleClickedLng = e.latlng.lng;
    dblcountry(doubleClickedLat, doubleClickedLng);
});
// Load ISO country data and populate select-dropdown menu
$.ajax({
    url: 'libs/php/isoCountries.php',
    type: 'POST',
    dataType: 'json',
    success: function(data) {
      const countries = data['data'];
  
      // Add options to select-dropdown menu
      for (let i = 0; i < countries.length; i++) {
        const countryCode = countries[i]['code'];
        const countryName = countries[i]['name'];
  
        $('#countryCode').append($('<option>', {
          value: countryCode,
          text: countryName
        }));
      }
  
      // Sort options in alphabetical order by country name
    
      const options = $('#countryCode option').sort(function(a, b) {
        return a.text.localeCompare(b.text);
      });
  
      // Update select-dropdown menu with sorted options
      $('#countryCode').empty().append(options);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(`Error: ${textStatus} ${errorThrown}`);
    }
  });

  function changeCountry()  {
  // Send an AJAX request to retrieve the border of the selected country
  $.ajax({
    url: "libs/php/borders.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $('#countryCode').val()
    },
    // Handle the response from the server
    success: function(result) {
        // Find the selected country in the list of countries returned by the server
        const selectedCountry = result['data'].find(country => {
            return country['code'] === $('#countryCode').val();
        });
        // Get the border of the selected country from the server response
        const selectedBorder = selectedCountry.border;
  
        // Remove any previous borders from the map
        if (map.hasLayer(border)) {
            map.removeLayer(border);
        }
        
        // Create a new geoJSON object with the selected country's border
        border = L.geoJSON(selectedBorder, {
            style: borderStyle
        });
  
        // Add the new border to the map
        border.addTo(map);
  
        // Zoom the map to the selected country's border
        map.fitBounds(border.getBounds());
    },
    // Handle errors that occur during the AJAX request
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    }
    });
    $.ajax({
        url: "libs/php/pos.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $('#countryCode').val()
          },
          success: function(result) {
      
              //console.log(JSON.stringify(result));
      
              if (result.status.name == "ok") {
                  const { lat, lon } = result.data[0];
                  latNow = lat;
                  lonNow = lon;   
              }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus);
              console.log(errorThrown);
              console.log(jqXHR);
          }
      });
      $.ajax({
          url: "libs/php/countryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {
            country: $('#countryCode').val()
          },
          success: function(result) {
            if (result.status.name == "ok") {
              const data = result.data[0];
              capitalName = data.capital;
              const continentName = data.continentName;
              const population = data.population;
              const area = data.areaInSqKm + "km&sup2";
              countryName = data.countryName;
              currencyCode = result['data'][0]['currencyCode'];
              countryIS = data.countryName;
              $('#cCCode').html(currencyCode);
              $('#capitalName').html(capitalName);
              $('#continentName').html(continentName);
              $('#population').html(population);
              $('#area').html(area);
              $('#countryName').html(countryName);
              $('#currencyHead').html(`${countryName}'s currency Exchange Rates`);
              $('#flagImg').html(`<img src="https://flagsapi.com/${$('#countryCode').val()}/flat/64.png">`);
              $('#weatherTitle').html(`${countryIS}'s Weather`);
              $('#newsTitle').html(`${countryIS}'s Latest News`);
              $('#reqAmount').val(1)
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
          }
      });
      $.ajax({
        url: "libs/php/countryData.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryCode').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
            
                if (result.status.name == "ok") {
                  
                 
                
                    $('#callCode').html(result['data']['callingCode']);
                    $('#currencyName').html(result['data']['currency']['name']);
                    $('#currencyCode').html(result['data']['currency']['code']);
                    $('#officalName').html(capitalizeFirstLetter(result['data']['isoNameFull']));
    
                 }

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
      });
      $.ajax({
          url: "libs/php/news.php",
          type: 'POST',
          dataType: 'json',
          data: {
            country: $('#countryCode').val()
          },
          success: function(result) {
            // console.log(JSON.stringify(result));
            var newsLink = {};
            var newsTitle = {};
            var newsImage = {};
            var image = "libs/images/newsImage.jpg";
        
            if (result.status.name == "ok") {
              for (let i = 0; i <= 5; i++) {
                newsLink[`countrynewsLink${i}`] = result.data[i].link;
                newsTitle[`countrynewsTitle${i}`] = result.data[i].title;
                newsImage[`countrynewsImage${i}`] = result.data[i].image_url || image;
              }
              if (result.totalResults !== 0) {
                $('#news1').html(`
                  <div class="newsDiv" id="newsDiv1">
                    <h5 class="newsTitle">${newsTitle.countrynewsTitle0}</h5>
                    <h6><a class="urlLink" href=${newsLink.countrynewsLink0} target="_blank">Read more &#x2192;</a></h6>
                  </div>
                `);
                $("#news1Img").html(`<img id="newsImage" class="shadow p-3 mb-5 bg-white rounded" src=${newsImage.countrynewsImage0}>`);
                $("#news2Img").html(`<img id="newsImage" class="shadow p-3 mb-5 bg-white rounded" src=${newsImage.countrynewsImage1}>`);
                $('#news2').html(`
                  <div class="newsDiv" id="newsDiv2">
                    <h5 class="newsTitle">${newsTitle.countrynewsTitle1}</h5>
                    <h6><a class="urlLink" href=${newsLink.countrynewsLink1} target="_blank">Read more &#x2192;</a></h6>
                  </div>
                `);
                $("#news3Img").html(`<img id="newsImage" class="shadow p-3 mb-5 bg-white rounded" src=${newsImage.countrynewsImage2}>`);
                $('#news3').html(`
                  <div class="newsDiv" id="newsDiv3">
                    <h5 class="newsTitle">${newsTitle.countrynewsTitle2}</h5>
                    <h6><a class="urlLink" href=${newsLink.countrynewsLink2} target="_blank">Read more &#x2192;</a></h6>
                  </div>
                `);
                $("#news4Img").html(`<img id="newsImage" class="shadow p-3 mb-5 bg-white rounded" src=${newsImage.countrynewsImage3}>`);
                $('#news4').html(`
                  <div class="newsDiv" id="newsDiv4">
                    <h5 class="newsTitle">${newsTitle.countrynewsTitle3}</h5>
                    <h6><a class="urlLink" href=${newsLink.countrynewsLink3} target="_blank">Read more &#x2192;</a></h6>
                  </div>
                `);
                $("#news5Img").html(`<img id="newsImage" class="shadow p-3 mb-5 bg-white rounded" src=${newsImage.countrynewsImage4}>`);
                $('#news5').html(`
                  <div class="newsDiv" id="newsDiv5">
                    <h5 class="newsTitle">${newsTitle.countrynewsTitle4}</h5>
                    <h6><a class="urlLink" href=${newsLink.countrynewsLink4} target="_blank">Read more &#x2192;</a></h6>
                  </div>
                `);
              } else {
                $('#news1').html("<h2>No news available for this country at the moment</h2>");
                $("#news1Img, #news2Img, #news3Img, #news4Img, #news5Img").html("");
                $('#news2, #news3,#news3, #news4, #news5').html("");
              }
          }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus);
              console.log(errorThrown);
              console.log(jqXHR);
          }
      });
      $.ajax({
          url: "libs/php/airport.php",
          type: 'POST',
          dataType: 'json',
          data: {
            country: $('#countryCode').val()
          },
          success: function(result) {
            if (result.status.name == "ok") {
              // Define an airport icon using the ExtraMarkers library
              var airportIcon = L.ExtraMarkers.icon({
              icon: 'fad fa-plane-departure',
              markerColor: '#f6883d',
              shape: 'circle',
              prefix: 'fa',
              svg: true
              });
              const airportMarkers = [];
              for (let i = 0; i < 20; i++) {
                const { lat, lng, toponymName } = result.data[i];
                const marker = L.marker([lat, lng], { icon: airportIcon }).bindPopup(
                  `<p style='text-align: center; font-weight: bold; font-size: 20px; font-family: sans-serif'>${toponymName}</p>`
                );
                airportMarkers.push(marker);
                markersCluster.addLayer(marker);
              }
              
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown, jqXHR);
          }
        });
        $.ajax({
          url: "libs/php/city.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $('#countryCode').val()
          },
          success: function(result) {
              if (result.status.name == "ok") {   
                    // Define a city icon using the ExtraMarkers library
                    var cityIcon = L.ExtraMarkers.icon({
                    icon: 'fas fa-city',
                    markerColor: 'rgba(103,191,231,255)',
                    shape: 'square',
                    prefix: 'fa',
                    svg: true
                    });
                    const cityMarkers = [];
                    for (let i = 0; i < 20; i++) {
                      const { lat, lng, name } = result.data[i];
                      const marker = L.marker([lat, lng], { icon: cityIcon }).bindPopup(
                        `<p style='text-align: center; font-weight: bold; font-size: 20px font-family: sans-serif;'>${name}</p>`
                      );
                      cityMarkers.push(marker);
                      markersCluster.addLayer(marker);
                    }
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus);
              console.log(errorThrown);
              console.log(jqXHR);
          }
      });
      
  };

// event handler function to update the modal information when user changes the country 
$('#countryCode').change(function() {
    markersCluster.clearLayers();
    map.removeLayer(markersCluster);
    changeCountry();
    map.addLayer(markersCluster);
});