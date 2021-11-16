# Sample Wallet API

## Features

* Authentication
  * Login [Public]
  * SignUp [Public]
  * Tokens [User]
* Password Management
  * Change Password [User]
  * Forgot Password [Public]
  * Reset Password  [Public]
  * Hashed password
* Email Management
  * Send Email Verification [User]
  * Send welcome email with a greeting balance of 1000 EGP
  * Send email to the user who is receiving the money with the transaction details
  * Send email to the user who is sending the money with the transaction details
  * No Spam emails
* Transaction
  * Transfer balance between users [User]
  * Get All Transaction [Admin]
    * Filters fields we need, for better performance.
    * Pagination
    * Sorting by date in descending order

## Usage

### Env Variables

Create a config/dev.env file in then root and add the following

```
NODE_ENV=development
PORT=8080
DATABASE_STRING=<your mongodb uri> 
SENDGRID_API_KEY=<your sendGrid key>
JWT_SECRET='abc123'
EMAIL_FROM=<you email handle>
```

### Install Dependencies

```
npm install
```

### Run

```
npm run dev
```

```
Sample User Logins

admin@example.com (Admin)
01111111111
Red12345!

01117323901 (User)
huseinm946@gmail.com
Red12345!

01117323888 (User)
Red12345!
```
