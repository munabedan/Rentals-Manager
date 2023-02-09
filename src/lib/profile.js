
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc, addDoc } from "firebase/firestore";
import { DataTable } from "simple-datatables";
import { app, firebaseConfig } from "./firebase_config";



const add_data_to_card = (data, paymentID) => {
    console.log("profile_data:", data)
    //add rows to table
    let profile_card = document.getElementById("profile-overview")

    profile_card.querySelector(".tenantName").textContent = data.Name
    profile_card.querySelector(".tenantCompany").textContent = data.Company
    profile_card.querySelector(".tenantJob").textContent = data.Job
    profile_card.querySelector(".tenantCountry").textContent = data.Country
    profile_card.querySelector(".tenantAddress").textContent = data.Address
    profile_card.querySelector(".tenantPhone").textContent = data.Phone
    profile_card.querySelector(".tenantEmail").textContent = data.Email


    let edit_profile = document.getElementById("profile-edit")
    edit_profile.querySelector(".tenantName").value = data.Name
    edit_profile.querySelector(".tenantCompany").value = data.Company
    edit_profile.querySelector(".tenantJob").value = data.Job
    edit_profile.querySelector(".tenantCountry").value = data.Country
    edit_profile.querySelector(".tenantAddress").value = data.Address
    edit_profile.querySelector(".tenantPhone").value = data.Phone
    edit_profile.querySelector(".tenantEmail").value = data.Email





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

        const querySnapshot = await getDocs(collection(db, "users", user_email, "properties", propertyName, "units", unitNumber, "profiles"));

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let data = doc.data()
            console.log(data);
            add_data_to_card(data, doc.id)
        });
        //initialize_datables()

    }


}

const display_profile_card = () => {

    fetch_table_data()


}


const read_new_profile_form_input = () => {
    let new_profile_inputs = []
    let edit_profile = document.getElementById("profile-edit")
    new_profile_inputs[0] = edit_profile.querySelector(".tenantName").value
    new_profile_inputs[1] = edit_profile.querySelector(".tenantCompany").value
    new_profile_inputs[2] = edit_profile.querySelector(".tenantJob").value
    new_profile_inputs[3] = edit_profile.querySelector(".tenantCountry").value
    new_profile_inputs[4] = edit_profile.querySelector(".tenantAddress").value
    new_profile_inputs[5] = edit_profile.querySelector(".tenantPhone").value
    new_profile_inputs[6] = edit_profile.querySelector(".tenantEmail").value


    
    return new_profile_inputs

}




const reload_profile_card = () => {
    display_profile_card()

}

const create_new_profile = async (new_profile_inputs) => {
    let config = firebaseConfig

    const db = getFirestore(app)

    let user_email = document.getElementById("user_profile").textContent
    console.log(user_email)

    // Get saved data from sessionStorage
    let unitNumber = sessionStorage.getItem('unit');
    let propertyName = sessionStorage.getItem('property');

    await addDoc(collection(db, "users", user_email, "properties", propertyName, "units", unitNumber, "profiles"), {
        Name: new_profile_inputs[0],
        Company: new_profile_inputs[1],
        Job: new_profile_inputs[2],
        Country: new_profile_inputs[3],
        Address: new_profile_inputs[4],
        Phone: new_profile_inputs[5],
        Email: new_profile_inputs[6]

    });



}

const alert = (alert_id, alert_content) => {
    let alert_container = document.getElementById("alert_container")
    let alert_template = document.getElementById(alert_id)



    let new_alert = alert_template.content.firstElementChild.cloneNode(true);

    let p = new_alert.querySelector("p")
    p.textContent = alert_content


    alert_container.appendChild(new_alert)
}

const add_new_profile = () => {
    //display form



    // create new user
    let new_profile_inputs = read_new_profile_form_input()

    //create_new_user(new_user_inputs)
    create_new_profile(new_profile_inputs).then(

        alert("success_alert", "successfully created new profile"),
        reload_profile_card()
    )




}

const conceal_modal = () => {
    let modal = document.getElementById("remove_payment_modal")
    modal.classList.remove("show")
    modal.style.display = "none"

    let modal_backdrop = document.querySelector(".modal-backdrop")
    modal_backdrop.classList.remove("show")
    modal_backdrop.style.display = "none"
}


const delete_payment = async (name) => {

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
        let unitNumber = sessionStorage.getItem('unit');
        let propertyName = sessionStorage.getItem('property');
        console.log("PaymentName", name)

        const paymentRef = doc(db, "users", user_email, "properties", propertyName, "units", unitNumber, "payments", name)

        await deleteDoc(paymentRef)
    }

    conceal_modal()
    alert("success_alert", "successfully removed  property")
    reload_payment_table()

}

const load_payment_page = (name) => {
    console.log(name)
    let property_Url = "landlord_unit.html"

    // Save data to sessionStorage
    sessionStorage.setItem('unit', name);
    window.location.replace(property_Url)

}

export {
    add_new_profile,
    display_profile_card,
    delete_payment,
    load_payment_page
}

