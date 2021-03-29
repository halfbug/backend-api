# Hopeaccelerated API

> Backend API for Hopeaccelerated application, which is a bootcamp directory website

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Demo

The API is live at [hopeaccelerated-backend](https://hopeaccelerated-backend.heroku.com)

Extensive documentation with examples [here](https://hopeaccelerated-backend.heroku.com/doc)

- Version: 1.0.0
- License: MIT
- Author: Sadaf Siddiqui

- Wallet APIs Document
  -> Directory and file structure is same as of other features
  -> It make use of Wallet, Attachment and User models
  -> Attachment APIs related to wallet uses this "ATTACHMENT_UPLOD_PATH" constant from config.env file

```
Description: API to upload single file / attachment
Route: /api/v1/attachment/upload
Accessiblity: Authorized
Request Method: POST
Request Headers: Content-Type: multipart/form-data; boundary=<calculated when request is sent>
Request Body: 
{
    file: << attach the binary file >>  | Mandatory
    relatedTo: << random value in String >> | Mandatory
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to upload multiple kyc documents. User details will be fetched from the authorization token 
Route: /api/v1/attachment/upload/kyc
Accessiblity: Authorized
Request Method: POST
Request Headers: Content-Type: multipart/form-data; boundary=<calculated when request is sent>
Request Body: 
Request Body: 
{
    file: << attach one or more binary files >>  | Mandatory
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to view / download the file 
Route: /api/v1/attachment/view/:id
Accessiblity: Authorized
Request Method: GET
Request Body: No
Request Headers: No
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to verify the KYC document. This API will be used by the Administrator to verify the KYC documents of the User and also to create the Wallet of this particular User. User details will be fetch from the provided id in the query params.
Route: /api/v1/kyc/doc/verify/:id
Accessiblity: Private/Admin
Request Query Params: id (User id)
Request Method: PUT
Request Headers: Content-Type: application/json
Request Body: {
    "token": << String >> | Mandatory,
    "appId": << String >> | Mandatory,
    "balance": << String >> | Mandatory,
    "balanceCurrency": << String >>  | Mandatory,
    "action": << Array of String >> | Mandatory i-e ["cashout","exchange","send"]
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: Get wallet of the User. User will be fetched from the authorization token 
Route: /api/v1/user/wallet
Accessiblity: Authorized ()
Request Method: GET
Request Headers: No
Request Body: No
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to update the Wallet balance of the User. User will be fetched from the authorization token 
Route: /api/v1/user/wallet/update/balance
Accessiblity: Private/Admin
Request Params: id (User id)
Request Method: PUT
Request Headers: Content-Type: application/json
Request Body: {
    "token": << String >> | Mandatory,
    "appId": << String >> | Mandatory,
    "balance": << String >> | Mandatory,
    "balanceCurrency": << String >>  | Mandatory,
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```


- Push Notifications APIs Document
  -> Directory and file structure is same as of other features
  -> It make use of User, Roles and RolesProfile models
  -> Push Notifications APIs uses this "PUSHY_SECRET_API_KEY_BIG_MUDI", "PUSHY_SECRET_API_KEY_BLOCK_ED", "PUSHY_SECRET_API_KEY_BLOCK_RIDE",
  "PUSHY_SECRET_API_KEY_BLOCK_MED", "PUSHY_SECRET_API_KEY_BLOCK_M" constants from config.env file

```
Description: API to notify the user about its wallet is created
Route: /api/v1/notification/wallet/created
Accessiblity: Admin User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "userId": << Table Id of the User>>  | (Mandatory),
    "notificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify all the customers the stock is re-filled
Route: /api/v1/notification/customer/refill/stock
Accessiblity: Admin User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "notificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the customer / seller that instant message is sent / received
Route: /api/v1/notification/customer/seller/instant/message
Accessiblity: Authorized User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "senderId": << Table Id of the User with Seller role or Customer role >>  | (Mandatory),
    "receiverId": << Table Id of the User with the Seller role or Customer role >>  | (Mandatory),
    "senderNotificationMessage": << Random Message >> | (Mandatory)
    "receiverNotificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the teacher / student that instant message is sent / received
Route: /api/v1/notification/teacher/student/instant/message
Accessiblity: Authorized User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "senderId": << Table Id of the User with Teacher role or Student role >>  | (Mandatory),
    "receiverId": << Table Id of the User with the Teacher role or Student role >>  | (Mandatory),
    "senderNotificationMessage": << Random Message >> | (Mandatory)
    "receiverNotificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the seller that your customer sents you the payment
Route: /api/v1/notification/customer/seller/payment/sent
Accessiblity: Authorized User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "sellerId": << Table Id of the User with Seller role >>  | (Mandatory),
    "notificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the seller that your customer made the Purchase
Route: /api/v1/notification/customer/purchase/made
Accessiblity: Authorized User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "sellerId": << Table Id of the User with Seller role >>  | (Mandatory),
    "notificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the doctor / patient that instant message is sent / received
Route: /api/v1/notification/doctor/patient/instant/message
Accessiblity: Authorized User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "senderId": << Table Id of the User with Doctor role or Patient role >>  | (Mandatory),
    "receiverId": << Table Id of the User with the Doctor role or Patient role >>  | (Mandatory),
    "senderNotificationMessage": << Random Message >> | (Mandatory)
    "receiverNotificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```

```
Description: API to notify the all the Students that free Course is available
Route: /api/v1/notification/student/free/course
Accessiblity: Admin User
Request Method: POST
Request Headers: Content-Type: application/json
Request Body: 
{
    "notificationMessage": << Random Message >> | (Mandatory)
}
Success Response:
{
  "data": {
    "statusCode": 201,
    "message": ""
  }
}
or
Validation Error Response: 
{
  "data": {
    "statusCode": 400,
    "message": ""
  }
}
Fail Response: 
{
    "success": false,
    "error": ""
}
```