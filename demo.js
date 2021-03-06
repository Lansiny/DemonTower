/*
 * @Description:
 * @Version: 1.0
 * @Autor: Lansiny
 * @LastEditors: Lansiny
 * @Date: 2021-03-05 20:43:34
 * @LastEditTime: 2021-03-06 13:46:04
 */

let a = {
  0: 0,
  1: 1,
  2: 3
}
if (a.length) {
  console.log("a", a)
} else {
  console.log("a", null)
}


console.log(Array.from(a));
