export function extractPercentage(text: string) {
  const regex = /(\d+)%/;
  const match = regex.exec(text);
  if (match) {
    return match[1];
  } else {
    return 0;
  }
}
