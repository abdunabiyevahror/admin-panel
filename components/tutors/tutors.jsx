import React, {Component} from "react";
import "./tutors.css"
import axios from "axios";
import {host} from "../../server/host";
import {Button, Modal, Table, Form, Input, Select} from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {onFinishFailed, openNotificationSuccess} from "../helpers/helper";
import {createTutor, deleteTutor, editTutor, getTutor} from "../../server/admin/tutor";
import {getGroups} from "../../server/admin/groups";


class Tutors extends Component {

    formRef = React.createRef();

    state = {
        tutors: [],
        isModalVisible: false,
        editedTutor: null,
        groups: [],
        loading: true
    };


    showModal = () => {
        this.getGroups()
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
            editedTutor: null
        })
    };

    handleCancel = () => {
        this.onReset();
        this.setState({
            isModalVisible: false,
            editedTutor: null
        })
    };

    onFinish = (values) => {
        this.onLoading(true)
        const {editedTutor} = this.state;
        values.password = 's';
        if (editedTutor) {
            editTutor(editedTutor.id, values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess("Edited successfully ")
                    this.getTutors()
                } else {
                    openNotificationSuccess("Error");
                    this.handleCancel()
                }
            })
                .catch(err => {
                    openNotificationSuccess(`404 Error + ${err}`);
                })
        } else {
            createTutor(values).then(res => {
                if (res && res.data) {
                    this.handleOk();
                    this.onLoading(false)
                    openNotificationSuccess("Added successfully")
                    this.getTutors()
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

    getTutors = () => {
        this.onLoading(true)
        getTutor().then(res => {
            if (res && Array.isArray(res.data)) {
                this.setState({
                    tutors: res.data,
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

    deleteTutors = (id) => {
        this.onLoading(true)
        deleteTutor(id).then(res => {
            openNotificationSuccess("Deleted successfully")
            this.getTutors()
            this.onLoading(false)
        })
    }

    editTutors = (tutor) => {
        this.setState({
            editedTutor: tutor
        })
        this.showModal()
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue(tutor)
        }
    }

    onLoading = (loading_status) => {
        this.setState({
            loading: loading_status
        })
    }

    onReset = () => {
        this.formRef.current.resetFields();
    };

    componentDidMount() {
        this.getTutors()
    }

    render() {

        const {tutors, isModalVisible, editedTutor} = this.state;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
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
                render: tutor => (
                    <div key={tutor.id}>
                        <Button type="primary" onClick={() => this.editTutors(tutor)} className="mr-25"
                                icon={<EditOutlined/>}>Edit</Button>
                        <Button className="mt-25" type="danger" onClick={() => {
                            this.deleteTutors(tutor.id)
                        }} icon={<DeleteOutlined/>}>Delete</Button>
                    </div>
                )
            }
        ];

        return (

            <div className="container">
                <Button className="m-25 mr-25" type="primary" onClick={this.showModal}>
                    Add Tutor
                </Button>
                <Modal title={editedTutor ? "Edit tutor" : "Add tutor"} visible={isModalVisible}
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
                            initialValue={editedTutor ? editedTutor.fullname : ""}
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
                            initialValue={editedTutor ? editedTutor.username : ""}
                        >
                            <Input/>
                        </Form.Item>

                        {
                            editedTutor? "":
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
                            rules={[{ required: true, message: 'Select group!' }]}
                            // initialValue={editedTutor ?(editedTutor.group?editedTutor.group.id:''):''}
                        >
                            <Select>
                                {
                                    Array.isArray(this.state.groups)?
                                        this.state.groups.map(group=>(
                                            <Select.Option value={group.id}>{group.name}</Select.Option>
                                        )):''
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            initialValue={editedTutor ? editedTutor.address : ""}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={this.state.loading} className="mr-25" type="primary" htmlType="submit">
                                Add
                            </Button>
                            <Button onClick={this.handleCancel} type="danger">
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Table loading={this.state.loading} dataSource={tutors} columns={columns}/>
            </div>
        );
    }

}

export default Tutors