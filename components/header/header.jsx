import React, {Component} from "react";
import {Button, Menu} from "antd";
import {Link, Route} from "react-router-dom";
import {UserOutlined, TeamOutlined,LogoutOutlined, TagOutlined} from '@ant-design/icons';
import  "./header.css"
import {authMe, signOut} from "../../server/auth/authRequest";

class Header extends Component{
    state = {
        current: 'btn',
        nameUser: ''
    };

    handleClick = e => {
        this.setState({current: e.key});
    };

    nameUser = ()=> {
        authMe().then(value => {
           value.data.username && this.setState({
               nameUser: value.data.username
           })
        })
    }

    componentDidMount() {
        this.nameUser()
    }


    render() {
        const {current} = this.state;



        return (
            <Route>
                <Menu className="container" onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                    <Button key="btn" type="link"><Link to="/"><b>Admin Panel</b></Link></Button>
                    <Menu.Item key="mail" icon={<UserOutlined/>}>
                        <Link to="/students">Students</Link>
                    </Menu.Item>
                    <Menu.Item key="app" icon={<TagOutlined/>}>
                        <Link to="/tutors">Tutors</Link>
                    </Menu.Item>
                    <Menu.Item icon={<TeamOutlined/>} key="alipay">
                        <Link to="/groups">Groups</Link>
                    </Menu.Item>
                    <p className="max">{this.state.nameUser}</p>
                    <Button onClick={signOut} className="ml-25" type={"primary"} icon={<LogoutOutlined />}>Close</Button>
                </Menu>

            </Route>
        );
    }

}

export default Header