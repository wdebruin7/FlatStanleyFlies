var root_url = "http://comp426.cs.unc.edu:3001/";

function create_user (user, password){
     $.ajax(root_url + 'users',
    {
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
             buildSelectorInterface(user);
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