### The 3-Rule Git Workflow for Eco-Pulse

#### 1. The Branch Hierarchy

Never, ever push code directly to `main`.

* `main`: The holy grail. This code must always be deployable and crash-proof. You only merge into `main` right before a demo or a major milestone.
* `dev` (Development): The integration sandbox. This is where all three of you combine your work to see if the frontend actually talks to the backend.
* `feature/*`: Where you actually write code. Every time you start a new task, you branch off `dev`.

#### 2. How You Actually Contribute (Step-by-Step)

Let’s say the Express ('E') dev is building the WAQI API route.

1. **Pull the latest:** Always start by pulling the freshest code from `dev` to your local machine so you aren't working with outdated files.
* `git checkout dev`
* `git pull origin dev`


2. **Create a feature branch:** Name it something obvious.
* `git checkout -b feature/waqi-api-route`


3. **Write code & commit:** Keep commits small and descriptive. "fixed stuff" is a terrible commit message. "added WAQI fetch logic in aqiController" is a good one.
4. **Push the branch:** Send it to GitHub.
* `git push origin feature/waqi-api-route`


5. **Open a Pull Request (PR):** On GitHub, you ask to merge `feature/waqi-api-route` into `dev`.

#### 3. The "No Solo Merging" Rule

This is how you stop merge conflicts from destroying your repo. When you open a PR, **you are not allowed to merge it yourself.** If 'E' finishes the backend route, 'R' (the frontend dev) should review the PR. 'R' checks if the JSON response matches what they need for the UI. If it looks good, 'R' clicks the merge button. This forces communication.

