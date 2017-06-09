import React from 'react'
import {
    Route,
    Link
} from 'react-router-dom';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import routes from '../../route'
import './layout.css'

const {SubMenu} = Menu;
const { Content, Sider, Footer} = Layout;

class AppLayout extends React.Component {
    state = {
        collapsed: false,
        mode: 'inline',
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }



    render() {
        return <Layout>
            <Layout>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo">
                        <img alt="广东省司法社矫平台系统" src='/logo.png' />
                        {this.state.collapsed ? '' : <span>政联科技</span>}
                    </div>
                    <Menu
                        theme="dark"
                        mode={this.state.mode}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                    >
                        <SubMenu key="sub1"
                                 title={<span><Icon type="book"/><span className="nav-text">E-book</span></span>}
                        >
                            <Menu.Item key="1"><Link to="/"><Icon type="file-pdf"/>PDF</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/upload"><Icon type="upload"/>PDF Upload</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px',Height:'100%'}}>
                    <Breadcrumb style={{margin: '12px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>E-book</Breadcrumb.Item>
                        <Breadcrumb.Item>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.title}
                            />
                        ))}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                        <div style={{flex: 1, padding: '10px'}}>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.main}
                                />
                            ))}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        E-book ©2017 Created by Wuhan Zhenlian Technology Co. Ltd
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    }
}

export default AppLayout