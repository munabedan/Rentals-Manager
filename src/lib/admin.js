// fetch email 

import {getAuth, onAuthStateChanged} from "firebase/auth"
import {app } from "./firebase_config"

const fetch_current_user_email = () =>{
    const auth = getAuth(app);

    onAuthStateChanged(
        auth,
        (user) => {
            if (user) {
                //user is signed in
                const email = user.email;
                
                display_user_email(email)
            } else {
                //user is signed out
            }
        }
        
    )
    
}

// display user email
const display_user_email = (user_email) => {
    let user_profile = document.getElementById("user_profile")
    user_profile.textContent = user_email

}

export {
    fetch_current_user_email,
}
