# Development Workflow & AI Agent Handoff

This document outlines the standardized development process for the Stress Insights Pro project. Following these rules is crucial for ensuring a smooth and consistent workflow, especially when collaborating between different AI development environments (Firebase Studio and Antigravity).

## Core Development Cycle

Our workflow is based on Git, using a single `main` branch. Always follow this cycle to prevent conflicts and ensure your work is properly integrated.

### 1. Start of a New Session (Pull)

**Always** begin your work session by pulling the latest changes from the GitHub repository. This ensures you are working with the most up-to-date version of the code.

```bash
git pull origin main
```

### 2. End of Your Session (Push)

Once you have completed your task or reached a stable checkpoint, you **must** commit and push your changes back to the repository.

```bash
# Stage all your changes
git add .

# Commit your changes with a descriptive message
git commit -m "feat: [Brief description of the main feature added]"
# (Use 'fix:', 'docs:', 'style:', etc. as appropriate)

# Push your changes to the main branch
git push origin main
```

## Firebase Deployments

**Critical Rule:** All deployments, configurations, and interactions with the Firebase Console (like provisioning services) must be handled exclusively within the **Firebase Studio environment**. The Antigravity agent should not attempt to deploy or alter Firebase configurations directly.

## AI Agent Handoff Protocol

When switching development from one AI agent to another (e.g., from Gemini in Firebase Studio to the Antigravity agent, or vice-versa), use the prompt template below. This ensures a seamless transition and provides the necessary context for the next agent to continue the work.

---

### **Handoff Prompt Template (Copy and Paste)**

**Subject:** Handoff for "Stress Insights Pro" Project

**Repository:** `https://github.com/gilbertjackson-spec/Stress-Insights-Pro.git`

**Hello!** I'm handing off the development of the "Stress Insights Pro" project to you. Please follow the rules in the `CONTRIBUTING.md` file (start with `git pull` and end with `git push`).

**Context:**
The project is a Next.js application for creating and analyzing stress surveys for companies. It uses Firebase for the backend (Firestore and Auth) and is integrated with GitHub for version control and CI/CD.

**Last Session Summary (Work done by the previous agent):**
*   [**Example:** We just finished setting up the complete GitHub integration, including a `.gitignore` file and a CI workflow using GitHub Actions to lint, type-check, and build the project on every push.]
*   [**Example:** I implemented the backend logic and UI for exporting survey responses to a CSV file, respecting the dashboard filters.]
*   [**Example:** I optimized Firestore queries on the main dashboard and survey-taking page to load data in cascade, significantly improving performance.]

**Next Steps (Your Task):**
*   [**Example:** Now, I need you to implement the user profile page where users can change their name and profile picture.]
*   [**Example:** Your task is to build the "Reports" tab within the company details page.]

Please begin by pulling the latest changes from the `main` branch. Good luck!

---
