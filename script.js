var root_url = "http://comp426.cs.unc.edu:3001/";
flights = {};

function appendNavBar($container, username){
    let $navbar = $('<nav>', {class:'navbar navbar-inverse'});
    
    let $nav_container = $('<div>', {class: 'container-fluid'});
    
    let $header = $('<div>', {class: 'navbar-header'});
    $header.append($('<p>', {class: 'navbar-text', html: 'Flight Visualizer'}));
    $nav_container.append($header);
    
    let $nav_list = $('<ul>', {class: 'nav navbar-nav'});
    $nav_list.append('<li id="review-nav-elt" onclick="buildReviewSelectorInterface()"><a href="#">Review Flights</a></li>');
    $nav_list.append('<li id="add-nav-elt" onclick="buildAddInterface()"><a href="#">Add Flights</a></li>');
    $nav_container.append($nav_list);
    
    let $nav_list_right = $('<ul>', {class: 'nav navbar-nav navbar-right'});
    
    let $user_li = $('<li>');
    let $user_li_p = $('<p>', {class:'navbar-text'});
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

function appendSelectorForm($container){
    let $jumbotron = $('<div>', {class:'jumbotron', id:'flight-search-jumbo'});
    
    $jumbotron.append('<h2> Flight Search </h2>')
    $jumbotron.append('<p> Use the following form to search for flights. <b><i> Note: fields marked with an * are required <i><b></p>');
    
    let $form = $('<form>');
    
    let $flight_number_group = $('<div>', {class:'form-group'});
    $flight_number_group.append($('<label>',{for:'flight-number-input', html:'Flight Number: '}));
    $flight_number_group.append($('<input>',{type: "text", class: 'form-control', id:'flight-number-input', placeholder:'Enter flight number'}));
    $form.append($flight_number_group);
    
    let $departure_airport_group = $('<div>', {class:'form-group'});
    $departure_airport_group.append($('<label>',{for:'departure-airport-input', html:'*Departure Airport Code*: '}));
    $departure_airport_group.append($('<input>',{type: "text", class: 'form-control', id:'departure-airport-input', placeholder:'Enter the airport code for the departure airport'}));
    $form.append($departure_airport_group);    
    
    let $arrival_airport_group = $('<div>', {class:'form-group'});
    $arrival_airport_group.append($('<label>',{for:'arrival-airport-input', html:'*Arrival Airport Code*: '}));
    $arrival_airport_group.append($('<input>',{type: "text", class: 'form-control', id:'arrival-airport-input', placeholder:'Enter the airport code for the arrival airport'}));
    $form.append($arrival_airport_group);
    
    let $flight_date_group = $('<div>', {class:'form-group'});
    $flight_date_group.append($('<label>',{for:'departure-date-input', html:'*Departure Date*: '}));
    $flight_date_group.append($('<input>',{type: "text", class: 'form-control', id:'departure-date-input', placeholder:'Enter the departure date in the form YEAR-MONTH-DAY'}));
    $form.append($flight_date_group);
    
    $form.append($('<button>', {class:'btn btn-primary', type:'button', html:'Search', onclick:'searchFlights()'}));
    
    $jumbotron.append($form);
    $jumbotron.append($('<p>',{id:'flight-search-msg'}));
    $container.append($jumbotron);

}

function searchFlights(){
    
    let filter_object = {};
    $('#flight-search-msg').empty();
    
    let dep_a_id = 0;
    let arr_a_id = 0;
    let dep_date = '';
    let missing_param = false;
        
    let getAirportId = (code) => {
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
    
    let getInstances = (params, flight_date) => {
        let instances = {};
        
        let instanceExists = (flight) => {
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
                        return true;
                    }else{
                        return false;
                    }
                },
                error: ()=>{
                    return false;
                }
            });
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
                debugger;
                if(response.length==0){
                    return null;
                }
                for(let i=0; i<response.length; i++){
                    if(instanceExists(response[i])){
                        instances[response[i].id] = response[i];
                    }
                }
            }
        });
        
        return instances;
    }
    
    debugger;
    
    let flight_number = $('#flight-number-input').val();
    if(flight_number!=''){
        filter_object['number'] = flight_number;
    }
    
    let dep_airport = $('#departure-airport-input').val();
    if(dep_airport!=''){
        dep_a_id = getAirportId(dep_airport);
        if(dep_a_id == -1){
            $('#flight-search-msg').append('Departure airport not found. Please enter a new departure airport and try again.<br>');
            missing_param = true;
        }
        filter_object['departure_id'] = dep_a_id;
    }else{
        missing_param = true;
        $('#flight-search-msg').append('Please enter a departure airport and try again.<br>');
    }
    
    let arr_airport = $('#arrival-airport-input').val();
    if(arr_airport!=''){
        arr_a_id = getAirportId(arr_airport);
        if(arr_a_id==-1){
            $('#flight-search-msg').append('Arrival airport not found. Please enter a new arrival airport and try again.<br>');
            missing_param = true;
        }
        filter_object['arrival_id'] = arr_a_id;
    }else{
        $('#flight-search-msg').append('Please enter an arrival airport and try again.<br>');
        missing_param = true;
    }
        
    dep_date = $('#departure-date-input').val();
    
    if(dep_date == ''){
        $('#flight-search-msg').append('Please enter a date and try again.<br>');
        missing_param = true;
    }
    
    if(missing_param){
        return;
    }
    
    debugger;
    flights = getInstances(filter_object, dep_date)
    
    debugger;
}

function buildReviewSelectorInterface(username){
    let $body = $('body');
    $body.empty();
    
    appendNavBar($body, username);
    
    appendSelectorForm($body);
}

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
        },
        error: ()=>{
            alert('error');
        }
    });
}

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
             buildReviewSelectorInterface(user);
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
        debugger;
        login(user_id, pass);
    });
    
    $(document).on('click', '.create', function new_user(){
        let user_id = $('#modal_username').val();
        let pass = $('#modal_password').val();
        create_user(user_id, pass);
    });

});