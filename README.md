🍕 Pizza Point – Full Stack Food Ordering Web App

Pizza Point is a full-stack food ordering web application where users can browse menu items, add pizzas to cart, place orders, and track order status in real-time.
It also includes an admin dashboard for managing orders and updating delivery status.

This project is built using Node.js, Express, MongoDB, and EJS with authentication and real-time order tracking.

https://pizza-point.onrender.com

live link above☝️

🚀 Features
👤 User Features

User registration & login authentication

Browse pizza/food menu

Add to cart & update quantity

Place orders online

Real-time order status tracking

Order history page

🛠️ Admin Features

Admin login dashboard

View all customer orders

Update order status (Preparing, Delivered etc.)

Real-time order updates

⚡ Additional Features

Session-based authentication

Flash messages & notifications

Responsive UI

MVC architecture

Real-time updates using Socket.io

🧰 Tech Stack

Frontend

HTML

CSS

JavaScript

EJS Template Engine

Backend

Node.js

Express.js

Database

MongoDB (Mongoose)

Other Tools

Socket.io (Real-time tracking)

Laravel Mix (Asset compilation)

Passport.js (Authentication)

📁 Project Structure
pizza_point

│

├── app

│   ├── controllers

│   ├── middleware

│   ├── models

│   └── config

│

├── public

│   ├── css

│   ├── img

│   └── js

│

├── resources/views (EJS files)

├── routes

├── server.js

└── package.json


⚙️ Installation & Setup

1️⃣ Clone Repository

git clone https://github.com/RashidR18/pizza_point.git
cd pizza_point

2️⃣ Install Dependencies

npm install

3️⃣ Create .env File

Create a .env file in root and add:

PORT=3000
MONGO_CONNECTION_URL=your_mongodb_url
SESSION_SECRET=your_secret_key

4️⃣ Run Project

npm run dev


or

npm start


Server will run on:

http://localhost:3000


🔐 Admin Login (Example)


You can create admin manually in database or modify role in MongoDB:

role: admin

📸 Screenshots 

Home Page 

<img width="1911" height="876" alt="pizzapoint" src="https://github.com/user-attachments/assets/46f032c3-25c7-41f8-9fea-700d9c667e8a" />


Login Page

<img width="1907" height="870" alt="Screenshot 2025-04-12 182140" src="https://github.com/user-attachments/assets/955abb7d-d6ce-4de0-a2aa-cdd2c419eeaa" />


Menu Page

<img width="1893" height="822" alt="Screenshot 2025-04-12 182054" src="https://github.com/user-attachments/assets/197a95df-da6e-460c-9f3d-f2a28eea951e" />


Cart Page

<img width="1911" height="854" alt="Screenshot 2025-04-12 182216" src="https://github.com/user-attachments/assets/f0aca656-35c3-41d2-835e-87c74e7686e4" />

<img width="1906" height="857" alt="Screenshot 2025-04-12 182359" src="https://github.com/user-attachments/assets/81203e05-16ff-40ce-9332-5d0312229844" />



Order Tracking

<img width="1910" height="729" alt="Screenshot 2025-04-12 182244" src="https://github.com/user-attachments/assets/a77e777b-5819-4dbc-ad09-255fddf40069" />


🎯 Learning Outcomes

This project helped in learning:

Full stack development

MVC architecture

Authentication & authorization

Real-time communication with Socket.io

MongoDB database handling


