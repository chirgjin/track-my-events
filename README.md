# Track My Events

An event tracking system built on microservices architecture using PostgreSQL as the primary database along with Prisma ORM & Pub/Sub using Redis for backend & React for frontend.

#### Dashboard

![Dashboard](https://github.com/chirgjin/track-my-events/raw/main/documentation/images/Dashboard.png)

#### SDK Setup

![Setup Page](https://github.com/chirgjin/track-my-events/raw/main/documentation/images/Setup.png)

#### Architecture

![Architecture](https://github.com/chirgjin/track-my-events/raw/main/documentation/images/Architecture.png)

## How it works

### Services

There are 3 services in TrackMyEvents:

#### 1. Gateway

This service is responsible for routing API requests to all the other services. Frontend always communicates with this server and never directly with any other service.
Gateway also authenticates every request to tracking service via user service.

#### 2. User Service

This service is responsible for storing & authenticating users.

##### Database Schema

1. User

```prisma
model User {
  id           String         @id @default(uuid()) @db.Uuid()
  name         String         @db.VarChar(256)
  email        String         @unique @db.VarChar(256)
  password     String         @db.VarChar(256)
  apiKey       String         @db.VarChar(16)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime?
  AccessToken  AccessToken[]
  RefreshToken RefreshToken[]
}
```

2. Access Token

```prisma
model AccessToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique @db.VarChar(24)
  userId    String   @db.Uuid()
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  expiresOn DateTime
  createdAt DateTime @default(now())
}
```

3. Refresh Token

```prisma
model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique @db.VarChar(24)
  userId    String   @db.Uuid()
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  createdAt DateTime @default(now())
}
```

#### 3. Tracking Service

This service is responsible for storing event data & then inferring analytics from it.

##### Database Schema

1. Event

```prisma
model Event {
  id             Int    @id @default(autoincrement())
  internalUserId String @db.Uuid()  // id of our internal user to which this event is linked to

  sessionId String   @db.VarChar(256)
  eventTime DateTime
  eventName String   @db.VarChar(256)
  page      String   @db.VarChar(512)
  referrer  String?  @db.VarChar(512)
  context   Json
  userId    String?  @db.VarChar(256) // id of user where the tracking is being done. If user doesnt exist then a temp id is generated
  userAgent String?  @db.VarChar(256)
  createdAt DateTime @default(now())
}
```

### Registration / Login

![Register Page](https://github.com/chirgjin/track-my-events/raw/main/documentation/images/Register.png)

- The user data is stored in `User` table where each user row contains the values:

  - `name`: full name of the user
  - `email`: unique email of the user
  - `password`: hashed password
  - `apiKey`: unique auto-generated api key of the user. This is used when sending event data via sdk
  - `createdAt`: Date time when user was created
  - `updatedAt`: Date time when user updated their data. This is null if user never updated their data

- The authentication data is stored using `AccessToken` & `RefreshToken` tables

  Every time a user logs in or registers, a pair of access token & refresh token is created. This access token is used to authenticate the user for any subsequent API requests. The generated access token
  expires after 1 hour after which refresh token can be used to generate a new pair of access & refresh token. The refresh tokens never expire so that users don't have to re-login.

### Authentication

- Whenever user wants to make an authenticated request, they send their `access token` in the `Authorization` request header. All the requests are always made to the gateway service.
  The `gateway service` takes this Authorization header and fetches the user data from `user service`. If the user doesn't exist on user service, then the request is denied with a `401` status code. Otherwise, the request along with user data is passed on to the target (user/tracking) service.

### Profile Page

![Profile Page](https://github.com/chirgjin/track-my-events/raw/main/documentation/images/Profile.png)

- The user data is already stored in the user table.
- The user can update either their `name` or `password`
  - If user wants to update their password then we verify the existing hash with the provided `current password`

### Events

#### Pub/Sub

After initialization, a pub/sub subscription is created: `SUBSCRIBE events`. For simplicity, each message in pub/sub is serialized to JSON.

Pub/sub allows distributing the load among multiple servers and a layer between the APIs & the primary redis where we store event data. This is done so that the data is initally sent into the pub/sub and then consumed by tracking service in the background to avoid write bottlenecks.

How the data is stored:

- The event data is first sent to pub/sub with the following keys:

  - `apiKey`: apiKey of the tracking system's user who wants to track this event
  - `sessionId`: a random id generated on frontend by the SDK for tracking sessions of the users
  - `userId`: a user id provided by the SDK user. This user id usually comes from the client's system. If a user id isn't provided then we generate a temporary one so that we can identify the users.
  - `eventTime`: Timestamp in milliseconds when the event occurred
  - `page`: Url of the page on which this event occurred
  - `referrer`: Optionally, url of the page which referred this user
  - `context`: An arbitary JSON object which can contain any key-value pair. This is used to store custom data

- When consuming data from pub/sub subscription, the API key is first verified with the user service.

  - If a valid user exists with the given API key then the event data is stored in the Event table.
  - Otherwise this event is logged & ignored.

## How to run it locally?

### Prerequisites

- Node - v16.15.0
- Yarn - v1.22.18
- Redis Server
- PostgreSQL Server

### Local installation

- Go to `services/user-service` (`cd ./services/user-service`) and then:

```bash
yarn install
# copy file and set proper data inside
cp .env.example .env

yarn dev
```

- Go to `services/tracking-service` (`cd ./services/tracking-service`) and then:

```bash
yarn install
# copy file and set proper data inside
cp .env.example .env

# run both these commands in separate terminals
yarn dev
yarn ts:subscriber
```

- Go to `services/gateway` (`cd ./services/gateway`) and then:

```bash
yarn install
# copy file and set proper data inside
cp .env.example .env

yarn dev
```

- Go to `frontend` (`cd ./frontend`) and then:

```bash
yarn install
# copy file and set proper data inside
cp .env.example .env

yarn start
```
