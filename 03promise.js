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
  console.log('promise3')
  resolve('resolve1')
})
const promise4 = promise3.then(res => {
  console.log(res)
})
console.log('1', promise3);
console.log('2', promise4);

/**
 * 1.执行同步任务输出promise3
 * 2.resolve记录p3的状态改变，值为resolve1
 * 3.p4为微任务，存入微任务队列
 * 4.执行同步任务，输出1 p3为promise对象，状态为fufilled，值为resolve1
 * 5.执行同步任务，输出2 p4对象，状态为pending，值为undefined
 * 6.执行微任务，p3状态改变，输出resolve1
 * p.then 也是一个promise对象，其状态依赖于返回值
 * 没有返回任何值，那么 then 返回的 Promise 将会成为接受状态，并且该接受状态的回调函数的参数值为 undefined。
 * Promise.prototype.then()
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 */

const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')

/**
 * 1.fn为封装promise的函数
 * 2.fn执行，输出1，记录promise状态为fufilled，值为success
 * 3.then存入微任务队列中
 * 4.执行同步任务输出start
 * 5.执行微任务，状态改变输出success
 */

// 2. Promise结合setTimeout
console.log('start')
setTimeout(() => {
  console.log('time')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')

/**
 * 1. start
 * 2. setTimeout作为一个宏任务，被放入宏任务队列中（下一个）
 * 3. .then放入微任务队列中
 * 4. 执行同步任务输出end
 * 5. 本次宏任务执行完，检查微任务，转态改变输出resolve
 * 6. 接下来进入下一个宏任务，输出time
 */

const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);

/**
 * 1. 执行宏1同步任务输出1
 * 2. 宏2 setTimeout 
 * 3. 执行宏1同步任务输出2
 * 4. 宏1 的微任务 微1 p.then
 * 5. 宏1 同步任务，输出4
 * 6. 检查宏1 的微任务，promise的状态还未改变，微1不执行
 * 7. 执行下一个宏2，输出timeStart，改变promise状态并记录，输出timerEnd
 * 8. 最后又执行微任务，输出success ？？？ 
 * 1 2 4 timeStart timerEnd success？？？
 */


setTimeout(() => {
  console.log('timer1');
  setTimeout(() => {
    console.log('timer3')
  }, 0)
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
/**
 * 存入宏任务队列中 宏2
 * 存入宏任务队列中 宏3
 * 执行当前宏1 start
 * 执行宏2，timer1 存入宏任务队列中 宏4
 * 执行宏3 timer2
 * 执行宏4 timer3
 */


setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')

/**
 * 存入宏任务队列中，下一个执行宏2
 * 存入宏任务队列中，下一个执行宏3
 * 执行当前宏任务，输出start
 * 执行宏2，timer1，存入微任务队列中.then，执行微任务输出promise
 * 执行宏3 输出timer2
 * Promise.then是微任务，它会被加入到本轮中的微任务列表，
 * 而定时器timer3是宏任务，它会被加入到下一轮的宏任务中。
 */

Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
/**
 * .then存入当前宏任务宏1的微任务微1
 * timer1 存入宏任务队列中，宏2
 * 执行当前宏1的同步任务 输出start
 * 执行宏1的微任务 微1，输出promise1，timer2存入宏任务队列中宏3
 * 执行宏2 timer1，输出timer1，遇到.then存入宏2的微任务队列微1
 * 执行宏2 的微任务微1，输出promise2
 * 执行宏3，输出timer2
 * start promise1 timer1 promise2 timer2
 */

const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)

/**
 * 立即执行，setTimeout存入宏任务队列中，宏2
 * 当前宏任务的微任务p2 = p1.then 微1
 * 执行当前宏任务的同步代码，'promise1', pending状态
 * 执行当前宏任务的同步代码，'promise2', pending状态
 * 遇到定时器，存入宏3
 * 宏1执行完毕，执行微1，p1的状态还未发生改变，不执行
 * 宏2，改变p1的状态为success并记录，执行微任务微1promise1.then推入微任务队列，抛出一个错误
 * 宏3，输出'promise1', fufilled，输出'promise2', rejected
 * promise1 pending状态
 * promise2, pending状态
 * promise1 fufilled 值为success
 * promise2 rejected 值为Error: error!!!
 */

const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1里的内容");
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);

/**
 * 定时器 存入宏2
 * 输出 promise1里的内容
 * 微任务 p1.then 暂不执行
 * p1 pending
 * p2 pending
 * 定时器 存入宏3
 * 微任务，不执行
 * 宏2，改变p1状态为fufilled，值为success，输出timer1
 * 微任务执行，抛出错误
 * 执行宏3，输出timer2
 * p1 fufilled 值为success
 * p2 rejected 值为 Error("error!!!")
 * 抛出一个错误，那么 then 返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
 * promise1里的内容
 * p1 pending
 * p2 pending
 * timer1
 * error
 * timer2
 * p1 fufilled 值为 success
 * p2 rejected 值为 Error: error!!!
 */