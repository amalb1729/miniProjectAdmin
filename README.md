# Student Store - Admin UI

This is the administrative dashboard for the Student Store application. It provides a user interface for store managers to perform administrative tasks.

## Features

*   View sales and user statistics on a central dashboard.
*   Manage products (Create, Read, Update, Delete).
*   View and manage customer orders.
*   View and manage registered users.

## Technology Stack

*   **Framework**: React
*   **Routing**: React Router
*   **API Communication**: Fetch API
*   **Styling**:  CSS

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/)

## Getting Started

1.  **Navigate to the directory**
    From the root of the `studentStore` project, `cd admin-ui`.

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in this directory and add the URL for the backend API.
    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4.  **Run the Development Server**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3001`.

