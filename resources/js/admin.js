import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';

function initAdmin() {
    const orderTableBody = document.querySelector('#orderTableBody');
    if (!orderTableBody) {
        console.error("orderTableBody not found in DOM");
        return;
    }

    let orders = [];

    axios.get('/admin/orders', {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    }).then(res => {
        orders = res.data;
        console.log("Orders received:", orders);
        orderTableBody.innerHTML = generateMarkup(orders);
    }).catch(err => {
        console.error("Error fetching orders:", err);
    });

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                    <td class="border px-4 py-2 text-green-900">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>
                    </td>
                    <td class="border px-4 py-2">${order.customerId?.name || "Unknown"}</td>
                    <td class="border px-4 py-2">${order.address}</td>
                    <td class="border px-4 py-2">
                        <div class="inline-block relative w-64">
                            <form action="/admin/orders/status" method="POST">
                                <input type="hidden" name="orderId" value="${order._id}">
                                <select name="status" onchange="this.form.submit()"
                                    class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                                </select>
                            </form>
                        </div>
                    </td>
                    <td class="border px-4 py-2">${moment(order.createdAt).format('hh:mm A')}</td>
                </tr>
            `;
        }).join('');
    }

    function renderItems(items) {
        if (!items || typeof items !== "object") return "<p>No items</p>";

        return Object.entries(items)
            .map(([key, menuItem]) => `<p>${menuItem.name || "Unknown"} - ${menuItem.qty} pcs</p>`)
            .join('');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.querySelector("#orderTableBody");
    
    if (orderTableBody) {
        console.log("Admin panel detected, initializing orders...");
        initAdmin();
    } else {
        console.warn("Not an admin page, skipping initAdmin().");
    }
});


export { initAdmin };
