import YAML from "yaml";

export async function getFile(url: RequestInfo) {
  const response = await fetch(url);
  return await response.text();
}

export async function getYamlFile(url: string) {
  const text = await getFile(url);
  return YAML.parse(text);
}
