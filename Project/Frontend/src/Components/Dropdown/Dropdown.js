import React, { useState } from "react";
import "./Dropdown.style.scss";

export default function Dropdown() {
	return (
		<div className='sub-dropdown' id='sub-dropdown-user'>
			<div className='card'>
				<div className='card-body'>
					<div className='card-header'>
						<h5>Hello Barry Tech</h5>
						<span>Available </span>
					</div>
					<a href className='sub-card'>
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
						<a href id='btn-sign-out'>
							Sign out
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
