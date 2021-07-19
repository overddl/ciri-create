export function getAppConfig() {
  return fetch('/app/config')
}

export function signIn(params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(params === 'admin') {
        resolve({ name: 'tom', loginName: 'admin', age: 30 });
      }else {
        reject({ msg: "user admin isn't exist." });
      }
    }, 1000)
  });
  return fetch('/user/login', {
    method: "POST",
    body: JSON.stringify(params)
  });
}


export function signOut() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ msg: "登出成功" });
    }, 1000)
  })
  return fetch('/user/logout', {
    method: "POST",
    body: JSON.stringify()
  }) 
}