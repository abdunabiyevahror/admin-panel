import React, {Component} from "react";
import "./groups.css"
import axios from "axios";
import {host} from "../../server/host";
import {Button, Modal, Table, Form, Input, Select} from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {notification} from 'antd';
import {onFinishFailed, openNotificationSuccess} from "../helpers/helper";
import {createGroup, deleteGroup, editGroup, getGroups} from "../../server/admin/groups";
import {filterByTutor, getTutor} from "../../server/admin/tutor";
import {getToken} from "../../utilits";


class Groups extends Component {

    formRef = React.createRef();

    state = {
        groups: [],
        isModalVisible: false,
        editedGroup: null,
        tutors: [],
        loading: true
    }


    showModal = () => {
        this.getTutors();
        this.setState({
            isModalVisible: true,
        })
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
                name: null,
                tutor: {
                    id: null
                }
            })
        }
    };

    handleOk = () => {
        this.setState({
            isModalVisible: false,
            editedGroup: null
        })
    };

    handleCancel = () => {
        this.onReset();
        this.setState({
            isModalVisible: false,
            editedGroup: null
        })
    };

    onFinish = (values) => {
        this.onLoading(true)
        const {editedGroup} = this.state;
        values.password = 's';
        if (editedGroup) {
            editGroup(editedGroup.id, values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess("Edited successfully ")
                    this.getGroups()
                } else {
                    openNotificationSuccess("Error");
                    this.handleCancel()
                }
            })
                .catch(err => {
                    openNotificationSuccess(`404 Error + ${err}`);
                })
        } else {
            createGroup(values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess("Added successfully")
                    this.getGroups()
                } else {
                    openNotificationSuccess("Error");
                    this.handleCancel()
                }
            })
                .catch(err => {
                    openNotificationSuccess(`404 Error + ${err}`);
                })
        }
    };

    getGroups = () => {
        this.onLoading(true)
        getGroups().then(res => {
            if (res && Array.isArray(res.data)) {
                this.setState({
                    groups: res.data,
                    loading: false
                })
            }
        })
    };

    getTutors = () => {
        this.onLoading(true)
        getTutor().then(res => {
            if (res && Array.isArray(res.data)) {
                this.setState({
                    tutors: res.data,
                    loading: false
                })
            }
        }).catch(res => {
            alert("404 Error")
        })
    }

    deleteGroups = (id) => {
        this.onLoading(true)
        deleteGroup(id).then(res => {
            openNotificationSuccess("Deleted successfully")
            this.getGroups()
            this.onLoading(false)
        })
    }

    editGroups = (group) => {
        this.setState({
            editedGroup: group
        })
        this.showModal()
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue(group)
        }
    }

    onLoading = (loading_status) => {
        this.setState({
            loading: loading_status
        })
    }

    filterByTutorId = (id) => {
        this.onLoading(true)
        if (id === -1) {this.getGroups()} else {
            filterByTutor(id).then(res => {
                if (res && Array.isArray(res.data)) {
                    this.setState({
                        groups: res.data,
                        loading: false
                    })
                }
            })
        }
    }

    onReset = () => {
        this.formRef.current.resetFields();
    };

    componentDidMount() {
        this.getGroups()
        this.getTutors()
    }

    render() {

        const {groups, isModalVisible, editedGroup, loading} = this.state;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: "Tutor",
                dataIndex: 'tutor',
                render: tutor => (
                    <p>{tutor ? tutor.fullname : ''}</p>
                )
            },
            {
                title: 'Action',
                key: 'action',
                render: group => (
                    <div key={group.id}>
                        <Button type="primary" onClick={() => this.editGroups(group)} className="mr-25"
                                icon={<EditOutlined/>}>Edit</Button>
                        <Button type="danger" onClick={() => {
                            this.deleteGroups(group.id)
                        }} icon={<DeleteOutlined/>}>Delete</Button>
                    </div>
                )
            }
        ];

        return (

            <div className="container">
                <Button className="m-25" type="primary" onClick={this.showModal}>
                    Add Groups
                </Button>
                <Select defaultValue={-1} onChange={(value) => {
                    this.filterByTutorId(value)
                }} placeholder="Tutors" className="p-25">
                    <Select.Option value={-1}>Barchasi</Select.Option>
                    {
                        Array.isArray(this.state.tutors) ?
                            this.state.tutors.map(tutor => (
                                <Select.Option value={tutor.id}>{tutor.fullname}</Select.Option>
                            )) : ''
                    }
                </Select>
                <Modal title={editedGroup ? "Edit group" : "Add group"} visible={isModalVisible}
                       onOk={this.handleOk} onCancel={this.handleCancel}
                       footer={false}>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={onFinishFailed}
                        ref={this.formRef}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your fullname!',
                                },
                            ]}
                            initialValue={editedGroup ? editedGroup.name : ""}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Tutor"
                            name="tutorId"
                            rules={[{required: true, message: 'Tutorni kiriting!'}]}
                            // initialValue={editedGroup ? (editedGroup.tutor ? editedGroup.tutor.id : '') : ''}
                        >
                            <Select>
                                {
                                    Array.isArray(this.state.tutors) ?
                                        this.state.tutors.map(item => (
                                            <Select.Option value={item.id}>{item.fullname}</Select.Option>
                                        )) : ''
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loading} className="mr-25" type="primary" htmlType="submit">
                                Add
                            </Button>
                            <Button onClick={this.handleCancel} type="danger">
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table loading={loading} dataSource={groups} columns={columns}/>
            </div>
        );
    }

}

export default Groups