function descendingComparator(
    a: { [x: string]: number },
    b: { [x: string]: number },
    orderBy: string | number,
) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order: string, orderBy: string) {
    return order === "desc"
        ? (a: { [x: string]: number }, b: { [x: string]: number }) =>
              descendingComparator(a, b, orderBy)
        : (a: { [x: string]: number }, b: { [x: string]: number }) =>
              -descendingComparator(a, b, orderBy);
}

export function stableSort(
    array: any[],
    comparator: {
        (a: { [x: string]: number }, b: { [x: string]: number }): number;
        (arg0: any, arg1: any): any;
    },
) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}
