import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { key } from "../../App";
import { useNavigate } from "react-router-dom";

const Helper = () => {
    // const navigate = useNavigate()
    // const getToken = () => {
    //     const token = secureLocalStorage.getItem(key);
    //     return typeof token === "string" ? token : null;
    //   };
    
    //   const decodeToken = () => {
    //     const token = getToken();
    //     if (token) {
    //       try {
    //         const decodedToken: any = jwtDecode(token);
    //         const userId: number = parseInt(decodedToken?.unique_name, 10);
    //         const currentTime = Math.floor(Date.now() / 1000);
    //         // if (decodedToken.exp < currentTime) {
    //         //   toast.error("Your session has expired. Please log in again.");
    //         //   navigate("/homepage");
    //         //   return null;
    //         // }
    //         return userId;
    //       } catch (error) {
    //         toast.error("Failed to decode token.");
    //         return null;
    //       }
    //     }
    //     return null;
    //   };
    // const userId = decodeToken;
    return ( <div>
        
    </div> );
}
 
export default Helper;