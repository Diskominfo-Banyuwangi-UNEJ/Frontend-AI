import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/auth-context";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "@/contexts/auth-context";

// export default function ProtectedRoute({ children }) {
//     // const { isAuthenticated, isLoading } = useContext(AuthContext);

//     // if (isLoading) {
//     //     return <div>Loading...</div>;
//     // }

//     // Return children if not using ProtectedRoute
//     return children;

//     // Uncomment the next line to enable redirect for non-authenticated users
//     // return isAuthenticated ? children : <Navigate to="/" />;
// }
