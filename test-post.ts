(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({text: 'A Terra é plana', images: []})
        });
        const d = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", d);
    } catch(err) {
        console.error(err);
    }
})();
