export interface VisGraphNode {
  id: string;
  label: string;
  color?: string;
  font?: {
    color: string;
    strokeWidth: number;
    size: number;
  };
}
