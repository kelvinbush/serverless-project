/*
 * Complete the 'saveThePrisoner' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER n
 *  2. INTEGER m
 *  3. INTEGER s
 */

function saveThePrisoner(n, m, s) {
  let start = s
  let stop = 0
  for (let i = start; i <= n; i++) {
    if (m === 0) {
      stop = i
    }
    m--;
    start = 1
  }


  return stop;

}

console.log(saveThePrisoner(4, 6, 2))
