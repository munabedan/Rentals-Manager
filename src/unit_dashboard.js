import { fetch_current_user_email, sign_out_user } from "./lib/admin";
import { add_new_payment, delete_payment, display_payment_table ,load_payment_page} from "./lib/unit";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  console.log("loaded maite")

  //log session storage
  console.log(sessionStorage)

  fetch_current_user_email()

  display_payment_table()




  // sign out event listener
  document.getElementById("signout_button").addEventListener('click',
    function (event) {
      sign_out_user()
      event.preventDefault();

    }

  )


  // add new user event listener
  document.getElementById("new_payment_button").addEventListener('click',
    function (event) {

      add_new_payment()

      event.preventDefault();

    }
  )

  // add confirm event listener
  document.getElementById("remove_payment_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let name = document.getElementById("remove_payment_confirm_button").dataset.name
      delete_payment(name)

      event.preventDefault();

    }
  )

    // add confirm event listener
   /* document.getElementById("view_unit_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let name = document.getElementById("view_unit_confirm_button").dataset.name
      load_unit_page(name)

      event.preventDefault();

    }
  )*/

};


