import { fetch_current_user_email } from "./lib/admin";


//check if page has loaded
document.addEventListener('DOMContentLoaded', init, false);

function init(){
  console.log("loaded maite")

    fetch_current_user_email()
};


