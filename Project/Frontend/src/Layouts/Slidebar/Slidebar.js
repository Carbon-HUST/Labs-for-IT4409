import React from "react";
import { Link } from "react-router-dom";
import "./Slidebar.style.scss";
const handleSidebarOnclick = (e) => {
	let app = document.getElementsByTagName("body")[0];
	if (app) {
		app.classList.toggle("sidebar-main");
	}
};

export default function Slidebar() {
	return (
		<div className='sidebar' id='sidebar'>
			<div className='sidebar-logo'>
				<Link to={"/"} className='header-logo'>
					<img src={window.location.origin + "/images/logo.png"} alt='' />
					<div className='logo-title'>
						<span>Bookstore</span>
					</div>
				</Link>
				<div
					className='btn-sidebar'
					id='btn-sidebar'
					onClick={handleSidebarOnclick}
				>
					<i className='fa-solid fa-bars' />
				</div>
			</div>
			<div className='sidebar-scrollbar'>
				<div className='scroll-content'>
					<nav className='sidebar-menu'>
						<ul className='sidebar-toggle'>
							<li>
								<a href='#javascript'>
									<i className='fa-solid fa-house' />
									<span>Shop</span>
									<i className='fa-solid fa-angle-right' />
								</a>
							</li>
							<li>
								<a href='#javascript'>
									<i className='fa-solid fa-user' />
									<span>User</span>
									<i className='fa-solid fa-angle-right' />
								</a>
							</li>
						</ul>
					</nav>
					<div className='sidebar-bottom'>
						<div className='image'>
							<img
								src={window.location.origin + "/images/img-bookshop.jpg"}
								alt=''
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
