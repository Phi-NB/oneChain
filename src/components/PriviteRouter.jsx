import Login from "../views/Login/Login.jsx";
import { useCookies } from "react-cookie";

function PrivateRouter({ children }) {
    const [cookieUser, setCookieUser] = useCookies(["user"]);

    if (cookieUser.user !== "") {
        return children;
    } else {
        return <Login />;
    }
}

export default PrivateRouter;
