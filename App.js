import 'antd/dist/antd.css';
import React from "react";
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import Students from "./components/students/students";
import Tutors from "./components/tutors/tutors";
import Groups from "./components/groups/groups";
import Home from "./components/home/home";
import Header from "./components/header/header";
import {Button, Result} from "antd";
import Login from "./components/login/login";
import {getToken} from "./utilits";

class App extends React.Component {

    render() {
        return (
            <Router>
                {
                    getToken() ?
                        <div>
                            <Header/>
                            <Switch>
                                <Route exact path="/">
                                    <Home/>
                                </Route>
                                <Route path="/students">
                                    <Students/>
                                </Route>
                                <Route path="/tutors">
                                    <Tutors/>
                                </Route>
                                <Route path="/groups">
                                    <Groups/>
                                </Route>
                                <Route>
                                    <Result
                                        status="404"
                                        title="404"
                                        subTitle="Sorry, the page you visited does not exist."
                                    />,
                                </Route>
                            </Switch>
                        </div>
                        : <div>
                            <Redirect to="login"/>
                            <Login/>
                        </div>
                }
            </Router>

        );
    }


}

export default App;
