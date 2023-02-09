
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
                if (index === 0 || index === buttons.length - 1 || button.textContent === "Close") return;
                button.addEventListener("click",
                    () => {

                        document.getElementById("remove_payment_confirm_button").dataset.name = button.id
                        document.getElementById("view_payment_confirm_button").dataset.name = button.id

                    }
                )
            }
        )
    })





}

const add_rows_to_table = (data, paymentID) => {
    //add rows to table
    let table_row_container = document.getElementById("table_row_container")
    let table_row_template = document.getElementById("table_row_template")


    const property_data = table_row_template.content.firstElementChild.cloneNode(true)
    let td = property_data.querySelectorAll("td")


    td[0].textContent = data.Name
    td[1].textContent = data.Amount
    td[2].textContent = data.Method
    td[3].textContent = data.Account
    td[4].textContent = data.Date
    td[5].textContent = data.Reference
    td[6].textContent = data.Period





    let button = property_data.querySelectorAll("button")
    button[0].id = paymentID
    button[0].id = paymentID



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
        let unitNumber = sessionStorage.getItem('unit');
        let propertyName = sessionStorage.getItem('property');

        const querySnapshot = await getDocs(collection(db, "users", user_email, "properties", propertyName, "units", unitNumber, "payments"));

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


    const payment_table = table_template.content.firstElementChild.cloneNode(true)
    table_container.appendChild(payment_table)

    fetch_table_data()


}


const display_payment_table = () => {

    create_table()

}



const reload_payment_table = () => {
    let table = document.getElementById("table_container")
    table.innerHTML = " "
    display_payment_table()
}


const alert = (alert_id, alert_content) => {
    let alert_container = document.getElementById("alert_container")
    let alert_template = document.getElementById(alert_id)



    let new_alert = alert_template.content.firstElementChild.cloneNode(true);

    let p = new_alert.querySelector("p")
    p.textContent = alert_content


    alert_container.appendChild(new_alert)
}


const load_payment_page = (name) => {
    console.log(name)
    let property_Url = "landlord_unit.html"

    // Save data to sessionStorage
    sessionStorage.setItem('unit', name);
    window.location.replace(property_Url)

}

export {
    add_new_payment,
    display_payment_table,
    delete_payment,
    load_payment_page
}

