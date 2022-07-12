import React from "react";
import "./BooksDescription.style.scss";

export default function BooksDescription() {
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
																	window.location.origin +
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
																	window.location.origin +
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
																	window.location.origin +
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
															window.location.origin + "/images/books/04.jpg"
														}
														alt=''
													/>
												</a>
											</div>
										</div>
									</div>
									<div className='description-wrapper'>
										<h3>
											A Casey Christi night books in the raza Dakota Krout
										</h3>
										<div className='description-price'>
											<span className='description-old-price'>50.000</span>
											<span className='description-new-price'>25.000</span>
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
											Monterhing in the best book testem ipsum is simply dtest
											in find in a of the printing and typeseting industry into
											to end.in find in a of the printing and typeseting
											industry in find to make it all done into end.
										</span>
										<div className='description-author'>
											Author: <span>Jhone Steben</span>
										</div>
										<div className='description-actions'>
											<a href>Add to cart</a>
											<a href>Read Sample</a>
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
