import React, { useMemo } from 'react';
import { Avatar, Col, Layout, Row, MenuProps, Button } from 'antd';
import Menu from 'antd/lib/menu';
import { BellOutlined, BookOutlined, HomeOutlined, ProjectOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './MainLayout.css';
import { useCurrentAndPastCourses, useCurrentAndPastProjects } from '../api/hooks';
import { useLogoutUserMutation, useGetUserInfoQuery } from '../api/auth';
import trofosApiSlice from '../api/index';
import GlobalSearch from '../components/search/GlobalSearch';

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

/**
 * Get a menu items for Menu component
 */
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

/**
 * Main layout of the application.
 */
export default function MainLayout() {
  const { currentProjects: projects } = useCurrentAndPastProjects();
  const { currentCourses: courses } = useCurrentAndPastCourses();

  const location = useLocation();
  const navigate = useNavigate();

  // Temporary until we implement a proper user auth/info flow

  const dispatch = useDispatch();

  const { data: userInfo } = useGetUserInfoQuery();
  const [logoutUser] = useLogoutUserMutation();

  const LogoutComponent = (
    <Button
      onClick={() => {
        logoutUser();
        dispatch(trofosApiSlice.util.resetApiState());
        navigate('/');
      }}
    >
      Log Out
    </Button>
  );

  const AuthComponent = !userInfo ? <Link to="/login">Log in</Link> : LogoutComponent;

  // End of temporary section

  const selectedKeys = useMemo(() => [location.pathname.split('/', 3).join('/')], [location.pathname]);

  const openKeys = useMemo(() => {
    const precedingPath = location.pathname.split('/', 2).join('/');
    if (precedingPath === '/course' || precedingPath === '/project') {
      return [`${precedingPath}s`];
    }
    return [precedingPath];
  }, [location.pathname]);

  const onOpenChanged = (keys: string[]) => {
    // The latest open key is one that isn't in the opened keys
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey) {
      navigate(latestOpenKey);
    }
  };

  const menuItems: MenuItem[] = useMemo(
    () => [
      getItem(<Link to="/">Home</Link>, '/', <HomeOutlined />),
      userInfo?.userRole === 1
        ? getItem(
            <Link onClick={(e) => e.stopPropagation()} to="/courses">
              Courses
            </Link>,
            '/courses',
            <BookOutlined />,
            courses === undefined || courses.length === 0
              ? undefined
              : courses.map((course) =>
                  getItem(<Link to={`/course/${course.id}/overview`}>{course.cname}</Link>, `/course/${course.id}`),
                ),
          )
        : null,
      userInfo
        ? getItem(
            <Link onClick={(e) => e.stopPropagation()} to="/projects">
              Project
            </Link>,
            '/projects',
            <ProjectOutlined />,
            projects === undefined || projects.length === 0
              ? undefined
              : projects.map((project) =>
                  getItem(
                    <Link to={`/project/${project.id}/overview`}>{project.pname}</Link>,
                    `/project/${project.id}`,
                  ),
                ),
          )
        : null,
    ],
    [projects, courses, userInfo],
  );

  const renderHeader = () => (
    <Row justify="end" align="middle" gutter={16}>
      <Col>
        <GlobalSearch />
      </Col>
      <Col>
        <QuestionCircleOutlined />
      </Col>
      <Col>
        <BellOutlined />
      </Col>
      <Col>
        <div className="avatar-group">
          <Avatar />
          <span>{AuthComponent}</span>
        </div>
      </Col>
    </Row>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" className="main-layout-sider">
        <div style={{ fontSize: '2rem', padding: '1rem', color: 'white' }}>Trofos</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          openKeys={openKeys}
          onOpenChange={onOpenChanged}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid', borderBottomColor: '#DDD' }}>
          {renderHeader()}
        </Header>
        <Content style={{ minHeight: 360, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
