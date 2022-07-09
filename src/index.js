import {read_login_form_input, authenticate_user} from "./lib/login";


//navigate to dashboard

document.addEventListener('DOMContentLoaded', init, false);

function init(){
  console.log("loaded maite")

  document.getElementById("login_form").addEventListener('submit',

    function(event){

      let authentication_details = read_login_form_input("yourEmail","yourPassword")
      authenticate_user(authentication_details[0],authentication_details[1])
      event.preventDefault();
      
    }

  )
};
