import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateUserRouter({ children }) {
	const { isAdmin } = useSelector((state) => state.auth);
	return isAdmin ? <Navigate to='/404' /> : children;
}
