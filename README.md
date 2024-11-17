![Coingecko API](Coingecko_API.png)

## Features

- Allows investors to request the latest price of a specific cryptocurrency and receive a formatted email with the current
  price.
- Integrates with the Coingecko API to fetch live prices and includes validation and error handling to ensure accurate, user-friendly responses.
- Tracks and stores all cryptocurrency price queries in DynamoDB, providing a historical record of user requests.

## Tech

Coingecko API is built with the following technologies:

- **[Node.js]** - A runtime environment for executing JavaScript on the server, enabling efficient backend logic and integration with external services.
- **[JavaScript]** - Core programming language for building the client logic.
- **[AWS Lambda]** - A serverless computing service used to run backend logic in a scalable, event-driven environment without managing servers.
- **[APIGATEWAY]** - A managed service that enables seamless routing and integration of HTTP requests to AWS Lambda functions, providing a secure entry point for API requests.
- **[CICD]** - Continuous Integration and Continuous Deployment pipelines to ensure code quality, consistency, and automated deployment.
- **[DynamoDB]** - A fully managed NoSQL database service that provides fast and predictable performance with seamless scalability, ideal for storing and querying large amounts of data.
- **[Coingecko API]** - A cryptocurrency data platform that provides comprehensive data on thousands of cryptocurrencies, including live prices, historical data, and market trends.

## API Documentation

For requests to be successful, they must include a valid token. The token is used to authenticate the user and ensure that the request is coming from a trusted source. Use it in the [token] parameter in the request body.

## USER CASE 1: Price Request && Email Notification

```sh
//Endpoint
GET https://jqvvahprci.execute-api.ap-southeast-2.amazonaws.com/v1/email
```

Query Parameters:

- cryptoId (required): The ID of the cryptocurrency for which the user wants to request the price. (Example: bitcoin, ethereum)
- token (required): The API access token provided by me.
- email (required): The email address where the price information should be sent.

```sh
//Sample Request
https://jqvvahprci.execute-api.ap-southeast-2.amazonaws.com/v1/email?cryptoId=bitcoin&token=FAKETOKEN&email=xxxxxxx@gmail.com

```

## USER CASE 2: Historical Record Request

```sh
//Endpoint
GET https://jqvvahprci.execute-api.ap-southeast-2.amazonaws.com/v2/getSearchLog
```

Query Parameters:

- token (required): The API access token provided by me.

```sh
//Sample Request
https://jqvvahprci.execute-api.ap-southeast-2.amazonaws.com/v2/getSearchLog?token=FAKETOKEN

```

## License

MIT
