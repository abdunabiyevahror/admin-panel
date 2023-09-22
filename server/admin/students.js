import {host, httpRequest} from "../host";

export let createStudent = (data) => {
    let config = {
        url: `${host}/api/admin/student/save`,
        method: 'post',
        data: data
    }
    return httpRequest(config);
}

export let editStudent = (id, object) => {
    let config = {
        url: `${host}/api/admin/student/edit/${id}`,
        method: 'put',
        data: object
    }
    return httpRequest(config);
}
export let getStudent = () => {
    let config = {
        url: `${host}/api/admin/students`,
        method: 'get',
    }
    return httpRequest(config);
}

export let deleteStudent = (id) => {
    let config = {
        url: `${host}/api/admin/student/delete/${id}`,
        method: 'delete',
    }
    return httpRequest(config);
}

