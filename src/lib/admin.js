// fetch email 

import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, updateDoc } from "firebase/firestore"
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

            create_new_user(new_user_inputs)

            event.preventDefault();

        })



}

const display_new_user_form = () => {
    let container = document.getElementById("form_container")
    let template = document.getElementById("form_template")


    const add_new_user_form = template.content.firstElementChild.cloneNode(true)
    let btn = add_new_user_form.querySelector("#form_dismiss")
    btn.addEventListener("click",()=>{
        document.getElementById("form_container").innerHTML = ""
    })

    container.appendChild(add_new_user_form)

}

const read_new_user_form_input = (name_input_tag_id, email_input_tag_id, password_input_tag_id) => {
    let new_user_inputs = []
    new_user_inputs[0] = document.getElementById(name_input_tag_id).value
    new_user_inputs[1] = document.getElementById(email_input_tag_id).value
    new_user_inputs[2] = document.getElementById(password_input_tag_id).value

    return new_user_inputs
}


const create_new_user = (new_user_inputs) => {
    var config = firebaseConfig
    const secondaryApp = initializeApp(config, "secondary")
    const secondary_Auth = getAuth(secondaryApp)

    createUserWithEmailAndPassword(secondary_Auth, new_user_inputs[1], new_user_inputs[2])
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            conceal_add_user_form()
            create_user_collection(new_user_inputs[1], new_user_inputs[0], "landlord")
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
                alert("success_alert","successfully created new user")
                reload_users_table()
            }
        
        )
}

import { doc, setDoc } from "firebase/firestore";

const create_user_collection = async (user_email, user_name, access_level) => {
    const db = getFirestore(app)

    await setDoc(doc(db, "users", user_email), {
        access_level: access_level,
        account_status: "activated",
        name: user_name
    })


}


const conceal_add_user_form = () => {
    let form_container = document.getElementById("form_container")
    form_container.innerHTML = ""

}




const display_users_table = () => {

    create_table()




}



/**
* Easy selector helper function
*/
const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}




const initialize_datables = () => {


    const myTable = document.getElementById("myTable");
    const dataTable = new DataTable(myTable);


    dataTable.on('datatable.init', function (){
        var buttons = document.querySelectorAll('button')

        console.log(buttons)
        

        buttons.forEach(
            (button,index)=>{
                if(index === 0 || index === buttons.length-1 || button.textContent === "Close" ) return;
                button.addEventListener("click",
                    ()=>{
                        console.log(button.id)
                        let confirm_button = document.getElementById("remove_user_confirm_button")
                        confirm_button.dataset.email = button.id
                    }
                )
            }
        )
      })

    



}

const create_table = () => {



    //create table
    let table_container = document.getElementById("table_container")
    let table_template = document.getElementById("table_template")


    const users_table = table_template.content.firstElementChild.cloneNode(true)
    table_container.appendChild(users_table)

    fetch_table_data()


}

const add_rows_to_table = (user_email, user_name) => {
    //add rows to table
    let table_row_container = document.getElementById("table_row_container")
    let table_row_template = document.getElementById("table_row_template")


    const user_data = table_row_template.content.firstElementChild.cloneNode(true)
    let td = user_data.querySelectorAll("td")


    td[0].textContent = user_name
    td[1].textContent = user_email
   
    let button = user_data.querySelectorAll("button")
    button[0].id = user_email


    table_row_container.appendChild(user_data)



}


import { collection, query, where, getDocs } from "firebase/firestore";
import { DataTable } from "simple-datatables";


const fetch_table_data = async () => {
    const db = getFirestore(app)


    const q = query(
        collection(db, "users"),
        where("access_level", "==", "landlord"),
        where("account_status","==","activated")

    )

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data())
        add_rows_to_table(doc.id, doc.data().name)

    })



    initialize_datables()

}

//import { doc, updateDoc } from "firebase/firestore";

//const washingtonRef = doc(db, "cities", "DC");

// Set the "capital" field of the city 'DC'
//await updateDoc(washingtonRef, {
  //capital: true
//});

const conceal_modal = () =>{
    let modal = document.getElementById("remove_user_modal")
    modal.classList.remove("show")
    modal.style.display = "none"

    let modal_backdrop = document.querySelector(".modal-backdrop")
    modal_backdrop.classList.remove("show")
    modal_backdrop.style.display = "none"
}

const delete_user_account = async(email) => {
    console.log("delete user")

    const db = getFirestore(app)
    const statusRef = doc(db,"users",email)

    await updateDoc(statusRef, {
        account_status: "deactivated"
        
    })
    conceal_modal()
    alert("success_alert","successfully deactivated user")
    reload_users_table()

}

const reload_users_table = () =>{
    let table = document.getElementById("table_container")
    table.innerHTML = " "
    display_users_table()
}

const alert = (alert_id, alert_content) => {
    let alert_container = document.getElementById("alert_container")
    let alert_template = document.getElementById(alert_id)

    

    let new_alert = alert_template.content.firstElementChild.cloneNode(true);

    let p = new_alert.querySelector("p")
    p.textContent = alert_content


    alert_container.appendChild(new_alert)
}


export {
    fetch_current_user_email,
    sign_out_user,
    add_new_user,
    read_new_user_form_input,
    display_users_table,
    delete_user_account
}
