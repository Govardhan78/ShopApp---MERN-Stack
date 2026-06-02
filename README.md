# ShopApp - MERN Stack

Full-stack shop management app with live chat.


## Setup & Run

### 1. Backend

cd backend
npm install


Create `.env` 

PORT=5000
MONGO_URI=mongodb://localhost:27017/shopapp
JWT_SECRET=mysecretkey123

npm run dev

Backend runs on: http://localhost:5000

---

### 2. Frontend

cd frontend
npm install
npm run dev

Frontend runs on: http://localhost:3000


## Create Admin User

After starting the backend, register a user normally then update their role in MongoDB:
In MongoDB shell or Compass

db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })



## Postman

Import `ShopApp.postman_collection.json` into Postman.

After login, copy the token and set it as the `token` collection variable.

