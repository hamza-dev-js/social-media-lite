> # Social Media Lite
> 
> A full-stack social media application built with **React**, **Node.js**, **Express**, and **MySQL**.  
> This project demonstrates user authentication, post creation, editing, deletion, and proper authorization handling.
> 
> ---
> 
> ## Features
> 
> - **User Authentication**: Sign up and login with JWT-based authentication.
> - **CRUD Posts**: Create, read, update, and delete posts.
> - **Authorization**: Users can only edit or delete their own posts.
> - **Responsive Frontend**: Built with React and Tailwind CSS.
> - **Backend API**: Node.js + Express server with MySQL database.
> 
> ---
> 
> ## Technologies Used
> 
> - **Frontend**: React, Tailwind CSS
> - **Backend**: Node.js, Express
> - **Database**: MySQL
> - **Authentication**: JWT (JSON Web Tokens)
> 
> ---
> 
> ## Getting Started
> 
> ### Prerequisites
> - Node.js installed
> - MySQL installed and running
> 
> ### Backend Setup
> ```bash
> cd social-media-backend
> npm install
> # Create a MySQL database and update .env with credentials
> node server.js
> ```
> 
> ### Frontend Setup
> ```bash
> cd social-media-frontend
> npm install
> npm start
> ```
> 
> ### How It Works:
> 
> 1. Register a new user.
> 2. Login to access the home page.
> 3. Create new posts, view all posts.
> 4. Edit or delete your own posts only (authorization enforced).
