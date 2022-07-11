import React from "react";
import "./Page404.style.scss";

export default function Page404() {
	return (
		<div className='wrapper' id='page404-wrapper'>
			<div className='container'>
				<div className='error'>
					<img src='./images/404.png' alt='' />
					<h2 className='error__message'>Oops! This Page is Not Found.</h2>
					<p>The requested page dose not exist.</p>
					<a href className='error__back'>
						<i className='fa-solid fa-house' />
						Back to home
					</a>
				</div>
			</div>
		</div>
	);
}
