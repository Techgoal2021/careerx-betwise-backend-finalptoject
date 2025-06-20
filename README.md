# BetWise Backend API

BetWise is a betting platform backend built with Node.js, Express, and MongoDB. It supports user authentication, wallet management, game listing, and betting functionality.

---

## 🚀 Features

* User registration and login (JWT-based authentication)
* Admin-only user and game management
* Wallet operations: deposit, withdraw, balance check
* Place and view bets
* Role-based access control

---

## 📦 Technologies Used

* Node.js + Express
* MongoDB + Mongoose
* JWT for authentication
* dotenv for environment variables
* Winston for logging

---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/betwise-backend.git
cd betwise-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory and fill in the following:

```bash
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

You can also use the provided `.env.example` file.

### 4. Start the server

```bash
npm run dev
```

The server will run on `http://localhost:8000`

---

## 📫 API Endpoints

### 🔐 Authentication

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/users/register` | Register a new user     |
| POST   | `/users/login`    | Login and receive a JWT |

### 👤 Users

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/users/`    | List all users (admin only) |
| GET    | `/users/:id` | Get user by ID              |
| PUT    | `/users/:id` | Update user profile         |
| DELETE | `/users/:id` | Delete user (admin only)    |

### 💰 Wallet

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| POST   | `/users/:id/wallet/deposit`  | Deposit funds      |
| POST   | `/users/:id/wallet/withdraw` | Withdraw funds     |
| GET    | `/users/:id/wallet/balance`  | Get wallet balance |

> 🔐 Development Only:
> \| POST | `/users/fund-wallet` | Fund wallet (authenticated only, test route) |

### 🎮 Games

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/games`     | List all games          |
| POST   | `/api/games/add` | Add a game (admin only) |

### 🧾 Bets

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/api/bets/place-bet` | Place a new bet                |
| GET    | `/api/bets/history`   | Get current user's bet history |

---

## 🧪 Testing with Postman

Use the provided Postman collection to test all routes.

* Import the `BetWise.postman_collection.json` file into Postman
* Use the login route to get your JWT
* Add it to Postman headers as: `Authorization: Bearer <your_token>`

---

## 🌍 Deployment

You can deploy this backend to services like:

* Render
* Railway
* Heroku
* Vercel (Serverless, with adjustments)

Ensure you add the correct environment variables to your deployment settings.

---

## 👥 Contributors

* [John Sowemimo](https://github.com/Techgoal2021)

---

## 📃 License

This project is licensed under the MIT License.

---

For questions or issues, contact: `sowemimojohn@gmail.com`
