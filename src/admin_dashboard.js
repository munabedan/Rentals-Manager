import { add_new_user, delete_user_account, display_users_table, fetch_current_user_email, sign_out_user } from "./lib/admin";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  console.log("loaded maite")

  display_users_table()

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


    // add confirm event listener
    document.getElementById("remove_user_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let email = document.getElementById("remove_user_confirm_button").dataset.email
      delete_user_account(email)

      event.preventDefault();

    }
  )

 
  fetch_current_user_email()
};


