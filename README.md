# Personal Portfolio Website Backend

This is the backend service for a personal portfolio site—built using **Node.js**, **Express**, **MongoDB**, and **Redis**. It was developed collaboratively by the **Mabaryok Discord community**.

> Frontend code is available in a separate repository. 

The backend is responsible for handling API logic, storing and retrieving data, and managing authentication. It’s structured into logical modules: `config`, `controllers`, `routes`, `models`, and `middlewares`.

---

## 📦 How to Install & Run

You have **two options** to run this project:


### 🟢 Option 1: Run Directly (Node.js)

```bash
# Clone the repository
git clone https://github.com/Mabaryok-co/portfoliobackend-boilerplate.git
cd portfoliobackend-boilerplate

# Install dependencies
npm install
```
> ⚠️ You must fill out all the required fields in .env file. Redis and MongoDB connection strings are mandatory. Edit the .env.example file then rename it to .env

###### Start the App
```bash
# Run with Node
npm run start

# Or run with nodemon (for development)
npm run dev
```

### 🐳 Option 2: Run with Docker (Recommended for deployment)
```bash
# Clone the repository
git clone https://github.com/Mabaryok-co/portfoliobackend-boilerplate.git
cd portfoliobackend-boilerplate
```
>⚠️ Edit the .env.example file then rename it to .env, ensure all required fields are filled, especially the MongoDB and Redis credentials.

##### Then Simply run:
```bash
docker compose up -d --build
```

This will spin up:
- A containerized version of the app
- A Redis container

>Note: MongoDB is not included in the Docker setup. It is recommended to use MongoDB Atlas (cloud database). See references section for how to get a connection string.

##### After that, it is recommended to see the logs:
```bash
docker container logs portfolio-backend-app -f
```

---
## 🔗 References & Setup Guides
✅ Redis Installation Guide
- [Install Redis on macOS](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-mac-os/)
- [Install Redis on Linux (Ubuntu)](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis-on-linux/)
- [Install Redis on Windows (via WSL)](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-windows/)

✅ MongoDB Cloud (Atlas) Guide
- [Create Free MongoDB Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
- [Get MongoDB Connection String](https://www.mongodb.com/resources/products/fundamentals/mongodb-connection-string)

**You’ll need to whitelist your IP and create a database user to get access.**

---

## 🧱 Tech Stack

- **Node.js** + **Express.js** – Backend server
- **MongoDB** – Main database (PostgreSQL support planned)
- **Redis** – Caching and session management