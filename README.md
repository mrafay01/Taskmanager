# Task Manager

This Project is made using Next.js, TypeScript, TailwindCSS and MongoDB

## Setup

1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd taskmanager
npm install
```

2. Create a `.env.local` file in the project root

```
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=taskmanager
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` Task manager to add, edit, delete and complete tasks
- `/github` GitHub profile search using the GitHub REST API

## Database Schema

Database: `taskmanager`, Collection: `tasks`

| Field       | Type     | Required | Default    | Description                    |
| ----------- | -------- | -------- | ---------- | ------------------------------ |
| `_id`       | ObjectId | Auto     | Generated  | Unique task ID                 |
| `title`     | String   | Yes      |            | Task title (trimmed)           |
| `completed` | Boolean  | No       | `false`    | Whether the task is completed  |
| `createdAt` | Date     | Auto     | Now        | When the task was created      |
| `updatedAt` | Date     | Auto     | Now        | When the task was last updated |

Example document:

```json
{
  "_id": "6ad9e8c57c6f90502342b167",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-10-22T10:43:17.449Z",
  "updatedAt": "2026-10-22T10:43:17.449Z"
}
```

## API Integration

### API Used

[GitHub REST API](https://docs.github.com/en/rest) (`https://api.github.com`)

- `GET /users/{username}` for the user profile
- `GET /users/{username}/repos` for the user's repositories

### Implementation

The `/github` page lets users search for any GitHub username. Instead of calling GitHub directly from the browser, the page sends the request to a Next.js route handler at `/api/github/[username]`. The route fetches the user's profile and their 6 most recently updated repositories from GitHub in parallel, then returns only the fields the UI needs.

The page displays the user's avatar, name, location, bio, follower and repository counts, along with cards for each repository showing its description, language, stars and forks. It handles loading states, unknown users (404) and GitHub rate limits (429). Keeping the request on the server also means an optional `GITHUB_TOKEN` can be added to raise the rate limit without exposing it to the browser.

### Screenshot

![GitHub profile search](screenshots/github-integration.png)

### Commit

[`a4c373a` Add GitHub profile search using the GitHub REST API](https://github.com/mrafay01/Taskmanager/commit/a4c373a)

## API Endpoints

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/tasks`            | Get all tasks           |
| POST   | `/api/tasks`            | Create a task           |
| PUT    | `/api/tasks/:id`        | Update a task           |
| DELETE | `/api/tasks/:id`        | Delete a task           |
| GET    | `/api/github/:username` | Get a GitHub user profile and repositories |
