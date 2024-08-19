# MongoBank (MBank)

## About the Project

This project was created for study purposes. It is a simple banking application built with Node.js, Koa, MongoDB and GraphQL. The application allows to create accounts, log in securely, check their balance, transfer funds between accounts, and view their transaction history.

## Features

- Account creation
- Secure login and authentication
- Balance inquiries
- Fund transfers between accounts
- Transaction history
- Support for multiple currencies

## Getting Started

1. Clone the repository and navigate to the project folder:

    ```bash
    git clone https://github.com/EliasGcf/mbank.git && cd mbank
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Running the sever

    3.1 Access the server folder:

      ```bash
      cp apps/server
      ```

    3.2 Create a `.env` file:

      ```bash
      cp .env.example .env
      ```

      Fill in the environment variables with your own values.

    3.3 Start the server:

      ```bash
      npm run dev
      ```

4. Running the client

    4.1 Access the client folder:

      ```bash
      cp apps/web
      ```

    4.2 Create a `.env` file:

      ```bash
      cp .env.example .env
      ```

    4.3 Start the web:

      ```bash
      npm run dev
      ```

## Usage

Once the application is running, you can access it via `http://localhost:5173`. Register for a new account or log in with your existing credentials.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

All feedback is welcome! If you have any questions, suggestions, or anything else, my LinkedIn profile is [Elias Gabriel](https://www.linkedin.com/in/eliasgcf/).
