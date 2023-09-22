export let setLocalStorage=(key,token)=>{
    localStorage.setItem(key,token);
}
export let deleteLocalStorage=(key)=>{
    localStorage.removeItem(key)
}

export let getToken=()=>{
    return localStorage.getItem('token');
}