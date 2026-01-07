import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';

function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody');
    if (!orderTableBody) return;

    // 🔥 JOIN ADMIN SOCKET ROOM
    socket.emit('joinAdmin');

    let orders = [];

    axios.get('/admin/orders', {
        headers: { "X-Requested-With": "XMLHttpRequest" }
    }).then(res => {
        orders = res.data;
        orderTableBody.innerHTML = generateMarkup(orders);
    }).catch(err => {
        console.error("Error fetching orders:", err);
    });

    // 🔥 REAL-TIME ORDER PLACED
    socket.on('orderPlaced', (order) => {
        orders.unshift(order);
        orderTableBody.innerHTML = generateMarkup(orders);

        new Noty({
            type: 'success',
            timeout: 3000,
            text: '🆕 New order received!',
            progressBar: false
        }).show();
    });

    function generateMarkup(orders) {
        return orders.map(order => `
            <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId?.name || 'Unknown'}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <form action="/admin/orders/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()"
                            class="block w-full bg-white border px-4 py-2 rounded">
                            <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </form>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('hh:mm A')}
                </td>
            </tr>
        `).join('');
    }

    function renderItems(items) {
        if (!items) return '<p>No items</p>';
        return Object.values(items)
            .map(item => `<p>${item.name} - ${item.qty} pcs</p>`)
            .join('');
    }
}

// ✅ INIT ONLY ON ADMIN PAGE
document.addEventListener('DOMContentLoaded', () => {
    const orderTableBody = document.querySelector('#orderTableBody');
    if (orderTableBody) {
        const socket = io(); // Socket.IO client
        initAdmin(socket);
    }
});

export { initAdmin };
