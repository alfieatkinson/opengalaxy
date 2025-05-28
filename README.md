<div align="center">
    <a href="https://opengalaxy.alfieatkinson.dev"><img src="img/opengalaxy-hero.png" alt="OpenGalaxy" width="480" /></a>
    <p>A full-stack web application for browsing and managing open-license media.</p>
</div>

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" alt="react logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" height="40" alt="nextjs logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" height="40" alt="tailwindcss logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="40" alt="python logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" height="40" alt="django logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" height="40" alt="postgresql logo"  />
    <img width="12" />
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="40" alt="docker logo"  />
</div>

---

## Table of Contents

---

## Overview

**OpenGalaxy** is a full-stack web app built for discovering, searching, and curating Creative Commons licensed media. It fetches media from the [Openverse API](https://api.openverse.org/v1/) and offers users personalisation through accounts, favourites, and search history. This project is submitted in partial fulfilment of the Degree of **Master of Science in Computer Science**.

<img height="12" />
<div align="center">
    <img src="img/mockups/landing-mixed.png" />
</div>

---

## Tech Stack

- **Frontend:** [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/)
- **Backend:** [Python](https://www.python.org/), [Django](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/), [Redis](https://redis.io/)

---

## Tooling

- **Authentication:** [JWT](https://jwt.io/) (HttpOnly cookies)
- **CI/CD & Deployment:** [Pre-commit](https://pre-commit.com/), [Husky](https://typicode.github.io/husky/#/), [Vercel](https://vercel.com/), [Heroku](https://www.heroku.com/)
- **Linting & Formatting:** 
[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [flake8](https://flake8.pycqa.org/), [Black](https://black.readthedocs.io/)
- **Testing:** [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/)

## Getting Started

### Prerequisites

- Docker and Docker Compose installed (v2+ recommended)
- Make sure ports `3000` (frontend), `8000` (backend), `5432` (PostgreSQL), and `6379` (Redis) are free.

### Running with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/alfieatkinson/opengalaxy.git
cd opengalaxy
```

2. Create an `.env` file in the root with your own Openverse API credentials using `.env.example` as a guide:

```ini
PROJECT_NAME=OpenGalaxy

NEXT_PUBLIC_BACKEND_API_URL=http://backend:8000/

DJANGO_ALLOWED_HOSTS=localhost,127.0.1,backend,frontend
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000

POSTGRES_DB=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
DATABASE_HOST=db
DATABASE_PORT=5432

REDISCLOUD_URL=redis://redis:6379/1

OPENVERSE_API_URL=https://api.openverse.org/v1/
OPENVERSE_CLIENT_ID=YOUR_OPENVERSE_CLIENT_ID
OPENVERSE_CLIENT_SECRET=YOUR_OPENVERSE_CLIENT_SECRET
```

3. Build and start everything:

```bash
docker compose up --build
```

4. The following services should now be live:

- Frontend: [https://localhost:3000](https://localhost:3000)
- Backend API: [https://localhost:8000](https://localhost:8000)

To stop everything:

```bash
docker compose down
```

## Running Tests

All tests can be run using the tests script:

```bash
./run-tests.sh
```

### Cypress E2E Tests

To run Cypress tests in the console:

```bash
docker compose exec <frontend-container-id> npm run cypress
```

To open Cypress for visual E2E testing:

```bash
docker compose exec <frontend-container-id> npm run cypress:open
```

## Project Structure

```bash
.
├── backend/            # Django REST API
├── docs/               # System design & SRS docs
├── frontend/           # Next.js frontend
├── img/                # Project images 
├── docker-compose.yml  # Docker compose config
├── README.md           # What you are reading right now!
├── run-tests.sh        # Script to run all tests
├── toggle-dynos.sh     # Script to toggle Heroku dynos
└── tree.txt            # Full project tree
```

See `docs/` for initial architecture diagrams, data flow models, and more.

## Contributing

Contributions are welcome!

If you'd like to fork the project and add features, fix bugs, or improve the documentation, feel free to open a pull request.

### Steps to Contribute

1. **Make an issue first (recommended):**
    - If you are planning to work on a bug or new feature, please [open an issue](https://github.com/alfieatkinson/opengalaxy/issues/new/choose) first.
    - Opening an issue helps avoid duplicate work and gives a chance to discuss your idea or approach.
    - Use the appropriate issue template — "Feature Request" or "Bug Report" — to keep things clear.
2. Fork the repository.
3. Create a new branch: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-fix-name`
4. Make your changes and commit them with clear messages.
5. Push to your fork: `git push origin feature/your-feature-name` or `git push origin fix/your-fix-name`
6. Open a pull request to the `main` branch of this repository.

Please follow the existing coding style and include tests where appropriate.

If you're unsure where to start, feel free to open an issue or discussion first.

## License

This project is open-source under the [MIT License](./LICENSE).