// Read email and password from login form

const read_login_form_input = (email_input_tag_id, password_input_tag_id) => {

    let login_inputs = []

    login_inputs[0] = document.getElementById(email_input_tag_id).value
    login_inputs[1] = document.getElementById(password_input_tag_id).value

    return login_inputs
}

// Authenticate user
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase_config"

const authenticate_user = (email, password) => {

    const auth = getAuth(app)

    signInWithEmailAndPassword(auth, email, password)
        .then(
            (userCredential) => {

                check_user_permissions(email)

            }
        )
        .catch(
            (error) => {
                return error
            }
        )

}


//check email permissions




import { getFirestore, getDoc ,doc} from 'firebase/firestore/lite';

const check_user_permissions = async (email) => {
    const db = getFirestore(app)

    const docRef = doc(db, "users", email);
    

    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
         load_home_page(docSnap.data().access_level)

        
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

}


// load relevant page


const load_home_page = (access_level) => {
    console.log(access_level)
    if (access_level === "landlord"){
        //window.location.replace("dashboard_landlord.html")
    }
    else if (access_level == "admin"){
        //window.location.replace("admin_dashboard.html")
    }
    else if (access_level === "tenant") {
        //window.location.replace("dashboard_tenant.html")
    }



}


export {
    read_login_form_input,
    authenticate_user,
    
}

