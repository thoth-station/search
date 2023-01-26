function descendingComparator(a: { [key: string]: any }, b: { [key: string]: any }, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order: "desc" | "asc", orderBy: string) {
  return order === "desc"
    ? (a: { [key: string]: any }, b: { [key: string]: any }) => descendingComparator(a, b, orderBy)
    : (a: { [key: string]: any }, b: { [key: string]: any }) => -descendingComparator(a, b, orderBy);
}
