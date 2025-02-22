# ecoFashion Web Portal 
![Homepage](https://github.com/iamashlim/EcoFashion-Web-Portal/blob/70466b0d4f8f24687f46eaa9795257087e13e696/frontend/images/Screenshot%20(457).png)
![](https://github.com/iamashlim/EcoFashion-Web-Portal/blob/c4efa8c2eda5fed9cb7805fd09ce73c2b1f5d266/frontend/images/Screenshot%20(458).png)
ecoFashion is an e-commerce platform designed to promote sustainable fashion by providing transparency in the production process and incentivizing eco-friendly choices. Developed as part of a course project by Riwas Budhathoki and Ashlim Tamang from the **Department of Electronics and Computer Engineering, Thapathali Campus, IOE, Nepal**, this platform aims to foster sustainability in the fashion industry through its innovative features.

[Visit ecoFashion](https://ecofashion-web-portal.onrender.com)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Team Members](#team-members)
3. [Key Features](#key-features)
   - [User Management](#user-management)
   - [Product Transparency](#product-transparency)
   - [ecoScore & ecoRating System](#ecoscore-ecorating-system)
   - [Product & Resource Management](#product-resource-management)
   - [Enhanced Search Filters](#enhanced-search-filters)
   - [Shopping Experience](#shopping-experience)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Installation Guide](#installation-guide)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Configure Environment Variables](#configure-environment-variables)
   - [Database Setup](#database-setup)
   - [Running the Application](#running-the-application)
7. [Deployment on Render](#deployment-on-render)
8. [API Endpoints](#api-endpoints)
9. [Future Enhancements](#future-enhancements)
10. [Challenges Faced](#challenges-faced)
11. [Contributions](#contributions)
12. [License](#license)
13. [Acknowledgements](#acknowledgements)
14. [Project Architecture](#project-architecture)

## Project Overview

ecoFashion is an online platform dedicated to promoting eco-friendly fashion by offering a seamless shopping experience while encouraging responsible consumption. It integrates user management, product categorization, sustainability rating systems (ecoScore and ecoRating), and efficient product/resource management.

## Team Members
- [Riwas Budhathoki](https://github.com/RiwasBudhathoki35)
- [Ashlim Tamang](https://github.com/iamashlim)

## Key Features

### User Management
- Secure authentication system for both consumers and suppliers.
- Users can register, log in, and manage their profile details.
- Track personal **ecoScore** based on sustainable shopping habits.

### Product Transparency
- Offers detailed insights into the production process of each product.
- Sustainability metrics, including **ecoScores** and **ecoRatings**, are visible to users.

### ecoScore & ecoRating System
- **ecoScore** for consumers based on their purchasing history.
- **ecoRating** for suppliers based on the sustainability of their products.
- Users can filter and sort products by **ecoScore**, **ecoRating**, price, and reviews.

### Product & Resource Management
- Suppliers can add, update, and remove products with transparent sustainability data.
- Easy browsing with product categorization and filtering.

### Enhanced Search Filters
- Filters for eco-friendly products based on **ecoScore**, **ecoRating**, price, and customer reviews.

### Shopping Experience
- Seamless product browsing with sustainability insights and eco-friendly options.

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
### Install Dependencies
```bash
npm install
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

#### Deployment on Render
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
   
## API Endpoints

| Method | Endpoint     | Description      |
|--------|--------------|------------------|
| GET    | /            | Home Page        |
| GET    | /profile     | User Profile     |
| POST   | /login       | User Login       |
| POST   | /register    | User Registration|
| GET    | /products    | Fetch Products   |
| POST   | /order       | Place Order      |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (feature-branch).
3. Commit your changes.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the MIT License.

