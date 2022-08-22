# Tracking System

An event tracking system built on microservices architecture using Redis Stack as the primary database & communication mechanism (pub/sub) for backend & React for frontend.

![Login Page](./documentation/images/Login.png)
![Register Page](./documentation/images/Register.png)
![Profile Page](./documentation/images/Profile.png)
![Setup Page](./documentation/images/Setup.png)

<!-- # Overview video (Optional)

Here's a short video that explains the project and how it uses Redis:

[Insert your own video here, and remove the one below]

[![Embed your YouTube video](https://i.ytimg.com/vi/vyxdC1qK4NE/maxresdefault.jpg)](https://www.youtube.com/watch?v=vyxdC1qK4NE) -->

## How it works

### Services

There are 3 services in tracking system:

#### 1. Gateway

This service is responsible for routing API requests to all the other services. Frontend always communicates with this server and never directly with any other service.
Gateway also authenticates every request to tracking service via user service.

#### 2. User Service

This service is responsible for storing & authenticating users.

##### Database Schema

1. User

```ts
class User extends Entity {
  public name: string
  public email: string
  public password: string
  public apiKey: string
  public createdAt: Date
  public updatedAt: Date | null
}
```

2. Access Token

```ts
class AccessToken extends Entity {
  public userId: string
  public token: string
  public expiresOn: Date
  public createdAt: Date
}
```

3. Refresh Token

```ts
class AccessToken extends Entity {
  public userId: string
  public token: string
  public createdAt: Date
}
```

#### 3. Tracking Service

This service is responsible for storing event data & then inferring analytics from it.

##### Database Schema

1. Event

```ts
class Event extends Entity {
  public internalUserId: string // id of our internal user to which this event is linked to

  public sessionId: string
  public eventTime: Date
  public eventName: string
  public page: string
  public referrer: string | null
  public _context: string // redisJSON doesn't support objects, so we store context in string form
  public userId: string // id of user where the tracking is being done. If user doesnt exist then a temp id is generated
  public userAgent: string | null
  public createdAt: Date
}
```

### How the data is stored:

### How the data is accessed:

Refer to [this example](https://github.com/redis-developer/basic-analytics-dashboard-redis-bitmaps-nodejs#how-the-data-is-accessed) for a more detailed example of what you need for this section.

## How to run it locally?

[Make sure you test this with a fresh clone of your repo, these instructions will be used to judge your app.]

### Prerequisites

[Fill out with any prerequisites (e.g. Node, Docker, etc.). Specify minimum versions]

### Local installation

[Insert instructions for local installation]

## Deployment

To make deploys work, you need to create free account on [Redis Cloud](https://redis.info/try-free-dev-to)

### Google Cloud Run

[Insert Run on Google button](https://cloud.google.com/blog/products/serverless/introducing-cloud-run-button-click-to-deploy-your-git-repos-to-google-cloud)

### Heroku

[Insert Deploy on Heroku button](https://devcenter.heroku.com/articles/heroku-button)

### Netlify

[Insert Deploy on Netlify button](https://www.netlify.com/blog/2016/11/29/introducing-the-deploy-to-netlify-button/)

### Vercel

[Insert Deploy on Vercel button](https://vercel.com/docs/deploy-button)
