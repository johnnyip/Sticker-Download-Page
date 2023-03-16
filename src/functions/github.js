

export const fetchGitHubRepoData = async () => {
    const url = "https://cors.johnnyip.com/https://api.github.com/repos/johnnyip/sticker-download-page/branches/main";
    const headers = new Headers({
        "X-GitHub-Api-Version": "2022-11-28"
    });

    let dateString = "";

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        dateString = data.commit.commit.author.date;
        // dateString = dateString.split("T")
        // dateString = dateString[0] + " " + dateString[1].substring(0,5)
        console.log(dateString);
    } catch (error) {
        console.error("Failed to fetch GitHub repo data:", error);
    }

    return dateString;
};