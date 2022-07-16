import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.style.scss";
import Dropdown from "../../Components/Dropdown/Dropdown";

const handleOnClickToggleMenu = () => {
	const app = document.getElementsByTagName("body")[0];
	if (app) {
		app.classList.toggle("sidebar-main");
	}
};
const handleOnClickNavbarToggle = (e) => {
	const collapse = document.getElementById("navbar-collapse");
	if (collapse) {
		collapse.classList.toggle("show");
	}
};

export default function Navbar() {
	const { isLoggedIn, profile } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const [show, isShow] = useState(false);
	const handleOnClickShowDropdown = (e) => {
		if (isLoggedIn) {
			isShow(!show);
		} else {
			navigate("/auth/login");
		}
	};
	return (
		<div className='top-navbar'>
			<nav className='navbar'>
				<div className='menu-btn'>
					<div
						className='wrapper-menu'
						id='wrapper-menu'
						onClick={handleOnClickToggleMenu}
					>
						<i className='fa-solid fa-bars' />
					</div>
					<div className='navbar-logo'>
						<a href='#javascript' className='header-logo'>
							<img src='./images/logo.png' alt='' />
							<div className='logo-title'>
								<span>Bookstore</span>
							</div>
						</a>
					</div>
				</div>
				<div className='navbar-breadcrumb'>
					<h5>Shop</h5>
					<nav aria-label='breadcrumb'>
						<ul className='breadcrumb'>
							<li className='breadcrumb-item'>
								<a href='#javascript'>Home</a>
							</li>
							<li className='breadcrumb-item active' aria-current='page'>
								<i className='fa-solid fa-angle-right' />
								Homepage
							</li>
							<li className='breadcrumb-item active' aria-current='page'>
								<i className='fa-solid fa-angle-right' />
								Homepage
							</li>
						</ul>
					</nav>
				</div>
				<div className='search-bar'>
					<form action='#' className='searchbox'>
						<input
							type='text'
							className='search-input'
							placeholder='Search Here ...'
						/>
						<a href='#javascript' className='search-link'>
							<i className='fa-solid fa-magnifying-glass' />
						</a>
					</form>
				</div>
				<button
					className='navbar-toggle'
					id='navbar-toggle'
					onClick={handleOnClickNavbarToggle}
				>
					<i className='fa-solid fa-bars-staggered' />
				</button>
				<div className='navbar-collapse' id='navbar-collapse'>
					<ul className='navbar-list'>
						<li className='nav-item nav-icon'>
							<a href='#javascript' className='search-toggle'>
								<span className='ripple rippleEffect' />
								<i className='fa-solid fa-bell' />
								<span className='dots' />
							</a>
							<div className='dropdown' />
						</li>
						<li className='nav-item nav-icon'>
							<a href='#javascript' className='search-toggle'>
								<span className='ripple rippleEffect' />
								<i className='fa-solid fa-envelope' />
								<span className='dots' />
							</a>
							<div className='dropdown' />
						</li>
						<li className='nav-item nav-icon'>
							<a href='#javascript' className='search-toggle'>
								<span className='ripple rippleEffect' />
								<i className='fa-solid fa-cart-shopping' />
								<span className='badge'>4</span>
							</a>
							<div className='dropdown' />
						</li>
						<li
							className={`nav-user ${show ? "is-show" : ""}`}
							id='btn-user'
							onClick={handleOnClickShowDropdown}
						>
							<Link to={""} id='waves-effect'>
								<span className='rippleEffect'></span>
								<img
									src={
										profile
											? profile.avatar ||
											  window.location.origin +
													"/images/user/avatar-default.png"
											: window.location.origin +
											  "/images/user/avatar-default.png"
									}
									alt=''
								/>
								<div className='caption'>
									<h6>{profile ? profile.name || "" : ""}</h6>
								</div>
							</Link>
							<Dropdown />
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
}
