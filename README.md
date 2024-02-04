# Socket.IO Logger Service

A Socket.IO server that logs updates to a file and notifies connected clients.

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/rohity0/Logger.git
    ```

2. **Install dependencies:**

    ```bash
    cd your-repository
    npm install
    ```

3. **Create a `.env` file in the project root and set environment variables:**

    ```env
    PORT=3001
    ```

4. **Start the server:**

    ```bash
    npm start
    ```

    The server will run at http://localhost:3001.

## Usage

- Connect to the Socket.IO server from your client application.
- The server listens for changes to the "log.txt" file and sends updates to connected clients.

## Configuration

- Modify the `allowedOrigins` array in the `index.js` file to add or remove CORS origins.

## File Structure

- `index.js`: Main server file.
- `log.txt`: Log file that gets updated.


## License

This project is licensed under the [MIT License](LICENSE).
