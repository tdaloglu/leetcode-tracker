const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');

const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const statsContainer = document.getElementById('statsContainer');

let difficultyChartInstance = null;

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

        document.getElementById('totalSolved').textContent = total;
        document.getElementById('easySolved').textContent = easy;
        document.getElementById('mediumSolved').textContent = medium;
        document.getElementById('hardSolved').textContent = hard;

        renderDifficultyChart(easy, medium, hard);

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
                    "ef4743"
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