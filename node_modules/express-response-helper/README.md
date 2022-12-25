# express-response-helper
[![Build Status](https://travis-ci.com/isoteriktech/express-response-helper.svg?branch=main)](https://travis-ci.com/isoteriktech/express-response-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/isoteriktech/express-response-helper/blob/main/LICENSE)

A simple response helper for ExpressJS applications.

# About
This module was inspired by code igniter's **API Response Trait**. It can be used in your ExpressJS applications to make common response types simple, with no need to remember which HTTP status code should be returned for which response types.

# Getting Started
Install it as an npm module and save it to your package.json file:
```
npm install express-response-helper --save
```
or using yarn (if you have it):
```
yarn add express-response-helper
```
Once installed, it can now be referenced by simply calling `require('express-response-helper');`

# Example
Calling `require('express-response-helper');` returns an object with two properties. One is a function that returns a middleware that you can simply attach to your express object or an express route. This is the property that you'll often use:

```javascript
const responseHelper = require('express-response-helper').helper();
const express = require('express');

const app = express();

// attach the middleware before any route definition
app.use(responseHelper);

app.get('/user', function(req, res) {
  // The usual way (without express-response-helper)
  // res.status(200).json({ name: 'john' });

  // But with express-response-helper;
  res.respond({ name: 'john' });
});

app.get('/404', function(req, res) {
  // The usual way (without express-response-helper)
  // res.status(404).send('Resoure Not Found');

  // But with express-response-helper;
  res.failNotFound('Resoure Not Found');

  // This returns a response like this:
  /*
    {
      "status": 404,
      "error": "404",
      "messages": "Resoure Not Found"
    }
  */
});
```
Notice how we didn't have to specify the HTTP status codes for each of our responses. With express-response-helper, you don't have to remember the status code to use, just the context of the response. Cool!

# API
The module returns an object with these properties:
- `helper()`: This is a function that returns the middleware to `use()` on your express object.
- `responseCodes`: This is an object that holds the common HTTP status codes that the module currently uses internally. You can use this object to modify the predefined status codes. You usually don't have to modify these codes but if your specific application requires you to, it's possible.

Example:
```javascript
const responseHelper = require('express-response-helper');
const express = require('express');

const app = express();

// Modify the status code for 'created' response
const codes = responseHelper.responseCodes;
codes.created = 200; // originally 201

// use the middleware
app.use(responseHelper.helper());

app.post('/user', function(req, res) {
  // returns status code 200 instead of 201
  res.respondCreated(null, 'User Account Created');
});
```
<br></br>
The middleware returned by `helper()` adds the following functions to the `response`(or res) parameter passed to your routes:

**.respond([data] [, status] [, message])**: This function is a generic function for any kind of response. All the parameters are optional: 
  - `data` is null by default and will be returned as the response body (as json) if set to a non-null value.
  - `status` is the HTTP status code and is 200 by default.
  - `message` is an empty string by default. It will be returned as the response body if `data` is null.

Example:
```javascript
app.post('/user', function(req, res) {
  res.respond({ name: 'john' }, 200);
});
```
<br></br>
**.fail(messages [, status] [, code])**: This function is a generic function for responses that generally indicate errors. All but one parameters are optional:
  - `messages` can be a string, an object or an array of error messages indicating what went wrong. This parameter is the only required parameter.
  - `status` is the HTTP status code and is 400 by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
This function internally generate a json response body in the following format. For example, when `messages` is a string, `status` is 400 and `code` is null, the response looks like:
```json
{
  "status": 400,
  "error": "400",
  "messages": "Error Message"
}
```
and when `messages` is an array:
```json
{
  "status": 400,
  "error": "400",
  "messages": [
    "Error 1", "Error 2", "Error 3"
  ]
}
```
A future version will allow modifying this response structure but currently there is no way to change it.

Example:
```javascript
app.get('/blah', function(req, res) {
  res.fail('Not Found', 404, 'unknown-route');
});
```
<br></br>
**.respondCreated([data] [, message])**: Returns a response with a status code of 201 by default. Useful for responses that confirms the creation of a resource. All the parameters are optional: 
  - `data` is null by default and will be returned as the response body (as json) if set to a non-null value.
  - `message` is an empty string by default. It will be returned as the response body if `data` is null.

Example:
```javascript
app.post('/user', function(req, res) {
  res.respondCreated(null, 'Account Created.');
});
```
<br></br>
**.respondDeleted([data] [, message])**: Returns a response with a status code of 200 by default. Useful for responses that confirms the removal of a resource. All the parameters are optional: 
  - `data` is null by default and will be returned as the response body (as json) if set to a non-null value.
  - `message` is an empty string by default. It will be returned as the response body if `data` is null.

Example:
```javascript
app.delete('/user/1', function(req, res) {
  res.respondDeleted(null, 'User Removed.');
});
```
<br></br>
**.respondUpdated([data] [, message])**: Returns a response with a status code of 200 by default. Useful for responses that confirms the modification of a resource. All the parameters are optional: 
  - `data` is null by default and will be returned as the response body (as json) if set to a non-null value.
  - `message` is an empty string by default. It will be returned as the response body if `data` is null.

Example:
```javascript
app.put('/user', function(req, res) {
  res.respondUpdated(null, 'User Updated.');
});
```
<br></br>
**.respondNoContent()**: Returns a response with a status code of 204 by default. Useful for responses that confirms the successful execution of a command by the server but there is no meaningful reply to send back to the client.

Example:
```javascript
app.post('/clear_logs', function(req, res) {
  res.respondNoContent();
});
```
<br></br>
**.failUnauthorized([description] [, code])**: Returns a response with a status code of 401 by default. Useful when the client either has not been authorized, or has incorrect authorization. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Unauthorized** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/secret', function(req, res) {
  res.failUnauthorized('Access Denied.');
});
```
<br></br>
**.failForbidden([description] [, code])**: Returns a response with a status code of 403 by default. Useful when the requested API endpoint is never allowed. Unauthorized implies the client is encouraged to try again with different credentials. Forbidden means the client should not try again because it won’t help. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Forbidden** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/forbidden', function(req, res) {
  res.failForbidden("Don't go there!");
});
```
<br></br>
**.failNotFound([description] [, code])**: Returns a response with a status code of 404 by default. Useful when the requested resource cannot be found. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Not Found** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/user/2', function(req, res) {
  res.failNotFound('User not found.');
});
```
<br></br>
**.failValidationError([description] [, code])**: Returns a response with a status code of 400 by default. Useful when data the client sent did not pass validation rules. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Bad Request** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.post('/user', function(req, res) {
  res.failValidationError('Invalid data.');
});
```
<br></br>
**.failResourceExists([description] [, code])**: Returns a response with a status code of 409 by default. Useful when the resource the client is trying to create already exists. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Conflict** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.post('/user', function(req, res) {
  res.failResourceExists('User Exists!');
});
```
<br></br>
**.failResourceGone([description] [, code])**: Returns a response with a status code of 410 by default. Useful when the requested resource was previously deleted and is no longer available. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Gone** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/user', function(req, res) {
  res.failResourceGone('User no longer exist!');
});
```
<br></br>
**.failTooManyRequests([description] [, code])**: Returns a response with a status code of 429 by default. Useful when the client has called an API endpoint too many times. This might be due to some form of throttling or rate limiting. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Too Many Requests** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/data', function(req, res) {
  res.failTooManyRequests();
});
```
<br></br>
**.failServerError([description] [, code])**: Returns a response with a status code of 500 by default. Useful when there is a server error. All parameters are optional:
  - `description` can be a string, an object or an array of error messages indicating what went wrong. The value is **Internal Server Error** by default.
  - `code` can be used to specify a custom error code (it doesn't have to be a number). When it is null, the `status` code will be used (as a string). It is null by default.
  
Example:
```javascript
app.get('/user', function(req, res) {
  res.failServerError('Internal Server Error');
});
```
<br></br>
**.json(data)**: parses `data` as JSON and returns it as the response body. This function is only defined for non-express apps (where the function is not already defined). Note that this won't override already defined function with the same name. This allow you define your own json function or use the one defined in another middleware. This makes the module usable in normal nodejs apps that don't use express.

<br></br>
The object property, `responseCodes`, returned by the modules has these properties with predefined status codes and descriptive names:

| Property                  | HTTP Status Code |
|---------------------------|------------------|
| created                   | 201              |
| deleted                   | 200              |
| updated                   | 200              |
| no_content                | 204              |
| invalid_request           | 400              |
| unsupported_response_type | 400              |
| invalid_scope             | 400              |
| invalid_grant             | 400              |
| invalid_credentials       | 400              |
| invalid_refresh           | 400              |
| no_data                   | 400              |
| invalid_data              | 400              |
| access_denied             | 401              |
| unauthorized              | 401              |
| invalid_client            | 401              |
| forbidden                 | 403              |
| resource_not_found        | 404              |
| not_acceptable            | 406              |
| resource_exists           | 409              |
| conflict                  | 409              |
| resource_gone             | 410              |
| payload_too_large         | 413              |
| unsupported_media_type    | 415              |
| too_many_requests         | 429              |
| server_error              | 500              |
| unsupported_grant_type    | 501              |
| not_implemented           | 501              |
| temporarily_unavailable   | 503              |

<br></br>
You can add to or modify the predefined values. Structuring the codes this way means you don't have to remember the status codes everytime you need them, you use context to decide which code to use.

Example:
```javascript
const responseHelper = require('express-response-helper');
const express = require('express');

const app = express();

// get the codes
const codes = responseHelper.responseCodes;

// use the middleware
app.use(responseHelper.helper());

app.get('/unavailable', function(req, res) {
  res.fail('Undergoing Routine Maintenance', codes.temporarily_unavailable);
});
```
<br></br>
# Changelog
Check the [GitHub Releases page](https://github.com/isoteriktech/express-response-helper/releases).

<br></br>
# Reporting Issues
Use the [Issue Tracker](https://github.com/isoteriktech/express-response-helper/issues) on GitHub to report issues.

<br></br>
# Contributing
Contributions are highly welcomed. Have features you want to add or bugs that you can fix? Head on to the [github repo](https://github.com/isoteriktech/express-response-helper) to make changes and create pull requests. Thank you in advance!

<br></br>
# License
[MIT License](http://opensource.org/licenses/mit-license.html)
