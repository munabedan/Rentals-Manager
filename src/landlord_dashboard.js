import { fetch_current_user_email, sign_out_user } from "./lib/admin";
import { add_new_property, delete_property, display_property_table, load_property_page } from "./lib/landlord";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  console.log("loaded maite")
  //log session storage
  console.log(sessionStorage)

  fetch_current_user_email()

  display_property_table()




  // signout event listener
  document.getElementById("signout_button").addEventListener('click',
    function (event) {
      sign_out_user()
      event.preventDefault();

    }

  )


  // add new user event listener
  document.getElementById("new_property_button").addEventListener('click',
    function (event) {

      add_new_property()

      event.preventDefault();

    }
  )

  // add confirm event listener
  document.getElementById("remove_property_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let name = document.getElementById("remove_property_confirm_button").dataset.name
      delete_property(name)

      event.preventDefault();

    }
  )

 


};


