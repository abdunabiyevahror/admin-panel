import {host, httpRequest} from "../host";

export let createTutor=(data)=>{
    let config={
        url:`${host}/api/admin/tutor/save`,
        method:'post',
        data:data
    }
    return httpRequest(config);
}

export let editTutor=(id,object)=>{
    let config={
        url:`${host}/api/admin/tutor/edit/${id}`,
        method:'put',
        data:object
    }
    return httpRequest(config);
}
export let getTutor=()=>{
    let config={
        url:`${host}/api/admin/tutors`,
        method:'get',
    }
    return httpRequest(config);
}

export let deleteTutor=(id)=>{
    let config={
        url:`${host}/api/admin/tutor/delete/${id}`,
        method:'delete',
    }
    return httpRequest(config);
}

export let filterByTutor=(id)=>{
    let config={
        url:`${host}/api/tutor/groups/tutor/${id}`,
        method:'get',
    }
    return httpRequest(config);
}