var root_url = "http://comp426.cs.unc.edu:3001/";
var user_id = "";
var review_mode = true;
var api_key = "AIzaSyAe_sC3y9S_PQW_N_S7ccNDhq-QwmYvD1k";
var map;
var flights = [];
var cur_flight_id = 0;
var flightPath = null;
var startMarker = null;
var endMarker = null;
var flightMarker = null;

var depLatLng = null;
var arrLatlng = null;


function addFlight (){
    
}

function populate_airline(airline_id){
   let text_box = document.getElementById("airline_input");
   text_box.value = airline_id;
}

function airlineList (airline_data){
    let $table_header = $('<ul class="list-group airline-list">');
    for (var i=0; i<airline_data.length; i++){
        $table_header.append('<li class="list-group-item" onclick="populate_airline('+airline_data[i].id+')">'+airline_data[i].name+ '&nbsp&nbsp&nbsp - &nbsp&nbsp'+ airline_data[i].id +'</li>');
    }
    $('.table-bordered').after($table_header);
}

function getAirlines($col){
    $col.append('<table class="table table-bordered"><thead><tr><th scope="col">Airline</th><th scope="col">ID</th></tr></thead></table>');
    $.ajax(root_url + 'airlines', {
        type:'GET',
        dataType:'json',
        xhrFields:{withCredentials:true},
        success:(response)=>{
            airlineList(response);
        },
        error: () => {
            alert('error');
        }
    });    
}

// ADD FORM
function buildFormInterface(review){
    let $body = $('body');
    $body.empty();
    appendNavBar($body, user_id);
    let $navBar = $('.navbar');
     
    let $jumbotron = $('<div class="jumbotron" id="add-flight-jumbo"></div>');
    
    let $container = $('<div class="container"></div>');
    $jumbotron.append($container);
    
    let $row = $('<div class="row"></div>');
    $container.append($row);
    
    let $col1 = $('<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-4"></div>');
    let $form = $('<form class= "col-xl-9 col-lg-9 col-md-9 col-sm-9 col-xs-8">');
    
    getAirlines($col1);
    
    if(review){
        $form.append('<h2> Search Flights </h2>'); 
        $form.append('<p> Use the following form to search flights. <b><i> Note: fields marked with an * are required <i><b></p>');
    }else{
        $form.append('<h2> Add Flight </h2>');
        $form.append('<p> Use the following form to add flights. <b><i> Note: fields marked with an * are required <i><b></p>');
    }
    
    
    let $depart_time = $('<div>', {class:'form-group'});
    if(review){
         $depart_time.append($('<label>',{for:'depart_time_input', html:'Departure Time: '}));
    }else{
        $depart_time.append($('<label>',{for:'depart_time_input', html:'*Departure Time*: '}));
    }
    $depart_time.append($('<input>',{type: "text", class: 'form-control', id:'depart_time_input', placeholder:'Enter departure time'}));
    $form.append($depart_time);
    
    let $arrival_time = $('<div>', {class:'form-group'});
    if(review){
        $arrival_time.append($('<label>',{for:'arrival_time_input', html:'Arrival Time: '})); 
    }else{
        $arrival_time.append($('<label>',{for:'arrival_time_input', html:'*Arrival Time*: '}));
    }
    $arrival_time.append($('<input>',{type: "text", class: 'form-control', id:'arrival_time_input', placeholder:'Enter arrival time'}));
    $form.append($arrival_time);
    
    let $flight_number = $('<div>', {class:'form-group'});
    if(review){
        $flight_number.append($('<label>',{for:'flight_number_input', html:'Flight Number:'}));  
    }else{
        $flight_number.append($('<label>',{for:'flight_number_input', html:'*Flight Number*:'}));
    }
    $flight_number.append($('<input>',{type: "text", class: 'form-control', id:'flight_number_input', placeholder:'Enter flight number'}));
    $form.append($flight_number);
    
    let $departure_airport_group = $('<div>', {class:'form-group'});
    if(review){
        $departure_airport_group.append($('<label>',{for:'departure_airport_input', html:'Departure Airport Code: '})); 
    }else{
        $departure_airport_group.append($('<label>',{for:'departure_airport_input', html:'*Departure Airport Code*: '}));
    }
    $departure_airport_group.append($('<input>',{type: "text", class: 'form-control', id:'departure_airport_input', placeholder:'Enter the airport code for the departure airport'}));
    $form.append($departure_airport_group);    
    
    let $arrival_airport_group = $('<div>', {class:'form-group'});
    if(review){
        $arrival_airport_group.append($('<label>',{for:'arrival_airport_input', html:'Arrival Airport Code: '})); 
    }else{
        $arrival_airport_group.append($('<label>',{for:'arrival_airport_input', html:'*Arrival Airport Code*: '}));
    }
    $arrival_airport_group.append($('<input>',{type: "text", class: 'form-control', id:'arrival_airport_input', placeholder:'Enter the airport code for the arrival airport'}));
    $form.append($arrival_airport_group);
    
    let $airline = $('<div>', {class:'form-group'});
    $airline.append($('<label>',{for:'airline_input', html:'Airline ID: '}));
    $airline.append($('<input>',{type: "text", class: 'form-control', id:'airline_input', placeholder:'Enter airline ID or select airport on the left'}));
    $form.append($airline);
   
    let $flight_date = $('<div>', {class:'form-group'});
    $flight_date.append($('<label>',{for:'flight_date_input', html:'*Departure Date*: '}));
    $flight_date.append($('<input>',{type: "text", class: 'form-control', id:'flight_date_input', placeholder:'Enter the departure date in the form YEAR-MONTH-DAY'}));
    $form.append($flight_date);
    
    if(review){
         $form.append($('<button>', {class:'btn btn-primary', type:'button', html:'Search', onclick:'searchFlights()'}));
    }else{
        $form.append($('<button>', {class:'btn btn-primary', type:'button', html:'Add', onclick:'addFlight()'}));
    }
    $row.append($col1);
    $row.append($form);
    $navBar.after($jumbotron);
}

// REVIEW MODE
function buildReviewSelectorInterface(){
    review_mode = true;
    let $body = $('body');
    $body.empty();
    appendNavBar($body, user_id);
    buildFormInterface(review_mode);
}

// ADD MODE
function buildAddSelectorInterface(){
    review_mode = false;
    let $body = $('body');
    $body.empty();
    appendNavBar($body, user_id);
    buildFormInterface(review_mode);
}

// NAVIGATION BAR
function appendNavBar($container, username){
    let $navbar = $('<nav>', {class:'navbar navbar-inverse'});
    
    let $nav_container = $('<div>', {class: 'container-fluid'});
    
    let $header = $('<div>', {class: 'navbar-header'});
    $header.append($('<p>', {class: 'navbar-text', html: 'Flight Visualizer'}));
    $nav_container.append($header);

    let $nav_list = $('<ul>', {class: 'nav navbar-nav'});
    $nav_list.append('<li id="review-nav-elt" onclick="buildReviewSelectorInterface()"><a href="#">Review Flights</a></li>');
    $nav_list.append('<li id="add-nav-elt" onclick="buildAddSelectorInterface()"><a href="#">Add Flights</a></li>');
    $nav_container.append($nav_list);
    
    let $nav_list_right = $('<ul>', {class: 'nav navbar-nav navbar-right'});
    
    let $user_li = $('<li>');
    let $user_li_p = $('<p>', {class:'navbar-text id:user-name'});
    $user_li_p.append($('<span>', {class:'glyphicon glyphicon-user'}));
    $user_li_p.append(' ' + username);
    $user_li.append($user_li_p);
    $nav_list_right.append($user_li);
    
    let $logout_li = $('<li>');
    let $logout_li_a = $('<a>');
    $logout_li_a.append($('<span>', {class:'glyphicon glyphicon-log-out'}));
    $logout_li_a.append(' logout');
    $logout_li.append($logout_li_a);
    $nav_list_right.append($logout_li);
    
    $nav_container.append($nav_list_right);
    $navbar.append($nav_container);
    $container.append($navbar);
    
}


// AIRPOROT CODE -> ID
function getAirportId(code){
        let rv = 0;
        $.ajax(root_url + 'airports?filter[code]=' + code, {
            type:'GET',
            dataType:'json',
            xhrFields:{withCredentials:true},
            async:false,
            success:(response)=>{
                if(response.length==0){
                    rv = -1;
                }else{
                    rv = response[0].id;
            
                }
            },
            error: () => {
                rv = -1;
            }
        });
        return rv;
    }

// FLITER + SEARCH FLIGHTS
function searchFlights(){
    
    let filter_object = {};
    $('#flight-search-msg').empty();
    
    let dep_a_id = 0;
    let arr_a_id = 0;
    let dep_date = null;
    let bad_param = false;
            
    let getInstances = (params, flight_date) => {
        let instances = [];
        
        let instanceExists = (flight) => {
            rv = false;
            $.ajax(root_url + 'instances',{
                type:'GET',
                dataType:'json',
                xhrFields:{withCredentials:true},
                data:{
                    filter:{
                        flight_id: flight.id,
                        date: flight_date
                    }
                },
                async: false,
                success: (response) => {
                    if(response.length > 0){
                        rv = true;
                    }
                },
            });
            return rv;
        }
        
        $.ajax(root_url + 'flights',{
            type:'GET',
            dataType:'json',
            xhrFields:{withCredentials:true},
            data:{
                filter: params
            },
            async:false,
            success: (response) => {
                if(response.length==0){
                    return null;
                }
                for(let i=0; i<response.length; i++){
                    if(instanceExists(response[i])){
                        instances.push(response[i]);
                    }
                }
            }
        });
        
        return instances;
    }
        
    let flight_number = $('#flight-number-input').val();
    if(flight_number!=''){
        filter_object['number'] = flight_number;
    }
    
    let dep_airport = $('#departure-airport-input').val();
    if(dep_airport!=''){
        dep_a_id = getAirportId(dep_airport);
        if(dep_a_id == -1){
            $('#flight-search-msg').append('Departure airport not found. Please enter a new departure airport and try again.<br>');
            bad_param = true;
        }
        filter_object['departure_id'] = dep_a_id.toString();
    }
    
    let arr_airport = $('#arrival-airport-input').val();
    if(arr_airport!=''){
        arr_a_id = getAirportId(arr_airport);
        if(arr_a_id==-1){
            $('#flight-search-msg').append('Arrival airport not found. Please enter a new arrival airport and try again.<br>');
            bad_param = true;
        }
        filter_object['arrival_id'] = arr_a_id.toString();
    }
        
    dep_date = $('#departure-date-input').val();
    
    if(bad_param){
        return;
    }
    
    flights = getInstances(filter_object, dep_date);
    console.log(flights.length);
    
    buildReviewFlightInterface();
}

function updateMap(){
    
    if(flightMarker==null ||depLatLng==null||arrLatlng==null){
        return;
    }
    
    let startPoint = new google.maps.LatLng(depLatLng.lat, depLatLng.lng);
    let endPoint = new google.maps.LatLng(arrLatlng.lat, arrLatlng.lng); 

    let progress = $('#flight-range').val();
    let progress_frac = parseFloat(progress)/1000;
    
    var pos = google.maps.geometry.spherical.interpolate(startPoint, endPoint, progress/1000);
    
    flightMarker.setPosition(pos);
    
    let progress_perc = (progress_frac * 100).toFixed(1);
    
    $('#flight-range-label').html('Flight percentage completed: ' + progress_perc + '%');
}

function addNewMapPath(dep_lat, dep_lon, arr_lat, arr_lon){
    debugger;
    
    if(flightPath!=null){
        flightPath.setMap(null);
    }
    
    if(startMarker!=null){
        startMarker.setMap(null);
    }
    
    if(endMarker!=null){
        endMarker.setMap(null);
    }
    
    if(flightMarker!=null){
        flightMarker.setMap(null);
    }
    
    let flightPathCoordinates = [
        {lat: parseFloat(dep_lat), lng: parseFloat(dep_lon)},
        {lat: parseFloat(arr_lat), lng: parseFloat(arr_lon)}
    ];
    flightPath = new google.maps.Polyline({
        path: flightPathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    
    depLatLng = {
        lat: parseFloat(dep_lat),
        lng: parseFloat(dep_lon)
    }
    
    startMarker = new google.maps.Marker({
        position: depLatLng,
        title:"Departure Position"
    });
    
    startMarker.setMap(map);
    
    arrLatlng = {
        lat: parseFloat(arr_lat),
        lng: parseFloat(arr_lon)
    }
    
    endMarker = new google.maps.Marker({
       position:arrLatlng,
        title: "Arrival Position"
    });
    
    endMarker.setMap(map);
    
    flightMarker = new google.maps.Marker({
       position: depLatLng,
        title:"Flight Position"
    });
    
    flightMarker.setMap(map);
    
    $('#flight-range').val(0);
}

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.850033, lng: -87.6500523},
    zoom: 3
  });
}

function appendFlightList($container){    
    let $list_group = $('<ul>',{class:'list-group flight-review-list'});
        
    for(let i=0; i<flights.length; i++){
        let elt_id = 'list-elt-' + flights[i].id;
        let $list_elt = $('<li>',{
            class:'list-group-item',
            id: elt_id,
            type:'button',
            onClick:'trackNewFlight('+flights[i].id+')'
        });
        $list_group.append($list_elt);
        $.ajax(root_url+'airlines/'+flights[i].airline_id,{
            type:'GET',
            dataType:'json',
            xhrFields:{withCredentials:true},
            success:(response)=>{
                $('#'+elt_id).html($('#'+elt_id).html() + response.name + ' -- ');
                $.ajax(root_url + 'airports/' + flights[i].departure_id,{
                    type:'GET',
                    dataType:'json',
                    xhrFields:{withCredentials:true},
                    success:(response)=>{
                        $('#'+elt_id).html($('#'+elt_id).html() + response.code +'->');
                        $.ajax(root_url + 'airports/' + flights[i].arrival_id,{
                            type:'GET',
                            dataType:'json',
                            xhrFields:{withCredentials:true},
                            success:(response)=>{
                                $('#'+elt_id).html($('#'+elt_id).html() + response.code);
                            }
                        });
                    }    
                });
            }
        });
    }
    
    $container.append($list_group);
}

function trackNewFlight(flight_id){
    debugger;
    
    if(flight_id == cur_flight_id){
        return;
    }
    
    let flight = null;
    
    for(let i=0; i<flights.length; i++){
        if(flights[i].id == flight_id){
            flight = flights[i];
            break;
        }
    }
    
    if(flight==null){
        return;
    }
    
    $('#list-elt-' + cur_flight_id).removeClass('active');
    cur_flight_id = flight_id;
    
    let $flight_li = $('#list-elt-'+flight_id);
    $flight_li.addClass('active');
    
    $.ajax(root_url + 'airports/' + flight.departure_id,{
        type:'GET',
        dataType:'json',
        xhrFields:{withCredentials:true},
        success:(response)=>{
            let dep_lat = response.latitude;
            let dep_lon = response.longitude;
            $.ajax(root_url+'airports/'+flight.arrival_id,{
                type:'GET',
                dataType:'json',
                xhrFields:{withCredentials:true},
                success: (response)=>{
                    let arr_lat = response.latitude;
                    let arr_lon = response.longitude;
                    addNewMapPath(dep_lat, dep_lon, arr_lat, arr_lon);
                }
            });
        }
        
    });
    
}

function buildReviewFlightInterface(){
    let $body = $('body');
    $body.empty();
    
    appendNavBar($body);
    
    
    let $jumbo = $('<div>', {class:'jumbotron container container-fluid'});
        
    let $row = $('<div>', {class:'row'});
    let $col1 = $('<div>', {class:'col-xs-12 col-sm-12 col-md-4 col-lg-4', id:'flight-review-list-col'});
    
    $col1.append('<h4>Select Flight To Review</h4>');
    $col1.append('<p>Click on the flight you would like to visualize on the map</p>');
    appendFlightList($col1);
    $col1.append($('<button>',{class:'btn btn-primary btn-block', html:'Change Search Criteria', onclick:'buildReviewSelectorInterface()'}));
    
    $row.append($col1);
    
    let $col2 = $('<div>',{class: 'col-xs-12 col-sm-12 col-md-8 col-lg-8', id:'map-col'});
    $col2.append($('<div>', {class:'container container-fluid', id:'map'}));
    $col2.append($('<label>',{for:'flight-range', html:'Flight percentage completed:', id:'flight-range-label'}));
    $col2.append($('<input>',{type:'range', class:'custom-range', id:'flight-range', min: 0, max:1000, oninput:'updateMap()'}));
    
    $row.append($col2);
    
    $jumbo.append($row);
    $body.append($jumbo);
    
    debugger;
    
    initMap();
}

// NEW USER
function create_user (user, password){
    $.ajax(root_url + 'users', {
        type: 'POST',
        xhrFields: {withCredentials: true},
        data:{
            user: {
                username: user,
                password: password
            }
        },
        success: (response)=>{
            login(user,password);
            user_id = user;
        },
        error: ()=>{
            alert('error');
        }
    });
}

// LOGIN
function login (user, password){
    $.ajax(root_url + 'sessions',{
        type: 'POST',
        dataType: 'json',
        xhrFields: {withCredentials: true},
        data:{
            user: {
                username: user,
                password: password
            }
        },
        success: (response)=>{
             user_id = user;
             buildReviewSelectorInterface();
        
        },
        error: ()=>{
            alert('error');
        }
    });
}


$(document).ready(function() {
    $(document).on('click', '.login-button', function build_login(){
        let user_id = $('#lg_username').val();
        let pass = $('#lg_password').val();
        login(user_id, pass);
    });
    
    $(document).on('click', '.create', function new_user(){
        let user_id = $('#modal_username').val();
        let pass = $('#modal_password').val();
        create_user(user_id, pass);
    });

});