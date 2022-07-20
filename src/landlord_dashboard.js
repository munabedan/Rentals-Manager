import {  fetch_current_user_email, sign_out_user } from "./lib/admin";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  console.log("loaded maite")

  // signout event listener
  document.getElementById("signout_button").addEventListener('click',
    function (event) {
        sign_out_user()
      event.preventDefault();

    }

  )

    
 
  fetch_current_user_email()
};


