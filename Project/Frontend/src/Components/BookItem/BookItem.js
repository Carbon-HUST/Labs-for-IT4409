import React from "react";
import { Link } from "react-router-dom";

export default function BookItem({ id, title, description, price, thumbnail }) {
	return (
		<div key={id} className='card-item'>
			<div className='card-image'>
				<Link to=''>
					<img src={thumbnail || "./images/books/01.jpg"} alt='' />
				</Link>
				<div className='view-book'>
					<Link to={`/product/${id}`}>View Book</Link>
				</div>
			</div>
			<div className='card-content'>
				<div className='card-content-header'>
					<h6>{title}</h6>
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
					<h6>{price}</h6>
				</div>
				<div className='card-content-actions'>
					<Link to=''>
						<i className='fa-solid fa-cart-shopping' />
					</Link>
					<Link to=''>
						<i className='fa-solid fa-heart' />
					</Link>
				</div>
			</div>
		</div>
	);
}
