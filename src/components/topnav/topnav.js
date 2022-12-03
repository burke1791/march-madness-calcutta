import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthModal from '../authModal/authModal';

import { Menu, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import { AUTH_FORM_TYPE, NOTIF, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { signOut, getCurrentSession } from '../../utilities/authService';
import { useAuthDispatch, useAuthState } from '../../context/authContext';
import UserService from '../../services/user/user.service';
import { genericContextUpdate } from '../../context/helper';
import { userServiceHelper } from '../../services/user/helper';

const brandLink = (
  <Link to='/home'>
    <span>Calcutta</span>
  </Link>
);

const { SubMenu } = Menu;

function Topnav() {

  const authDispatch = useAuthDispatch();

  const { authenticated, userMetadataRefresh } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_IN, Topnav, handleSignin);
    Pubsub.subscribe(NOTIF.SIGN_OUT, Topnav, handleSignout);

    autoSignin();

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_IN, Topnav);
      Pubsub.unsubscribe(NOTIF.SIGN_OUT, Topnav);
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchUserMetadata();
    }
  }, [authenticated, userMetadataRefresh]);

  const autoSignin = () => {
    authDispatch({ type: 'update', key: 'authStatus', value: 'in-flight' });

    getCurrentSession();
  }

  const handleSignin = (session) => {
    if (!!session) {
      authDispatch({ type: 'update', key: 'authStatus', value: 'returned' });
      authDispatch({ type: 'update', key: 'authenticated', value: true });
      authDispatch({ type: 'update', key: 'token', value: session.idToken.jwtToken });
    }
  }

  const handleSignout = () => {
    authDispatch({ type: 'clear' });
  }

  const fetchUserMetadata = () => {
    UserService.callApiWithPromise(USER_SERVICE_ENDPOINTS.GET_USER_METADATA).then(response => {
      console.log(response);
      if (response.data && response.data.length) {
        let userMetadata = userServiceHelper.packageUserMetadata(response.data[0]);
        genericContextUpdate(userMetadata, authDispatch);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const generateAuthenticatedDropdown = () => {

    return [
      { key: 'passwordReset', label: 'Reset Password', style: { textAlign: 'center' }},
      { key: 'signout', label: 'Sign Out', style: { textAlign: 'center' }}
    ];
  }

  const generateAuthMenu = () => {
    if (authenticated) {
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

  const handleMenuItemClicked = (event) => {
    console.log(event);
    if (event.key === 'signin') {
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_IN);
    } else if (event.key === 'signout') {
      signOut();
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

export default Topnav;