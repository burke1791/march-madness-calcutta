import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthModal from '../authModal/authModal';

import { Menu, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';


import { API_CONFIG, AUTH_FORM_TYPE, AUTH_STATUS, NOTIF, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { useAuthState } from '../../context/authContext';
import withAuth from '../../HOC/withAuth';
import useData from '../../hooks/useData';
import { parseUserMetadata } from '../../parsers/user';

const brandLink = (
  <Link to='/home'>
    <span>Calcutta</span>
  </Link>
);

function Topnav(props) {

  const { authStatus, authenticated, userMetadataRefresh } = useAuthState();

  const [userMetadata, userMetadataReturnDate, fetchUserMetadata] = useData({
    baseUrl: API_CONFIG.USER_SERVICE_BASE_URL,
    endpoint: `${USER_SERVICE_ENDPOINTS.GET_USER_METADATA}`,
    method: 'GET',
    processData: parseUserMetadata,
    conditions: [authenticated]
  });

  useEffect(() => {
    autoSignin();
  }, []);

  useEffect(() => {
    if (authStatus === AUTH_STATUS.SIGNED_IN) {
      fetchUserMetadata();
    }
  }, [authStatus, userMetadataRefresh]);

  useEffect(() => {
    if (userMetadataReturnDate) {
      console.log(userMetadata);
      props.setAuthContext({ userId: userMetadata.userId });
    }
  }, [userMetadataReturnDate, userMetadata]);

  const autoSignin = async () => {
    props.setAuthContext({ authStatus: AUTH_STATUS.IN_FLIGHT });

    const token = await props.getCurrentSession();

    if (token) {
      props.setAuthContext({
        token: token,
        authStatus: AUTH_STATUS.SIGNED_IN,
        authenticated: true
      });
    } else {
      props.setAuthContext({
        token: null,
        authStatus: AUTH_STATUS.SIGNED_OUT,
        authenticated: false
      });
    }
  }

  const generateAuthenticatedDropdown = () => {

    return [
      { key: 'passwordReset', label: 'Reset Password', style: { textAlign: 'center' }},
      { key: 'signout', label: 'Sign Out', style: { textAlign: 'center' }}
    ];
  }

  const generateAuthMenu = () => {
    if (authStatus === AUTH_STATUS.SIGNED_IN) {
      const authSubmenu = (
        <span className="submenu-title-wrapper">
          <SettingOutlined />
          My Account
        </span>
      );
      return [
        { key: 'auth-submenu', label: authSubmenu, style: { marginLeft: 'auto' }, children: generateAuthenticatedDropdown() }
      ];
    } else {
      return [
        { key: 'signin', label: 'Sign In', style: { marginLeft: 'auto' }}
      ];
    }
  }

  const handleMenuItemClicked = async (event) => {
    console.log(event);
    if (event.key === 'signin') {
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_IN);
    } else if (event.key === 'signout') {
      await props.signOut();
    } else if (event.key === 'passwordReset') {
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.PASSWORD_RESET);
    }
  }

  return (
    <nav className='topnav'>
      <Row justify='space-between' wrap={false}>
        <Col flex='1 1 175px'>
          <Menu
            theme='dark'
            mode='horizontal'
            selectable={false}
            onClick={handleMenuItemClicked}
            style={{ lineHeight: '64px' }}
            items={[
              { key: 'brand', label: brandLink, style: { fontSize: '32px' }}
            ]}
          />
        </Col>
        <Col flex='0 1 200px'>
          <Menu
            theme='dark'
            mode='horizontal'
            selectable={false}
            onClick={handleMenuItemClicked}
            style={{ lineHeight: '64px'}}
            items={generateAuthMenu()}
          />
        </Col>
      </Row>
      <AuthModal />
    </nav>
  );
}

export default withAuth(Topnav);