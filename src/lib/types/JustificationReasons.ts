import { Node } from "../interfaces/Node";
import { PackageMergedNodeValue } from "../interfaces/PackageMergedNodeValue";
import { components } from "../schema";

export type JustificationReasons = {
    package: Node<PackageMergedNodeValue>["key"];
    header: string;
    reasons: { package: string; reason: string }[];
    thoth?: components["schemas"]["Justification"];
};
