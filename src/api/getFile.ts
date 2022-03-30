// GitHub
export function getGitHubFileText(githubRepo: URL, fileName: string) {
    const url = new URL(githubRepo);

    if (url.hostname === "github.com") {
        return fetch(
            "https://raw.githubusercontent.com" +
                url.pathname +
                "/master/" +
                fileName,
        )
            .then(response => response.text())
            .then(response => {
                return response;
            });
    } else return Promise.reject();
}

export function getFile(url: RequestInfo) {
    return fetch(url)
        .then(response => response.text())
        .then(response => {
            return response;
        });
}
