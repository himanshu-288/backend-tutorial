# Backend Tutorial — Node, Express and MongoDB

An implementation of Shivani’s [freeCodeCamp backend tutorial](https://www.youtube.com/watch?v=KOutPbKc9UM). Register a user, log in, and create, read, update and delete posts. Each user can manage their own posts. Passwords are hashed with bcrypt. Login issues a one-hour bearer token and logout invalidates it.

## Run in VS Code

1. Install Node.js 22 or later. Extract the project and open the folder containing package.json in VS Code.
2. In Terminal → New Terminal run `npm ci`. Copy the file `.env.example` to `.env`.
3. In MongoDB Atlas create a free cluster, create a database user with read/write access to the database, and add your laptop’s IP under Network Access. Under Connect → Drivers, copy the Node.js connection string into MONGODB_URI in your local .env. Substitute the database username and URL-encoded password, and enter backend_tutorial between the slash and the query string. With a local MongoDB server running, the example URI works as written.
4. Press F5 or run `npm run dev`. Open http://127.0.0.1:4000 and look for databaseConnected set to true.

## Demonstrate the API in Postman desktop

Import postman/Backend.postman_collection.json. Select the collection and choose Run collection. Run the requests in order. The first request creates a fresh demo account on each run. Login stores the token, and Create stores the post ID for later requests. To show the data in Atlas, pause after Create and open the posts collection.

| Method | Path under /api/v1 | What it does |
|---|---|---|
| POST | /users/register | Register with username, email and password |
| POST | /users/login | Exchange email and password for a token |
| POST | /posts/create | Create a post with name, description and age (1–150) |
| GET | /posts/getPosts | Read the current user’s posts |
| PATCH | /posts/update/:id | Update one or more post fields |
| DELETE | /posts/delete/:id | Delete a post |
| POST | /users/logout | Invalidate the token |

Post routes and logout accept an Authorization header containing Bearer followed by a space and the token.

## Explain it in your evaluation

Trace the Create request from the Postman collection. Express parses the JSON in server.js. routes/api.js matches the URL and checks the login token. The create controller in controllers/posts.js selects the editable fields and adds the signed-in user's ID. models/Post.js validates the values. Mongoose writes the document to MongoDB, then Express returns HTTP 201 and the saved post ID. Try age 151 to demonstrate a validation failure.
