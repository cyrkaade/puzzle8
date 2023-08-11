# sherlck

sherlck is an advanced AI-powered puzzle generation platform that allows users to create puzzles, compete worldwide, and manage their favorite puzzles. With a slick user dashboard and secure authentication, sherlck promises an engaging user experience.

## Features:

1. **AI-Powered Puzzle Generation**: Innovative puzzles created using the power of Artificial Intelligence.
2. **Prompt-based User Puzzle Generation**: Customize your puzzles with a personal touch.
3. **Authentication & Registration**: Securely sign up and log into the platform.
4. **Favorites Functionality**: Save your favorite puzzles for a rainy day.
5. **Worldwide Competition**: Compete with puzzle enthusiasts from around the world and climb up the ranks.
6. **Landing Page**: An aesthetically pleasing landing page to welcome users.
7. **User Dashboard**: Once registered, users are presented with a comprehensive dashboard on the home page.

## Setup:

### Prerequisites:

- Ensure you have `npm` installed.
- Uvicorn must be set up for the backend.

### Installation & Running:

1. **Client-side setup (Next.js)**:

   Navigate to the client folder:
   ```bash
   cd client
   ```

   Install the required dependencies:
   ```bash
   npm install
   ```

   Build the project:
   ```bash
   npm build
   ```

   Run the development server:
   ```bash
   npm run dev
   ```

2. **Server-side setup (FastAPI)**:

   Navigate to the server folder:
   ```bash
   cd server
   ```

   Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

   Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

## Directory Structure:

- **client/**: Contains all Next.js frontend code.
- **server/**: Contains all FastAPI backend code.

## License:

sherlck is under the [MIT License](LICENSE).

## Contribute:

Feel free to dive in! Open an issue, submit feature requests, or contribute by creating a Pull Request.

---

Thank you for considering or using sherlck. Happy puzzling! 🧩
