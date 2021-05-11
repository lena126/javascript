/**
 * promise常见问题
 * 1. Promise对象，是一个对象
 * 2. resolve,reject 执行用来改变promise对象的状态fulfilled或rejected
 * 3. Promise的参数是一个函数，传入 Promise构造器的入参函数会立即执行
 * 4. promise.then（微任务） 当promise对象状态发生变化的时候才会执行
 * （下面代码都写在一个文件中，整体执行结果受影响）
 */

/**
 * 输出什么？
 */

const promise1 = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise1.then(() => {
  console.log(3);
});
console.log(44);

/**
 * 1.从上至下，promise里的入参函数会立即执行，执行同步代码输出1
 * 2.resolve('success') 记录promise对象的状态为fufilled，值为success
 * 3.执行同步代码输出2
 * 4.promise.then为微任务，存入微任务队列
 * 5.执行同步代码输出4
 * 6.本轮宏任务全部执行完毕，检查微任务队列，promise对象状态改变，执行微任务输出3
 * 1 2 4 3
 */

const promise2 = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise2.then(() => {
  console.log(3);
});
console.log(4);

/**
 * 1.从上至下，执行同步任务输出1 2
 * 2.微任务存入微任务队列中
 * 3.执行同步任务4
 * 4.同步任务执行完，发现微任务队列中p.then,p状态未发生改变，不执行
 * 1 2 4
 */

const promise3 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise4 = promise3.then(res => {
  console.log(res)
})
console.log('1', promise3);
console.log('2', promise4);
