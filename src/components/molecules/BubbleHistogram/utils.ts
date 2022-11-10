export function histogram(data: number[], size: number) {
  let min = Infinity;
  let max = -Infinity;

  for (const item of data) {
    if (item < min) min = item;
    else if (item > max) max = item;
  }

  const bins = Math.ceil((max - min + 1) / size);

  const histogram = new Array(bins).fill(0);

  for (const item of data) {
    histogram[Math.floor((item - min) / size)]++;
  }

  return histogram;
}
