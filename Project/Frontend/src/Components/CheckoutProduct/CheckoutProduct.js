import React from "react";
import "./CheckoutProduct.style.scss";

export default function CheckoutProduct() {
    return (
        <div className="checkout-product">
            <div className="checkout-product-container">
                <div className="col1">
                    <span className="checkout-product-img">
                    <a href="#" alt="">
                        <img src="https://templates.iqonic.design/booksto/html/images/browse-books/01.jpg" />
                    </a>
                    </span>
                </div>
                <div className="col2">
                    <div className="checkout-product-details">
                        <h5>The Raze night book</h5>
                        <p className="text-success">In stock</p>
                        <h5>100.000</h5>
                    </div>
                </div>
                <div className="col3">
                    <div className="row">
                        <div className="price-container">
                            <div className="price-container-flex">
                                <div className="quantity">
                                  <button
                                    type="button"
                                    className="qty-btn"
                                    id="btn-minus"
                                  >
                                    <i className="fa fa-minus" />
                                  </button>
                                  <input
                                    type="text"
                                    id="quantity"
                                    defaultValue={0}
                                  />
                                  <button
                                    type="button"
                                    className="qty-btn"
                                    id="btn-plus"
                                  >
                                    <i className="fa fa-plus" />
                                  </button>
                                </div>
                                <div className="price">
                                  <span>100.000</span>
                                </div>
                            </div>
                        </div>
                        <div className="remove">
                            <a href="#">
                                <i className="fa-solid fa-trash" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}