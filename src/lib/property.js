
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc, addDoc } from "firebase/firestore";
import { DataTable } from "simple-datatables";
import { app, firebaseConfig } from "./firebase_config";

const initialize_datables = () => {


    const myTable = document.getElementById("myTable");
    const dataTable = new DataTable(myTable);


    dataTable.on('datatable.init', function () {
        var buttons = document.querySelectorAll('button')

        console.log(buttons)




        buttons.forEach(
            (button, index) => {


                document.getElementById("remove_unit_confirm_button").dataset.name = button.dataset.unitID


            }
        )

        let view_buttons = document.querySelectorAll(".view-btn")


        console.log("view_buttons:", view_buttons)

        view_buttons.forEach(
            (button, index) => {

                button.addEventListener("click", () => {
                    console.log("view button clicked")
                    load_unit_page(button.dataset.unit_id)
                })



            }
        )
    })





}

const add_rows_to_table = (data, unitID) => {
    //add rows to table
    let table_row_container = document.getElementById("table_row_container")
    let table_row_template = document.getElementById("table_row_template")


    const property_data = table_row_template.content.firstElementChild.cloneNode(true)
    let td = property_data.querySelectorAll("td")


    td[0].textContent = data.Number
    td[1].textContent = data.Status
    td[2].textContent = data.Type
    td[3].textContent = data.Price


    let button = property_data.querySelectorAll("button")
    button[0].dataset.unit_id = unitID
    button[1].dataset.unit_id = unitID




    table_row_container.appendChild(property_data)



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
        // Get saved data from sessionStorage
        let propertyName = sessionStorage.getItem('property');

        const querySnapshot = await getDocs(collection(db, "users", user_email, "properties", propertyName, "units"));

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let data = doc.data()
            console.log(data);
            add_rows_to_table(data, doc.id)
        });
        initialize_datables()

    }


}

const create_table = () => {



    //create table
    let table_container = document.getElementById("table_container")
    let table_template = document.getElementById("table_template")


    const unit_table = table_template.content.firstElementChild.cloneNode(true)
    table_container.appendChild(unit_table)

    fetch_table_data()


}


const display_unit_table = () => {

    create_table()

}

const display_new_unit_form = () => {
    let container = document.getElementById("form_container")
    let template = document.getElementById("form_template")


    const add_new_unit_form = template.content.firstElementChild.cloneNode(true)
    let btn = add_new_unit_form.querySelector("#form_dismiss")
    btn.addEventListener("click", () => {
        document.getElementById("form_container").innerHTML = ""
    })

    container.appendChild(add_new_unit_form)

}

const read_new_unit_form_input = (
    number_input_tag_id,
    status_input_tag_id,
    type_input_tag_id,
    price_input_tag_id






) => {
    let new_unit_inputs = []
    new_unit_inputs[0] = document.getElementById(number_input_tag_id).value
    new_unit_inputs[1] = document.getElementById(status_input_tag_id).value
    new_unit_inputs[2] = document.getElementById(type_input_tag_id).value
    new_unit_inputs[3] = document.getElementById(price_input_tag_id).value



    return new_unit_inputs
}

const conceal_add_unit_form = () => {
    let form_container = document.getElementById("form_container")
    form_container.innerHTML = ""

}


const reload_unit_table = () => {
    let table = document.getElementById("table_container")
    table.innerHTML = " "
    display_unit_table()
}

const create_new_unit = async (new_units_inputs) => {
    let config = firebaseConfig

    const db = getFirestore(app)

    let user_email = document.getElementById("user_profile").textContent
    console.log(user_email)

    // Get saved data from sessionStorage
    let propertyName = sessionStorage.getItem('property');

    console.log(propertyName)

    await addDoc(collection(db, "users", user_email, "properties", propertyName, "units"), {
        Number: new_units_inputs[0],
        Status: new_units_inputs[1],
        Type: new_units_inputs[2],
        Price: new_units_inputs[3]
    });

    //const newPropertyRef =doc(db,"users", user_email,new_property_inputs[0] )
    /*const newUnitRef = doc(db, "users", user_email, "properties", propertyName, "units", new_units_inputs[0])

    await setDoc(newUnitRef, {
        Number: new_units_inputs[0],
        Status: new_units_inputs[1],
        Type: new_units_inputs[2],
        Price: new_units_inputs[3]

    })*/

}

const alert = (alert_id, alert_content) => {
    let alert_container = document.getElementById("alert_container")
    let alert_template = document.getElementById(alert_id)



    let new_alert = alert_template.content.firstElementChild.cloneNode(true);

    let p = new_alert.querySelector("p")
    p.textContent = alert_content


    alert_container.appendChild(new_alert)
}

const add_new_unit = () => {
    //display form
    display_new_unit_form()


    //add submit event listener
    document.getElementById("add_new_unit_confirm_button").addEventListener('click',
        function (event) {
            // create new user
            let new_unit_inputs = read_new_unit_form_input(
                "unitNumber",
                "unitStatus",
                "unitType",
                "unitPrice"
            )

            //create_new_user(new_user_inputs)
            create_new_unit(new_unit_inputs).then(
                conceal_add_unit_form(),
                alert("success_alert", "successfully created new unit"),
                reload_unit_table()
            )

            event.preventDefault();

        })



}

const conceal_modal = () => {
    let modal = document.getElementById("remove_unit_modal")
    modal.classList.remove("show")
    modal.style.display = "none"

    let modal_backdrop = document.querySelector(".modal-backdrop")
    modal_backdrop.classList.remove("show")
    modal_backdrop.style.display = "none"
}

const reload_units_table = () => {
    let table = document.getElementById("table_container")
    table.innerHTML = " "
    display_unit_table()
}

const delete_unit = async (name) => {

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

        // Get saved data from sessionStorage
        let propertyName = sessionStorage.getItem('property');

        const propertyRef = doc(db, "users", user_email, "properties", propertyName, "units", name)

        await deleteDoc(propertyRef)
    }

    conceal_modal()
    alert("success_alert", "successfully removed  property")
    reload_units_table()

}

const load_unit_page = (name) => {

    let unit_Url = "landlord_unit.html"

    // Save data to sessionStorage
    sessionStorage.setItem('unit', name);
    window.open(unit_Url, "_self")


}
export {
    add_new_unit,
    display_unit_table,
    delete_unit,
    load_unit_page
}

