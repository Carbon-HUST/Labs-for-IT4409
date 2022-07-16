import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Dropdown.style.scss";
import { logout } from "../../Slices/auth";

export default function Dropdown() {
	const dispatch = useDispatch();
	const handleSignOut = () => {
		dispatch(logout());
	};
	return (
		<div className='sub-dropdown' id='sub-dropdown-user'>
			<div className='card'>
				<div className='card-body'>
					<div className='card-header'>
						<h5>Hello Barry Tech</h5>
						<span>Available </span>
					</div>
					<a href='#javascript' className='sub-card'>
						<div className='media'>
							<div className='media-icon'>
								<i className='fa-solid fa-id-badge' />
							</div>
							<div className='media-body'>
								<h6>My Profile</h6>
								<p>View personal profile details.</p>
							</div>
						</div>
					</a>
					<div className='card-action-signout'>
						<Link to={""} id='btn-sign-out' onClick={handleSignOut}>
							Sign out
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
