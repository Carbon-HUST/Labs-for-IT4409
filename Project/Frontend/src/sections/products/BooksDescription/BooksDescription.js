import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductService } from "../../../Services";
import "./BooksDescription.style.scss";

export default function BooksDescription() {
	let params = useParams();
	const [book, setBook] = useState({});
	useEffect(() => {
		async function fetchData() {
			const res = await ProductService.getBookById(params.id);
			setBook(res);
		}

		fetchData();
	}, [params.id]);
	return (
		<div className='content-page'>
			<div className='container-fluid'>
				<div className='wrapper'>
					<div className='book-des'>
						<div className='card'>
							<div className='card-header'>
								<h4>Books Description</h4>
							</div>
							<div className='card-body'>
								<div className='description-contents'>
									<div className='description-wrapper'>
										<div className='description-image'>
											<div className='sub-image'>
												<ul className='sub-list-image'>
													<li className='sub-list-item'>
														<a href>
															<img
																src={
																	book.images && book.images.length >= 1
																		? book.images[0]
																		: window.location.origin +
																		  "/images/books/01.jpg"
																}
																alt=''
															/>
														</a>
													</li>
													<li className='sub-list-item'>
														<a href>
															<img
																src={
																	book.images && book.images.length >= 2
																		? book.images[1]
																		: window.location.origin +
																		  "/images/books/02.jpg"
																}
																alt=''
															/>
														</a>
													</li>
													<li className='sub-list-item'>
														<a href>
															<img
																src={
																	book.images && book.images.length >= 3
																		? book.images[2]
																		: window.location.origin +
																		  "/images/books/03.jpg"
																}
																alt=''
															/>
														</a>
													</li>
												</ul>
											</div>
											<div className='main-image'>
												<a href>
													<img
														src={
															book.images && book.images.length >= 4
																? book.images[3]
																: window.location.origin +
																  "/images/books/04.jpg"
														}
														alt=''
													/>
												</a>
											</div>
										</div>
									</div>
									<div className='description-wrapper'>
										<h3>{book.title}</h3>
										<div className='description-price'>
											<span className='description-old-price'>
												{book.olPrice || "50.000"}
											</span>
											<span className='description-new-price'>
												{book.price}
											</span>
										</div>
										<div className='description-rating'>
											<span>
												<i className='fa-solid fa-star' />
												<i className='fa-solid fa-star' />
												<i className='fa-solid fa-star' />
												<i className='fa-solid fa-star' />
												<i className='fa-solid fa-star' />
											</span>
										</div>
										<span className='description-content'>
											{book.description ||
												"Monterhing in the best book testem ipsum is simply dtestin find in a of the printing and typeseting industry into to end.in find in a of the printing and typeseting industry in find to make it all done into end."}
										</span>
										<div className='description-author'>
											Author:{" "}
											{book.authors ? (
												book.authors.map((item, index) => (
													<span key={index}>{item}</span>
												))
											) : (
												<span>Jhone Steben</span>
											)}
										</div>
										<div className='description-actions'>
											<Link to={""}>Add to cart</Link>
											<Link to={""}>Read Sample</Link>
										</div>
										<div className='description-wishlist'>
											<a href>
												<span className='wishlist-icon'>
													<i className='fa-solid fa-heart' />
												</span>
												<span>Add to wishlist</span>
											</a>
										</div>
										<div className='description-social'>
											<h5>Share:</h5>
											<ul>
												<li>
													<a href className='social-icon fb'>
														<i className='fa-brands fa-facebook-f' />
													</a>
												</li>
												<li>
													<a href className='social-icon twitter'>
														<i className='fa-brands fa-twitter' />
													</a>
												</li>
												<li>
													<a href className='social-icon yt'>
														<i className='fa-brands fa-youtube' />
													</a>
												</li>
												<li>
													<a href className='social-icon pinterest'>
														<i className='fa-brands fa-pinterest-p' />
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
