const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');

const loadingMsg = document.getElementById('loadingMsg');
const errorMsg = document.getElementById('errorMsg');
const statsContainer = document.getElementById('statsContainer');

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