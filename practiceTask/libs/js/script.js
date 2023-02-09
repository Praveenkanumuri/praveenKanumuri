//Timezone api call script 

$('#timezoneButton').click(function() {

    $.ajax({
        url: 'libs/php/timezone.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#timezoneLng').val(),
            lat: $('#timezoneLat').val(),
        },
        
        success: function(result) {
            console.log(JSON.stringify(result));

            if(result.status.name == 'ok') {   
            
            $('#first').html('Timezone: ' + result.data.timezoneId); 
            $('#second').html('GMT Offset: ' + result.data.gmtOffset);
            $('#third').html('Sunrise: ' + result.data.sunrise);
            $('#fourth').html('Sunset: ' + result.data.sunset)
            
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert($('#all').html('Error: There is no result with these details, try another ')); 
        }
    });
});

//FindNearBy api call Script 

$('#NearbyButton').click(function() {

    $.ajax({
        url: 'libs/php/nearBy.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#nearbyLng').val(),
            lat: $('#nearbyLat').val(),
        },
        success: function(result) {
            console.log(JSON.stringify(result));

            if(result.status.name == 'ok') {
                $('#first'). html('Closest Toponym : '+ result['data'][0]['toponymName']);
                $('#second').html('Country Code: ' + result['data'][0]['countryCode']);
                $('#third').html('Country Name: ' +result['data'][0]['countryName']); 
                $('#fourth').html('');
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert($('#all').html('Error: There is no result with these details, try another ')); 
        }
    });
});

//srtm api call script 

$('#srtmButton').click(function() {

    $.ajax({
        url: 'libs/php/srtm.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#srtmLng').val(),
            lat: $('#srtmLat').val(),
        },
        success: function(result) {
            console.log(JSON.stringify(result));

            if(result.status.name == 'ok') {
                $('#first').html('Shuttle Radar Topography Mission (SRTM) elevation: ' + result.data.srtm3); 
                $('#second').html('');
                $('#third').html('');
                $('#fourth').html('');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert($('#all').html('Error: There is no result with these details, try another ')); 
        }
    });
});

