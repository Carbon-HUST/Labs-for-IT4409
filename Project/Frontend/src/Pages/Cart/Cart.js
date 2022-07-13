import React from "react";
import "./Cart.style.scss";
import CheckoutProduct from "../../Components/CheckoutProduct/CheckoutProduct";

export default function Cart() {
  return (
    <div id="content-page" className="content-page">
      <div className="content-fluid">
        <div className="row">
          <div id="cart" className="row card-block show">
            <div className="item-container">
              <div className="iq-card">
                <div className="iq-card-header">
                  <div className="iq-header-title">
                    <h4>Shopping Cart</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <ul className="list-inline">
                    <CheckoutProduct />
                    <CheckoutProduct />
                    <CheckoutProduct />
                  </ul>
                </div>
              </div>
            </div>
            <div className="bill-container">
              <div className="iq-card">
                <div className="iq-card-body">
                  <p>Options</p>
                  <div className="line">
                    <span>Coupons</span>
                    <span>
                      <a href="#">
                        <strong>Apply</strong>
                      </a>
                    </span>
                  </div>
                  <hr />
                  <p>
                    <b>Price Details</b>
                  </p>
                  <div className="line mb1">
                    <span>Total MRP</span>
                    <span>100.000</span>
                  </div>
                  <div className="line mb1">
                    <span>Bag Discount</span>
                    <span className="text-success">-20.000</span>
                  </div>
                  <div className="line mb1">
                    <span>Estimated Tax</span>
                    <span>15.000</span>
                  </div>
                  <div className="line mb1">
                    <span>EMI Eligibility</span>
                    <span>
                      <a href="#">Details</a>
                    </span>
                  </div>
                  <div className="line">
                    <span>Delivery Charges</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="line">
                    <span className="text-dark">
                      <strong>Total</strong>
                    </span>
                    <span className="text-dark">
                      <strong>999.000</strong>
                    </span>
                  </div>
                  <a id="place-holder" href="#">
                    Place holder
                  </a>
                </div>
              </div>
              <div className="iq-card">
                <div className="card-body">
                  <ul className="list-inline">
                    <li className="policy-container">
                      <div className="iq-checkout-icon">
                        <i className="ri-checkbox-line" />
                      </div>
                      <h6>Security policy (Safe and Secure Payment.)</h6>
                    </li>
                    <li className="policy-container">
                      <div className="iq-checkout-icon">
                        <i className="ri-truck-line" />
                      </div>
                      <h6>Delivery policy (Home Delivery.)</h6>
                    </li>
                    <li className="policy-container">
                      <div className="iq-checkout-icon">
                        <i className="ri-arrow-go-back-line" />
                      </div>
                      <h6>Return policy (Easy Retyrn.)</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div id="address" className="row card-block show">
            <div className="item-container">
              <div className="iq-card">
                <div className="iq-card-header">
                  <div className="iq-header-title">
                    <h4>Add New Address</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <form>
                    <div className="row mt3">
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <div className="form-group">
                          <label>Full Name: *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="infor">
                        <button
                          id="save-n-deliver"
                          type="submit"
                          className="btn-save"
                        >
                          Save And Deliver Here
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="bill-container">
              <div className="iq-card">
                <div className="iq-card-body">
                  <h4>Nik John</h4>
                  <div className="shipping-address">
                    <p>9447 Glen Eagles Drive</p>
                    <p>Lewis Center, OH 43035</p>
                    <p>UTC-5: Eastern Standard Time (EST)</p>
                    <p>202-555-0140</p>
                  </div>
                  <hr />
                  <a href="#" id="delivery-address" className="deliver-address">
                    Deliver To this Address
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="payment" className="row card-block show">
            <div className="item-container">
              <div className="iq-card">
                <div className="iq-card-header">
                  <div className="iq-header-title">
                    <h4>Payment Options</h4>
                  </div>
                </div>
                <div className="iq-card-body">
                  <div className="card-information">
                    <div className="card-information">
                      <img
                        src="https://templates.iqonic.design/booksto/html/images/booking/cart.png"
                        alt=""
                        height={40}
                        width={50}
                      />
                      <span>US Unlocked Debit Card 12XX XXXX XXXX 0000</span>
                    </div>
                    <span>Nik John</span>
                    <span>28/2020</span>
                  </div>
                  <form>
                    <div className="cvv">
                      <span>Enter CVV: </span>
                      <div className="cvv-input">
                        <input
                          type="text"
                          className="form-control"
                          required=""
                        />
                      </div>
                      <button type="submit" className="btn-continue">
                        Continue
                      </button>
                    </div>
                  </form>
                  <hr />
                  <div className="card-lists">
                    <div className="form-group">
                      <div className="options">
                        <input
                          type="radio"
                          name="customRadio"
                          id="creadit"
                          className="input-radio"
                        />
                        <label htmlFor="credit">
                          {" "}
                          Credit / Debit / ATM Card
                        </label>
                      </div>
                      <div className="options">
                        <input
                          type="radio"
                          name="customRadio"
                          id="creadit"
                          className="input-radio"
                        />
                        <label htmlFor="credit">
                          {" "}
                          Credit / Debit / ATM Card
                        </label>
                      </div>
                      <div className="options">
                        <input
                          type="radio"
                          name="customRadio"
                          id="creadit"
                          className="input-radio"
                        />
                        <label htmlFor="credit">
                          {" "}
                          Credit / Debit / ATM Card
                        </label>
                      </div>
                      <div className="options">
                        <input
                          type="radio"
                          name="customRadio"
                          id="creadit"
                          className="input-radio"
                        />
                        <label htmlFor="credit">
                          {" "}
                          Credit / Debit / ATM Card
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="add-card">
                    <a href="#">
                      <span>
                        <i className="ri-add-box-line" />
                        Add Gift Card
                      </span>
                    </a>
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
