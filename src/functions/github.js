
export const fetchGitHubRepoData = async () => {
  const url = 'https://api.github.com/repos/johnnyip/Sticker-Download-Page/commits/main';
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  });

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.commit?.author?.date ?? '';
  } catch (error) {
    console.error('Failed to fetch GitHub repo data:', error);
    return '';
  }
};
