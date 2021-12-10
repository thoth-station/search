// GitHub
export function getGitHubFileText(githubRepo, fileName) {
	const url = new URL(githubRepo);

	if (url.hostname === "github.com") {
		return fetch(
			"https://raw.githubusercontent.com" + url.pathname + "/master/" + fileName
		)
			.then(response => response.text())
			.then(response => {
				return response;
			});
	} else return Promise.reject();
}

export function getFile(url) {
	return fetch(url)
		.then(response => response.text())
		.then(response => {
			return response;
		});
}