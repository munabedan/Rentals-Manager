
// add user

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { DataTable } from "simple-datatables";
import { app, firebaseConfig } from "./firebase_config";

const add_new_property = () => {
    //display form
    display_new_property_form()


    //add submit event listener
    document.getElementById("add_new_property_confirm_button").addEventListener('click',
        function (event) {
            // create new user
            let new_property_inputs = read_new_property_form_input(
                "propertyName",
                "propertyType",
                "propertyUnits",
                "propertyOwner",
                "propertyAccount",
                "propertyAddress",
                "propertyCity",
                "propertyZip"
            )

            //create_new_user(new_user_inputs)
            create_new_property(new_property_inputs).then(
                conceal_add_property_form(),
                alert("success_alert", "successfully created new property"),
                reload_properties_table()
            )

            event.preventDefault();

        })



}

const display_new_property_form = () => {
    let container = document.getElementById("form_container")
    let template = document.getElementById("form_template")


    const add_new_property_form = template.content.firstElementChild.cloneNode(true)
    let btn = add_new_property_form.querySelector("#form_dismiss")
    btn.addEventListener("click", () => {
        document.getElementById("form_container").innerHTML = ""
    })

    container.appendChild(add_new_property_form)

}

const read_new_property_form_input = (
    name_input_tag_id,
    type_input_tag_id,
    units_input_tag_id,
    owner_input_tag_id,
    account_input_tag_id,
    street_input_tag_id,
    city_input_tag_id,
    zip_input_tag_id





) => {
    let new_property_inputs = []
    new_property_inputs[0] = document.getElementById(name_input_tag_id).value
    new_property_inputs[1] = document.getElementById(type_input_tag_id).value
    new_property_inputs[2] = document.getElementById(units_input_tag_id).value
    new_property_inputs[3] = document.getElementById(owner_input_tag_id).value
    new_property_inputs[4] = document.getElementById(account_input_tag_id).value
    new_property_inputs[5] = document.getElementById(street_input_tag_id).value
    new_property_inputs[6] = document.getElementById(city_input_tag_id).value
    new_property_inputs[7] = document.getElementById(zip_input_tag_id).value



    return new_property_inputs
}

const create_new_property = async (new_property_inputs) => {
    let config = firebaseConfig

    const db = getFirestore(app)

    let user_email = document.getElementById("user_profile").textContent
    console.log(user_email)



    //const newPropertyRef =doc(db,"users", user_email,new_property_inputs[0] )
    const newPropertyRef = doc(db, "users", user_email, "properties", new_property_inputs[0])

    await setDoc(newPropertyRef, {
        Name: new_property_inputs[0],
        Type: new_property_inputs[1],
        Units: new_property_inputs[2],
        Owner: new_property_inputs[3],
        Account: new_property_inputs[4],
        Address: new_property_inputs[5],
        City: new_property_inputs[6],
        Zip: new_property_inputs[7]
    })

}

const conceal_add_property_form = () => {
    let form_container = document.getElementById("form_container")
    form_container.innerHTML = ""

}

const display_property_table = () => {

    create_table()

}

const create_table = () => {



    //create table
    let table_container = document.getElementById("table_container")
    let table_template = document.getElementById("table_template")


    const property_table = table_template.content.firstElementChild.cloneNode(true)
    table_container.appendChild(property_table)

    fetch_table_data()


}

const fetch_table_data = async () => {
    const db = getFirestore(app)


    const auth = getAuth(app)

    onAuthStateChanged(
        auth,
        (user) => {
            if (user) {
                //user is signed in
                let user_email = user.email;
                console.log(user_email)
                queryData(user_email)
            } else {
                //user is signed out
            }

        }
    )

    const queryData = async (user_email) => {
        console.log(user_email)

        const querySnapshot = await getDocs(collection(db, "users", user_email, "properties"));

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let data = doc.data()
            console.log(data);
            add_rows_to_table(data)
        });
        initialize_datables()

    }


}

const add_rows_to_table = (data) => {
    //add rows to table
    let table_row_container = document.getElementById("table_row_container")
    let table_row_template = document.getElementById("table_row_template")


    const property_data = table_row_template.content.firstElementChild.cloneNode(true)
    let td = property_data.querySelectorAll("td")


    td[0].textContent = data.Name
    td[1].textContent = data.Type
    td[2].textContent = data.Units
    td[3].textContent = data.Owner
    td[4].textContent = data.Account
    td[5].textContent = data.Address
    td[6].textContent = data.City
    td[7].textContent = data.Zip

    let button = property_data.querySelectorAll("button")
    button[0].id = data.Name
    button[1].id = data.Name

    



    table_row_container.appendChild(property_data)



}

const initialize_datables = () => {


    const myTable = document.getElementById("myTable");
    const dataTable = new DataTable(myTable);


    dataTable.on('datatable.init', function () {
        var buttons = document.querySelectorAll('button')

        console.log(buttons)


        buttons.forEach(
            (button, index) => {
                if (index === 0 || index === buttons.length - 1 || button.textContent === "Close") return;
                button.addEventListener("click",
                    () => {
                        console.log(button.id)

                        document.getElementById("remove_property_confirm_button").dataset.name = button.id
                        document.getElementById("view_property_confirm_button").dataset.name = button.id
                        
                    }
                )
            }
        )
    })





}

const delete_property = async (name) => {

    const db = getFirestore(app)

    const auth = getAuth(app)

    onAuthStateChanged(
        auth,
        (user) => {
            if (user) {
                //user is signed in
                let user_email = user.email;
                console.log(user_email)
                delete_data(user_email)
            } else {
                //user is signed out
            }

        }
    )


    const delete_data = async (user_email) => {
        const propertyRef = doc(db, "users", user_email, "properties", name)

        await deleteDoc(propertyRef)
    }

    conceal_modal()
    alert("success_alert", "successfully removed  property")
    reload_properties_table()

}
const conceal_modal = () => {
    let modal = document.getElementById("remove_property_modal")
    modal.classList.remove("show")
    modal.style.display = "none"

    let modal_backdrop = document.querySelector(".modal-backdrop")
    modal_backdrop.classList.remove("show")
    modal_backdrop.style.display = "none"
}


const reload_properties_table = () => {
    let table = document.getElementById("table_container")
    table.innerHTML = " "
    display_property_table()
}

const alert = (alert_id, alert_content) => {
    let alert_container = document.getElementById("alert_container")
    let alert_template = document.getElementById(alert_id)



    let new_alert = alert_template.content.firstElementChild.cloneNode(true);

    let p = new_alert.querySelector("p")
    p.textContent = alert_content


    alert_container.appendChild(new_alert)
}


const load_property_page = (name) => {
    console.log(name)
    let property_Url = "landlord_property.html" 

    // Save data to sessionStorage
    sessionStorage.setItem('property', name);
    window.location.replace(property_Url)



}


export {
    add_new_property,
    display_property_table,
    delete_property,
    load_property_page
}