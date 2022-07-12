import React from "react";
import BookItem from "../../../Components/BookItem/BookItem";
import "./BrowseBook.style.scss";

export default function BrowseBook() {
	return (
		<div className='content-page'>
			<div className='container-fluid'>
				<div className='wrapper-content'>
					<div className='content-item'>
						<div className='card'>
							<div className='card-header'>
								<div className='card-header-title'>
									<h4 className='card-title'>Browse Books</h4>
								</div>
								<div className='card-header-toolbar'>
									<a href className='view-more'>
										View more
									</a>
								</div>
							</div>
							<div className='card-body'>
								<BookItem />
								<BookItem />
								<BookItem />
								<BookItem />
								<BookItem />
								<BookItem />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
