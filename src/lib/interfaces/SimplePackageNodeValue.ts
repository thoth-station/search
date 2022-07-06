import { NodeValue } from "lib/interfaces/Node";
import { PackageMetadata } from "../types/PackageMetadata";
import { NodeOptions } from "vis-network/declarations/network/Network";

export interface SimplePackageNodeValue extends NodeValue, NodeOptions {
  id: string;
  depth: number;
  name?: string;
  versions?: string[];
  specifier?: string;
  extra?: string[];
  metadata?: PackageMetadata | null;
}
