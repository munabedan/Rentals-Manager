import { fetch_current_user_email, sign_out_user } from "./lib/admin";
import { add_new_profile, display_profile_card } from "./lib/profile";
import { add_new_payment, delete_payment, display_payment_table, load_payment_page } from "./lib/tenant";



//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init() {
    console.log("loaded maite")

    //log session storage
    console.log(sessionStorage)

    fetch_current_user_email()

    display_profile_card()


    display_payment_table()


    // sign out event listener
    document.getElementById("signout_button").addEventListener('click',
        function (event) {
            sign_out_user()
            event.preventDefault();

        }

    )



};


