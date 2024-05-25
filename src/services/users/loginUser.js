import axios from "axios";
import { LOGIN_ENDPOINT } from "../../constants/urls";


export function loginUser(email, password){
 return new Promise((resolve, reject) => {
    const header = {
        headers: {
          'Content-type': 'application/json',
        },
      };

    axios
    .post(
        `${LOGIN_ENDPOINT}`, {
            email: email,
        password: password
        }
    
    )
    .then((response) => {

        console.log(response)
        resolve(response.data);

    })
    .catch(error => {

      reject(error);

    });


 })}
