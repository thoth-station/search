import YAML from "yaml";

export function getFile(url: RequestInfo) {
    return fetch(url)
        .then(response => response.text())
        .then(response => {
            return response;
        });
}

export function getYamlFile(url: string) {
    return getFile(url).then(text => YAML.parse(text));
}
