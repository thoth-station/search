import { NodeValue } from "lib/interfaces/Node";

export interface PackageVersionValue extends NodeValue {
  name: string;
  version: string;
  index: string;
  os_name: string;
  os_version: string;
  python_version: string;
}
