import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { AdminService } from "../../Services";
import { successMessage } from "../../Slices/message";

export default function OrderRow({ order }) {
	return (
		<tr key={order && order.id}>
			<td>{order && order.id}</td>
			<td>{order && order.total}</td>
			<td>{order && order.status}</td>
			<td>
				<p>{order && order.time}</p>
			</td>
			<td className='boder-none'>
				<div className='action'>
					<Link to={`/admin/orders/${order && order.id}`}>
						<i className='fa-solid fa-pen' />
					</Link>
				</div>
			</td>
		</tr>
	);
}
