Restaurant Order Management System (Frontend)
This is the frontend of a Role-Based Restaurant Order Management System built using React. The app allows both Customers and Restaurants to interact with a food ordering system in real-time using Socket.io.

Frontend GitHub Repo: https://github.com/Asimsam08/restro-order-fe

 Features =>
Role-based login:

Customers can register and login.

Restaurants are pre-registered by admin and login with provided credentials.

Customer Flow:

Browse restaurant menu.

Place orders.

Track order status in real-time.

Restaurant Flow:

View live order dashboard.

Update order status (e.g., preparing, delivered).

Real-Time Updates:

Powered by Socket.io, both customers and restaurants get instant updates without refreshing the page.


Tech Stack =>
Frontend: React.js, Typescript, Axios, Tailwind CSS, Zustand, socket.io-client

Backend: Node.js, Express, PostgreSQL, Socket.io

Auth: JWT-based login

Real-time: Socket.io for bi-directional communication


 Clone the Repository=>

git clone https://github.com/Asimsam08/restro-order-fe.git
cd restro-order-fe
npm install

Set Environment Variables:
Create a .env file in the root and add:
NEXT_PUBLIC_API_URL=https://restro-be-jsqa.onrender.com/api

npm run dev
The app will run locally on http://localhost:3000


 Notes
The same login page is used for both Customers and Restaurants. The backend handles routing based on the role.

Admin creates restaurant users; customers can self-register.

This repo is only for the frontend. Make sure the backend is also running and accessible.