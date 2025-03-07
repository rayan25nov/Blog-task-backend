# Backend Project

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This is a backend project built with Node.js, Express.js, TypeScript, and MongoDB. It includes user authentication, blog management, and image upload functionalities.

## Features

- User authentication (signup, signin, logout)
- Blog management (create, read, update, delete)
- Image upload using Cloudinary
- API documentation with Swagger

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd backend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Build the project:
    ```sh
    npm run build
    ```
2. Start the server:
    ```sh
    npm start
    ```
3. For development mode:
    ```sh
    npm run dev
    ```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=5000
DB_CNN=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
SERVER_URL=your_server_url
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.