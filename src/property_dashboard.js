import { fetch_current_user_email, sign_out_user } from "./lib/admin";
import { add_new_unit, delete_unit, display_unit_table ,load_unit_page} from "./lib/property";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  console.log("loaded maite")
  fetch_current_user_email()

  display_unit_table()




  // signout event listener
  document.getElementById("signout_button").addEventListener('click',
    function (event) {
      sign_out_user()
      event.preventDefault();

    }

  )


  // add new user event listener
  document.getElementById("new_unit_button").addEventListener('click',
    function (event) {

      add_new_unit()

      event.preventDefault();

    }
  )

  // add confirm event listener
  document.getElementById("remove_unit_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let name = document.getElementById("remove_unit_confirm_button").dataset.name
      delete_unit(name)

      event.preventDefault();

    }
  )

    // add confirm event listener
    document.getElementById("view_unit_confirm_button").addEventListener('click',
    function (event) {

      console.log("click")
      let name = document.getElementById("view_unit_confirm_button").dataset.name
      load_unit_page(name)

      event.preventDefault();

    }
  )

};


