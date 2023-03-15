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
// Define a  style object for country map border
var borderStyle = {
    'fillColor': '#000',
    'weight': 6,
    'opacity': 1,
    'color': 'rgba(103, 191, 231, 255)',
    'fillOpacity': 0.5
    };
    
// Create a marker cluster group object
var markersCluster = L.markerClusterGroup();
//function to Convert Kelvin to celsius
const Ktoc = (K) => {
  const celsius = K - 273.15;
  return Math.floor(celsius);
};

//function to convert the country curreny into gbp,usd and eur 
$('#convertButton').click(function() {
    
    
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

});
// Bind a click event to an element with id 'close'
$('#close1').on('click', function() {
// Hide the modal with id 
$('#currencyModal').modal('hide');
});
$('#close2').on('click', function() {
  // Hide the modal with id 
  $('#informationModal').modal('hide');
});
$('#close3').on('click', function() {
  // Hide the modal with id 
  $('#weatherModal').modal('hide');
});
$('#close4').on('click', function() {
  // Hide the modal with id 
  $('#newsModal').modal('hide');
});
  
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
// Adding scale control to the map
L.control.scale().addTo(map);

// Locating the user and setting the view with a maximum zoom level of 5
map.locate({setView: true, maxZoom: 5});

// Setting up Easy buttons for modals
var informationModal = L.easyButton('fa-solid fa-info', function(){
$('#informationModal').modal('show');
}).addTo(map);
var newsModal = L.easyButton('fa fa-newspaper-o', function(){
$('#newsModal').modal('show');
}).addTo(map);
var currencyModal = L.easyButton('fa fa-money ', function(){
$('#currencyModal').modal('show');
}).addTo(map);
var weatherModal = L.easyButton('fa-solid fa-cloud', function(){
    $.ajax({
    url: "libs/php/weather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        latit : latNow,
        long: lonNow
            },
        success: function(result) {
                 

        if (result.status.name == "ok") {
            $('#weatherBo').html("<h2><img src='https://openweathermap.org/img/w/"+result['data']['weather'][0]['icon']+".png'/>"+ Ktoc(result['data']['main']['temp'])+'&#8451;'+"<img src='https://openweathermap.org/img/w/"+result['data']['weather'][0]['icon']+".png'/></h2><small><h2>"+result['data']['weather'][0]['description']+"</h2></small>");
            $('#feelsLikeTemp').html("Feels like:" +Ktoc(result['data']['main']['feels_like']) + "&#8451;");
            $('#temp').html("<i class='fa-solid fa-temperature-arrow-up'></i>&nbsp" + Ktoc(result['data']['main']['temp_max'])  + "&#8451; &nbsp&nbsp" + "  <i class='fa-solid fa-temperature-arrow-down'></i> " + Ktoc(result['data']['main']['temp_min']) + "&#8451;");
            $('#pressure').html("<i class='fas fa-tachometer'></i> " + result['data']['main']['pressure'] + " hPa");    
            $('#humidity').html("<i class='fas fa-tint'></i> " + result['data']['main']['humidity'] + "%");
            $('#windData').html("<h2><i class='fa-solid fa-wind'></i>  " + result['data']['wind']['speed'] + " m/s</h2>");
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    }   
});
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
              const capitalName = data.capital;
              const continentName = data.continentName;
              const population = data.population;
              const area = data.areaInSqKm + "km&sup2";
              const countryName = data.countryName;
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
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
          }
      });
      $.ajax({
          url: "libs/php/countryinfo2.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $('#countryCode').val()
          },
          success: result => {
              if (result.status.name == "ok") {
                  const { callingCode, currency } = result['data'];
                  const { name: currencyName, code: currencyCode } = currency;
                  const { isoNameFull: officialName } = result['data'];
          
                  $('#callCode').html(callingCode);
                  $('#currencyName').html(currencyName);
                  $('#currencyCode').html(currencyCode);
                  $('#officalName').html(officialName);
              }
          },
          error: (jqXHR, textStatus, errorThrown) => {
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
            console.log(JSON.stringify(result));
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
                    <h3 class="newsTitle">${newsTitle.countrynewsTitle0}</h3>
                    <h3><a class="urlLink" href=${newsLink.countrynewsLink0} target="_blank">Read more &#x2192;</a></h3>
                  </div>
                `);
                $("#news1Img").html(`<img class="newsImage" src=${newsImage.countrynewsImage0}>`);
                $("#news2Img").html(`<img class="newsImage" src=${newsImage.countrynewsImage1}>`);
                $('#news2').html(`
                  <div class="newsDiv" id="newsDiv2">
                    <h3 class="newsTitle">${newsTitle.countrynewsTitle1}</h3>
                    <h3><a class="urlLink" href=${newsLink.countrynewsLink1} target="_blank">Read more &#x2192;</a></h3>
                  </div>
                `);
                $("#news3Img").html(`<img class="newsImage" src=${newsImage.countrynewsImage2}>`);
                $('#news3').html(`
                  <div class="newsDiv" id="newsDiv3">
                    <h3 class="newsTitle">${newsTitle.countrynewsTitle2}</h3>
                    <h3><a class="urlLink" href=${newsLink.countrynewsLink2} target="_blank">Read more &#x2192;</a></h3>
                  </div>
                `);
                $("#news4Img").html(`<img class="newsImage" src=${newsImage.countrynewsImage3}>`);
                $('#news4').html(`
                  <div class="newsDiv" id="newsDiv4">
                    <h3 class="newsTitle">${newsTitle.countrynewsTitle3}</h3>
                    <h3><a class="urlLink" href=${newsLink.countrynewsLink3} target="_blank">Read more &#x2192;</a></h3>
                  </div>
                `);
                $("#news5Img").html(`<img class="newsImage" src=${newsImage.countrynewsImage4}>`);
                $('#news5').html(`
                  <div class="newsDiv" id="newsDiv5">
                    <h3 class="newsTitle">${newsTitle.countrynewsTitle4}</h3>
                    <h3><a class="urlLink" href=${newsLink.countrynewsLink4} target="_blank">Read more &#x2192;</a></h3>
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