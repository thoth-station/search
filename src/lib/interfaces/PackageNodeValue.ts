import { NodeValue } from "lib/interfaces/Node";
import { PackageMetadata } from "../types/PackageMetadata";
import { NodeOptions } from "vis-network/declarations/network/Network";
import { components } from "../schema";

export interface PackageNodeValue extends NodeValue, NodeOptions {
    id: string;
    depth?: number;
    name?: string;
    version?: string;
    metadata?: PackageMetadata | null;
    justifications?: components["schemas"]["Justification"];
}
