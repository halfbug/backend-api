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

```
Description: API to upload single file / attachment
Route: /api/v1/attachment/upload
Accessiblity: Authorized
Request Method: POST
Request Headers: Content-Type: multipart/form-data; boundary=<calculated when request is sent>
Request Body: 
{
    file: Data Type (Binary file) Mandatory to set
    relatedTo: Data Type (String) Mandatory to set
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
{
    file: Data Type (Binary file) Mandatory to set
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
    "token": Data Type (String) Mandatory to Set,
    "appId": Data Type (String) Mandatory to Set,
    "balance": Data Type (String) Mandatory to Set,
    "balanceCurrency": Data Type (String) Mandatory to Set,
    "action": Data Type (Array of String) Mandatory to Set i-e ["cashout","exchange","send"]
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
    "token": Data Type (String) Mandatory to Set,
    "appId": Data Type (String) Mandatory to Set,
    "balance": Data Type (String) Mandatory to Set,
    "balanceCurrency": Data Type (String) Mandatory to Set
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