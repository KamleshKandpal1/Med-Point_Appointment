#Med-Point_Appointment
Med-Point_Appointment is a web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to book medical appointments easily. This project is structured into three main folders for better organization: Backend, Frontend, and Admin. The backend is deployed on Render, and the frontend and admin panel are deployed on Vercel.

Features
User Registration and Login: Users can sign up and log in to book appointments.
Appointment Booking: Allows users to book appointments with doctors.
Admin Panel: Admins can manage appointments and user data.
Dashboard: Users and Admins have different dashboards for managing appointments and records.
Tech Stack
Frontend: React, Tailwind CSS
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Deployment:
Backend: Render
Frontend: Vercel
Project Structure
/backend: Contains all the backend code, including API routes, controllers, models, and server configuration.
/frontend: Contains the user-facing React application that allows users to interact with the system.
/admin: Contains the admin panel for managing appointments, users, and overall system administration.
Setup Instructions
Backend Setup
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/Med-Point_Appointment.git
Navigate to the backend folder:

bash
Copy code
cd Med-Point_Appointment/backend
Install backend dependencies:

bash
Copy code
npm install
Create a .env file in the /backend directory and add your environment variables (e.g., MongoDB URI, JWT secret).

Start the backend server:

bash
Copy code
npm start
Frontend Setup
Navigate to the frontend folder:

bash
Copy code
cd Med-Point_Appointment/frontend
Install frontend dependencies:

bash
Copy code
npm install
Start the frontend server:

bash
Copy code
npm start
Admin Panel Setup
Navigate to the admin folder:

bash
Copy code
cd Med-Point_Appointment/admin
Install admin panel dependencies:

bash
Copy code
npm install
Start the admin panel:

bash
Copy code
npm start
Deployment
Backend Deployment
The backend has been deployed on Render. You can access it at https://med-point-appointment.onrender.com.

Frontend and Admin Deployment
The frontend and admin panel have been deployed on Vercel. You can access the application at:

Frontend: https://med-point-appointment-uuf5.vercel.app/
Admin Panel: https://med-point-appointment-9knx.vercel.app/
