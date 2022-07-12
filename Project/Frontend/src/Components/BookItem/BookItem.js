import React from "react";
import { Link } from "react-router-dom";

export default function BookItem() {
	return (
		<div className='card-item'>
			<div className='card-image'>
				<a href>
					<img src='./images/books/01.jpg' alt='' />
				</a>
				<div className='view-book'>
					<Link to={"/product/1"}>View Book</Link>
				</div>
			</div>
			<div className='card-content'>
				<div className='card-content-header'>
					<h6>Reading on the world</h6>
					<p>Jhone Steben</p>
					<div className='rating'>
						<span>
							<i className='fa-solid fa-star' />
							<i className='fa-solid fa-star' />
							<i className='fa-solid fa-star' />
							<i className='fa-solid fa-star' />
							<i className='fa-solid fa-star' />
						</span>
					</div>
				</div>
				<div className='card-content-price'>
					<span className='old-price'>10.000</span>
					<h6>5.000</h6>
				</div>
				<div className='card-content-actions'>
					<a href>
						<i className='fa-solid fa-cart-shopping' />
					</a>
					<a href>
						<i className='fa-solid fa-heart' />
					</a>
				</div>
			</div>
		</div>
	);
}
