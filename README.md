# Recipe Project

A web application for managing and sharing recipes, built with React, Node.js, and PostgreSQL.

## Prerequisites

Before you begin, ensure you have the following installed:
- [VS Code](https://code.visualstudio.com/) (Recommended IDE)
- [Node.js and NPM](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)
- [Github Desktop](https://desktop.github.com/) (Optional, but recommended for easier merge conflict resolution)

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nacochran/recipe-project.git
cd recipe-project
```

### 2. Database Setup

1. Open PostgreSQL and login using:
```bash
psql -U your_username
```

2. Create a new database named `recipe_db`:
```sql
CREATE DATABASE recipe_db;
```

3. Import the database schema (contact project maintainers for the latest schema file)
```bash
\i path/to/main.sql
```

### 3. Environment Configuration

1. Create a `.env` file in the root directory with the following variables:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=recipe_db
```

Note: Additional environment variables may be required. Please contact the project maintainers for the complete list of required variables.

### 4. Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The backend server will start on port 5000.

### 5. Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Development Notes

- The project uses `.gitignore` to exclude sensitive files and directories:
  - `node_modules/` (dependency files)
  - `.env` (environment variables)
  - SQL files (database structure)
- We use ESLint for code linting
- The backend runs on port 5000
- The frontend runs on port 3000 using Vite

## Troubleshooting

If you encounter npm permission issues when running `npm -v`, please contact the project maintainers for debugging assistance.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## Contact

For additional environment variables or technical support, please contact the project maintainers.
