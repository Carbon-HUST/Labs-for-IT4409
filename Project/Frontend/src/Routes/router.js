import { Navigate, useRoutes } from "react-router-dom";
import Auth from "../Pages/Auth/Auth";
import Homepage from "../Pages/Home/Homepage";
import Page404 from "../Pages/Page404/Page404";
import LoginForm from "../sections/auth/LoginForm";
import RegisterForm from "../sections/auth/RegisterForm";
import Cart from "../Pages/Cart/Cart";

export default function Router() {
	return useRoutes([
		{
			path: "/",
			element: <Homepage />,
			children: [{ path: "*", element: <Navigate to='/404' /> }],
		},
		{
			path: "/auth",
			element: <Auth />,
			children: [
				{ path: "login", element: <LoginForm /> },
				{ path: "register", element: <RegisterForm /> },
				{ path: "*", element: <Navigate to='/404' /> },
			],
		},
		{
			path: "/404",
			element: <Page404 />,
		},
		{
			path: "/cart", 
			element: <Cart />,
			children: [
				{ path: "*", element: <Navigate to='/404' /> }
			],
		},
		{ path: "*", element: <Navigate to='/404' replace /> },
	]);
}
