// fetch email 

import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { app, firebaseConfig } from "./firebase_config"

const fetch_current_user_email = () => {
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

//sign out admin
const sign_out_user = () => {



    const auth = getAuth(app)
    signOut(auth).then(
        () => {
            //sign out successful
            window.location.replace("index.html")
        }
    ).catch(
        (error) => {
            //an error occured
        }
    )
}

// add user

const add_new_user = () => {
    //display form
    display_new_user_form()


    //add submit event listener
    document.getElementById("add_new_user_confirm_button").addEventListener('click',
        function (event) {
            // create new user
            let new_user_inputs = read_new_user_form_input("userName", "userEmail", "userPassword")

            create_new_user(new_user_inputs[1], new_user_inputs[2])

            event.preventDefault();

        })



}

const display_new_user_form = () => {
    let container = document.getElementById("form_container")
    let template = document.getElementById("form_template")


    const add_new_user_form = template.content.firstElementChild.cloneNode(true)
    container.appendChild(add_new_user_form)
    
}

const read_new_user_form_input = (name_input_tag_id, email_input_tag_id, password_input_tag_id) => {
    let new_user_inputs = []
    new_user_inputs[0] = document.getElementById(name_input_tag_id).value
    new_user_inputs[1] = document.getElementById(email_input_tag_id).value
    new_user_inputs[2] = document.getElementById(password_input_tag_id).value

    return new_user_inputs
}


const create_new_user = (email, password) => {
    var config = firebaseConfig
    console.log("load config")
    const secondaryApp = initializeApp(config, "secondary")
    console.log("initialize secondary config")
    const secondary_Auth = getAuth(secondaryApp)
    console.log("get auth")

    createUserWithEmailAndPassword(secondary_Auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            conceal_add_user_form()
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        }).finally(
            () => {
                signOut(secondary_Auth).then(
                    deleteApp(secondaryApp)
                )
            }
        )



}

const conceal_add_user_form = () =>{
    let form_container = document.getElementById("form_container")
    form_container.innerHTML= ""

}








export {
    fetch_current_user_email,
    sign_out_user,
    add_new_user,
    read_new_user_form_input
}
