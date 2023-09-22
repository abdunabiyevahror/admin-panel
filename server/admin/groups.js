import {host, httpRequest} from "../host";

export let createGroup=(object)=>{
    let config={
        url:`${host}/api/admin/group/save`,
        method:'post',
        data:object
    }
    return httpRequest(config);
}

export let editGroup=(id,object)=>{
    let config={
        url:`${host}/api/admin/group/edit/${id}`,
        method:'put',
        data:object
    }
    return httpRequest(config);
}
export let getGroups=()=>{
    let config={
        url:`${host}/api/admin/groups`,
        method:'get',
    }
    return httpRequest(config);
}

export let deleteGroup=(id)=>{
    let config={
        url:`${host}/api/admin/group/delete/${id}`,
        method:'delete',
    }
    return httpRequest(config);
}

export let filterByGroup = (id) => {
    let config = {
        url: `${host}/api/tutor/students/group/${id}`,
        method: 'get',
    }
    return httpRequest(config);
}