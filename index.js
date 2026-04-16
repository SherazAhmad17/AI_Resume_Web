
async function checkMyModels() {
    const API_KEY = ""; // Paste your actual key here
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        console.log("Fetching models list from Google...");
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("\n✅ Success! Here are the models your API key can use:");
            const modelNames = data.models.map(m => m.name);
            console.log(modelNames);
        } else {
            console.log("\n❌ Error fetching models:", data);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }x``
}

checkMyModels();