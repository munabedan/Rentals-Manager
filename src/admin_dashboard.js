import { add_new_user, fetch_current_user_email, read_new_user_form_input, sign_out_user } from "./lib/admin";


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

    // add new user event listener
    document.getElementById("new_user_button").addEventListener('click',
    function (event) {

      add_new_user()

      event.preventDefault();

    }

  )
  fetch_current_user_email()
};


