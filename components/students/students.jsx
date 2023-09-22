import React, {Component} from "react";
import "./students.css"
import axios from "axios";
import {host} from "../../server/host";
import {Button, Modal, Table, Form, Input, Select} from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {onFinishFailed, openNotificationSuccess} from "../helpers/helper";
import {createStudent, deleteStudent, editStudent, getStudent} from "../../server/admin/students";
import {filterByGroup, getGroups} from "../../server/admin/groups";

class Students extends Component {

    formRef = React.createRef();

    state = {
        students: [],
        isModalVisible: false,
        editedStudent: null,
        groups: [],
        loading: true
    };


    showModal = () => {
        this.setState({
            isModalVisible: true
        })
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
                fullname: null,
                username: null,
                password: null,
                groupId: null,
                address: null,
            })
        }
    };

    handleOk = () => {
        this.setState({
            isModalVisible: false,
            editedStudent: null
        })
    };

    handleCancel = () => {
        this.onReset();
        this.setState({
            isModalVisible: false,
            editedStudent: null
        })
    };

    onFinish = (values) => {
        this.onLoading(true)
        const {editedStudent} = this.state;
        values.password = 's';
        if (editedStudent) {
            editStudent(editedStudent.id, values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess( "Edited successfully ")
                    this.getStudents()
                } else {
                    openNotificationSuccess("Error");
                    this.handleCancel()
                }
            })
                .catch(err => {
                    openNotificationSuccess(`404 Error + ${err}`);
                })
        } else {
            createStudent(values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess( "Added successfully")
                    this.getStudents()
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


    getStudents = () => {
        this.onLoading(true)
        getStudent().then(res => {
            if (res && Array.isArray(res.data)) {
                this.setState({
                    students: res.data,
                    loading: false
                })
            }
        })
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

    deleteStudents = (id) => {
        this.onLoading(true)
        deleteStudent(id).then(res => {
            openNotificationSuccess("Deleted successfully")
            this.getStudents()
            this.onLoading(false)
        })
    }

    editStudents = (student) => {
        this.setState({
            editedStudent: student
        })
        this.showModal()
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue(student)
        }
    }

    onLoading = (loading_status) => {
        this.setState({
            loading: loading_status
        })
    }

    filterByGroupId = (id) => {
        this.onLoading(true);
        if (id === -1) {
            this.getStudents()
        } else {
            filterByGroup(id).then(res => {
                if (res && Array.isArray(res.data)) {
                    this.setState({
                        students: res.data,
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
        this.getStudents()
        this.getGroups()
    }

    render() {

        const {students, isModalVisible, editedStudent, loading} = this.state;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Fullname',
                dataIndex: 'fullname',
                key: 'fullname',
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Action',
                key: 'action',
                render: student => (
                    <div key={student.id}>
                        <Button type="primary" onClick={() => this.editStudents(student)} className="mr-25"
                                icon={<EditOutlined/>}>Edit</Button>
                        <Button className="mt-25" type="danger" onClick={() => {
                            this.deleteStudents(student.id)
                        }} icon={<DeleteOutlined/>}>Delete</Button>
                    </div>
                )
            }
        ];

        return (

            <div className="container">
                <Button className="m-25" type="primary" onClick={this.showModal}>
                    Add student
                </Button>
                <Select defaultValue={-1} onChange={(value) => {
                    this.filterByGroupId(value)
                }} placeholder="Tutors" className="p-25">
                    <Select.Option value={-1}>Barchasi</Select.Option>
                    {
                        Array.isArray(this.state.groups) ?
                            this.state.groups.map(group => (
                                <Select.Option value={group.id}>{group.name}</Select.Option>
                            )) : ''
                    }
                </Select>
                <Modal title={editedStudent ? "Edit student" : "Add student"} visible={isModalVisible}
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
                            label="Fullname"
                            name="fullname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your fullname!',
                                },
                            ]}
                            initialValue={editedStudent ? editedStudent.fullname : ""}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                            initialValue={editedStudent ? editedStudent.username : ""}
                        >
                            <Input/>
                        </Form.Item>

                        {
                            editedStudent ? "" :
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password/>
                                </Form.Item>
                        }

                        <Form.Item
                            label="Group"
                            name="groupId"
                            rules={[{required: true, message: 'Select Group!'}]}
                            // initialValue={editedStudent ? (editedStudent.tutor ? editedStudent.tutor.id : '') : ''}
                        >
                            <Select>
                                {
                                    Array.isArray(this.state.groups) ?
                                        this.state.groups.map(group => (
                                            <Select.Option value={group.id}>{group.name}</Select.Option>
                                        )) : ''
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            initialValue={editedStudent ? editedStudent.address : ""}
                        >
                            <Input/>
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
                <Table loading={loading} dataSource={students} columns={columns}/>
            </div>
        );
    }

}

export default Students