# ecoFashion Web Portal 
![Homepage](https://github.com/iamashlim/EcoFashion-Web-Portal/blob/70466b0d4f8f24687f46eaa9795257087e13e696/frontend/images/Screenshot%20(457).png)
ecoFashion is an e-commerce platform designed to promote sustainable fashion by providing transparency in the production process and incentivizing eco-friendly choices. Developed as part of a course project by Riwas Budhathoki and Ashlim Tamang from the **Department of Electronics and Computer Engineering, Thapathali Campus, IOE, Nepal**, this platform aims to foster sustainability in the fashion industry through its innovative features.

[Visit ecoFashion](https://ecofashion-web-portal.onrender.com)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Team Members](#team-members)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Installation Guide](#installation-guide)
7. [Deployment on Render](#deployment-on-render)
8. [Routes](#routes)
9. [Future Enhancements](#future-enhancements)
10. [Challenges Faced](#challenges-faced)
11. [Contributions](#contributions)
12. [License](#license)

## Project Overview

ecoFashion is an online platform dedicated to promoting eco-friendly fashion by offering a seamless shopping experience while encouraging responsible consumption. It integrates user management, product categorization, sustainability rating systems (ecoScore and ecoRating), and efficient product/resource management.

## Team Members
- [Riwas Budhathoki](https://github.com/RiwasBudhathoki35)
- [Ashlim Tamang](https://github.com/iamashlim)

## Key Features

1. **EcoScore System**: Encourages sustainability by rewarding customers with discounts and suppliers with reputation boosts.
2. **User Authentication**: Uses express-session and passport-local for secure login and session management.
3. **Role-Based Access**:
   - isCustomer: Ensures only customers can make purchases.
   - checkAuthenticated: Restricts access to authenticated users.
4. **Interactive Dashboards**:
   - Supplier Dashboard: Tracks clicks on products and total sales.
   - Customer Dashboard: Displays total ecoScore and available discounts.
5. **Fetch API & Endpoints**:
   - Supports DELETE requests via a Fetch API.
   - Uses GET and POST requests to interact with the backend and render pages dynamically.
   
## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, EJS, JavaScript
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Hosting**: Render

## Prerequisites

Make sure you have the following installed:

- **Node.js**: For running the server and backend.
- **PostgreSQL**: For managing the database.
- **Git**: For version control.

## Installation Guide

### Clone the Repository:
```bash
git clone https://github.com/RiwasBudhathoki35/EcoFashion-Web-Portal.git
cd EcoFashion-Web-Portal
````
### Navigate to backend
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Start the server
```bash
npm server
```

### Environment Variables
Create a .env file in the root directory and add the following environment variables:
```bash
PORT=10000
DB_USER=project
DB_PASSWORD=your_database_password
DB_HOST=dpg-cus2rigfnakc73euhhjg-a.oregon-postgres.render.com
DB_PORT=5432
DB_DATABASE=ecofashion
SESSION_SECRET=your_secret_key
```

### Database Configuration
#### Setting Up PostgreSQL
If running locally, create the database:
```bash
psql -U postgres
CREATE DATABASE ecofashion;
```
Run migrations if applicable.

#### Running the Application
```bash
npm start
```

## Deployment on Render

1. Push the latest code to GitHub:
      ```bash
   git add .
   git commit -m "Deploying updates"
   git push origin main
   ```
2. Go to Render
3. Create a new Web Service
4. Select the repository
5. Set the root directory as backend/
6. Use the build command:
   ```bash
   npm install
   ```
7. Stat command
   ```bash
   node server.js
   ```
   
## Routes

| Method |    Route     | Description      |
|--------|--------------|------------------|
| GET    | /            | Home Page        |
| GET    | /profile     | User Profile     |
| POST   | /login       | User Login       |
| POST   | /register    | User Registration|
| GET    | /products    | Fetch Products   |
| POST   | /order       | Place Order      |


## Future Enhancements

- Use AI/ML to suggest eco-friendly products based on user preferences, past purchases, and sustainability scores.
- Introduce levels, badges, and leaderboards to encourage users to buy more sustainable products and engage with suppliers.
- Show users the carbon footprint of their purchases and suggest greener alternatives.
- Allow multiple suppliers to sign up, manage their inventory, and sell directly through your platform.
- Develop a mobile app for better accessibility and a smoother shopping experience.
- Implement an AI chatbot to assist users with purchases, sustainability tips, and supplier inquiries.
- Provide personalized discount offers based on a customer’s ecoScore and shopping habits.
- Give customers the option to choose sustainable packaging at checkout.

## Challenges Faced


Scalability Issues

Handling increased traffic, large datasets, and a growing user base efficiently with Node.js and PostgreSQL.
Data Security & Authentication

Protecting user data, securing payments, and preventing fraudulent activities with strong authentication mechanisms.
Performance Optimization

Optimizing rendering speeds, database queries, and API responses for a seamless shopping experience.
EcoScore Calculation Transparency

Ensuring that the ecoScore algorithm is fair, transparent, and cannot be manipulated by suppliers or customers.
Legal & Compliance Issues

Ensuring compliance with sustainability laws, data privacy regulations (like GDPR), and e-commerce policies.
Payment Gateway Integration

Implementing secure and seamless payment methods while reducing transaction fees.
Customer Retention & Engagement

Keeping customers engaged and motivated to make sustainable choices long-term.
Cross-Browser & Mobile Compatibility

## Contributions

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (feature-branch).
3. Commit your changes.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the MIT License.

