const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/user/:username', async(req, res) => {
    const username = req.params.username;

    const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({
                query: query,
                variables: {username: username}
            })
        });

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
});