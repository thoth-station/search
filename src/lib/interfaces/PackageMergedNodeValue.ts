import { PackageNodeValue } from "./PackageNodeValue";
import { JustificationReasons } from "../types/JustificationReasons";

export interface PackageMergedNodeValue extends PackageNodeValue {
    change: "added" | "removed" | "unchanged" | "version";
    id: string;
    dependencies: number;
    lockfile: ("new" | "old")[];
    oldVersion?: string;
    license: string;
    justifications?: JustificationReasons;
}
