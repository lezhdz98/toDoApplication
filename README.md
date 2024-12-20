# Breakable Toy: To Do App

This is my first Breakable Toy for the Spark Program at Encora.

## Overview

This application is a To Do app where you can create, read, update, and delete tasks. It also provides average time metrics for the tasks.

## Features

- **Create**: Add new tasks.
- **Read**: Display a list of tasks with filtering options.
- **Update**: Modify existing tasks.
- **Delete**: Remove tasks.
- **Average Time Metrics**: View average time metrics for tasks, including breakdowns by priority (high, medium, low).

## Architecture

### Database

The data is stored in memory using Java collections (HashMap).

### API (Backend)

The backend is built with Java using Spring Boot and Maven. It handles CRUD operations and communicates with the in-memory database.

### User Interface (Frontend)

The frontend is built with React, TypeScript, and React Context. It includes:

- A search component to filter tasks by name, priority, and status (done/undone).
- A button to create new tasks.
- A table displaying tasks with options to update or delete them, and sorting capabilities by priority or status.
- A section to view average time metrics in minutes for all tasks and by priority.

## Setting up the Project

### Required Technologies

- **Java 11** or higher
- **Maven 3.6** or higher
- **Node.js 14** or higher
- **npm 6** or higher

### 1. Clone the Repository

Download the project from the website or clone the repository to your desired folder:

```bash
git clone https://github.com/username/project.git
cd project
```

### 2. Backend Setup

Access the backend folder from the terminal:

```bash
cd Backend
```

Build the project with Maven:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

### 3. Frontend Setup

Access the frontend folder from the terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

The frontend runs on http://localhost:8080
