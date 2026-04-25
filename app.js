const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');

const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const statsContainer = document.getElementById('statsContainer');

const goalInput = document.getElementById('goalInput');
const saveGoalBtn = document.getElementById('saveGoalBtn');

const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

let difficultyChartInstance = null;
let progressChartInstance = null;

const savedGoal = localStorage.getItem('leetcodeWeeklyGoal');
if (savedGoal) {
    goalInput.value = savedGoal;
}

searchBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        fetchData(username);
    } else {
        alert("Lütfen bir kullanıcı adı girin!");
    }
});

async function fetchData(username) {
    errorMsg.classList.add('hidden');
    statsContainer.classList.add('hidden');
    loadingMsg.classList.remove('hidden');

    try {
        const response = await fetch(`http://localhost:5000/api/user/${username}`);
        const result = await response.json();

        if (!result.data || !result.data.matchedUser) {
            throw new Error("Kullanıcı verisi boş");
        }

        const statsArray = result.data.matchedUser.submitStats.acSubmissionNum;

        let total = 0, easy = 0, medium = 0, hard = 0;

        statsArray.forEach(stat => {
            if (stat.difficulty === "All") total = stat.count;
            if (stat.difficulty === "Easy") easy = stat.count;
            if (stat.difficulty === "Medium") medium = stat.count;
            if (stat.difficulty === "Hard") hard = stat.count;
        });

        const calendarStr = result.data.matchedUser.userCalendar.submissionCalendar;
        const calendarData = JSON.parse(calendarStr);

        const submissionsByDate = {};

        for (const [timestamp, count] of Object.entries(calendarData)) {
            const dataObj = new Date(parseInt(timestamp) * 1000);
            const dateString = dataObj.toISOString().split('T')[0];
            submissionsByDate[dateString] = count;
        }

        const last7DaysLabels = [];
        const last7DaysData = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toISOString().split('T')[0];

            const displayDate = d.toLocaleDateString('tr-TR', {day: 'numeric', month: 'short'});

            last7DaysLabels.push(displayDate);

            last7DaysData.push(submissionsByDate[dateString] || 0);
        }

        console.log("Grafik Etiketleri (Günler):", last7DaysLabels);
        console.log("Grafik Verisi (Çözümler):", last7DaysData);

        document.getElementById('totalSolved').textContent = total;
        document.getElementById('easySolved').textContent = easy;
        document.getElementById('mediumSolved').textContent = medium;
        document.getElementById('hardSolved').textContent = hard;

        renderDifficultyChart(easy, medium, hard);
        renderProgressChart(last7DaysLabels, last7DaysData);

        const weeklyTotal = last7DaysData.reduce((sum, val) => sum + val, 0);

        const currentGoal = localStorage.getItem('leetcodeWeeklyGoal') || 0;

        if (currentGoal > 0) {
            let percent = Math.round((weeklyTotal / currentGoal) * 100);
            
            if (percent > 100) percent = 100;

            progressText.textContent = `Weekly Status: You solved ${weeklyTotal} of the ${currentGoal} problems! (%${percent})`;

            setTimeout(() => {
                progressBar.style.width = percent + '%';
            }, 100);
        } else {
            progressText.textContent = `Weekly Status: No Target Set. (You solved ${weeklyTotal} questions in the last 7 days)`;
            progressBar.style.width = '0%';
        }

        loadingMsg.classList.add('hidden');
        statsContainer.classList.remove('hidden');

    } catch (error) {
        console.error("Bir hata oluştu:", error);
        showError("Kullanıcı bulunamadı veya sunucu yanıt vermiyor!");
    }
}

function showError(message) {
    loadingMsg.classList.add('hidden');
    statsContainer.classList.add('hidden');

    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function renderDifficultyChart(easy, medium, hard) {
    const ctx = document.getElementById('difficultyChart').getContext('2d');

    if (difficultyChartInstance) {
        difficultyChartInstance.destroy();
    }

    difficultyChartInstance = new Chart (ctx, {
        type: "doughnut",
        data: {
            labels: ["Easy", "Medium", "Hard"],
            datasets: [{
                data: [easy, medium, hard],
                backgroundColor: [
                    "#00b8a3",
                    "#ffc01e",
                    "#ef4743"
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Difficulty Distribution",
                    font: {size: 16}
                }
            }
        }
    });
}

    function renderProgressChart(labels, dataArray) {
        const ctx = document.getElementById('progressChart').getContext('2d');

        if (progressChartInstance) {
            progressChartInstance.destroy();
        }

        progressChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Solved Problems',
                    data: dataArray,
                    borderColor: '#2c3e50',
                    backgroundColor: 'rgba(44, 62, 80, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#00b8a3',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Progress Over The Last 7 Days',
                        font: {size: 16}
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    saveGoalBtn.addEventListener('click', () => {
        const newGoal = goalInput.value;

        if (newGoal && newGoal > 0) {
            localStorage.setItem('leetcodeWeeklyGoal', newGoal);

            const originalText = saveGoalBtn.textContent;
            saveGoalBtn.textContent = "Saved ✔️";
            saveGoalBtn.style.backgroundColor = "#00b8a3";

            setTimeout(() => {
                saveGoalBtn.textContent = originalText;
                saveGoalBtn.style.backgroundColor = "";
            }, 2000);
        } else {
            alert("Please enter a valid target number!");
        }
    })