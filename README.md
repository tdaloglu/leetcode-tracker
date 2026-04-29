# 🚀 LeetCode Tracker

LeetCode Tracker is a modern web application that visualizes users' problem-solving statistics and past performance on LeetCode.

## 🌟 Features
- **Real-Time Data:** Fetches up-to-date profile data using the LeetCode GraphQL API.
- **Difficulty Distribution:** Converts Easy, Medium, and Hard problem counts into a dynamic Doughnut Chart using Chart.js.
- **Weekly Progress Momentum:** Calculates the user's activity over the last 7 days and displays it on a Line Chart.
- **Personal Goal System:** Allows you to set a weekly problem-solving goal using `localStorage` and tracks it with an animated Progress Bar.
- **Secure Error Handling:** Provides custom error messages for non-existent users or private profiles.

## 🛠️ Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Chart.js
- **Backend:** Node.js, Express.js, Cors
- **API:** LeetCode GraphQL API

## 💻 For Developers (Installation)
If you want to run the project on your local machine:
1. Clone the repository: `git clone https://github.com/YOUR_USERNAME/leetcode-tracker.git`
2. Install backend dependencies: `npm install`
3. Start the server: `node server.js`
4. Open the `index.html` file in your browser.
