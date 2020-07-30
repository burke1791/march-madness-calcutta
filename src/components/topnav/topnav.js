import React, { useState, useEffect } from 'react';
import { navigate, Link } from '@reach/router';

import AuthModal from '../authModal/authModal';

import { Menu, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { User, signOut, getCurrentSession } from '../../utilities/authService';
import { useAuthDispatch, useAuthState } from '../../context/authContext';


const { SubMenu } = Menu;

function Topnav() {

  const authDispatch = useAuthDispatch();

  const { authenticated } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_IN, Topnav, handleSignin);
    Pubsub.subscribe(NOTIF.SIGN_OUT, Topnav, handleSignout);
    Pubsub.subscribe(NOTIF.USER_ID, Topnav, handleUserId);

    getCurrentSession();

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_IN, Topnav);
      Pubsub.unsubscribe(NOTIF.SIGN_OUT, Topnav);
      Pubsub.unsubscribe(NOTIF.USER_ID, Topnav);
    });
  }, []);

  const handleSignin = (session) => {
    if (!!session) {
      authDispatch({ type: 'update', key: 'authenticated', value: true });
      authDispatch({ type: 'update', key: 'token', value: session.idToken.jwtToken });
    }
  }

  const handleSignout = () => {
    authDispatch({ type: 'clear' });
  }

  const handleUserId = (userId) => {
    authDispatch({ type: 'update', key: 'userId', value: userId });
  }

  const generateAuthenticatedDropdown = () => {
    let menu = [
      <Menu.Item key='signout' style={{textAlign: 'center'}}  >
        <Button 
          type='danger' 
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </Menu.Item>
    ];

    if (User.permissions === 'herald') {
      menu.unshift(
        <Menu.Item key='admin' style={{textAlign: 'center'}}  >
          <Link to='/admin'>
            <Button 
              type='primary'
            >
              Admin
            </Button>
          </Link>
        </Menu.Item>
      );

      return menu;
    } else {
      return menu;
    }
  }

  const generateAuthMenu = () => {
    if (authenticated) {
      return (
        <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <SettingOutlined />
              My Account
            </span>
          }
          style={{ float: 'right' }}
        >
          {generateAuthenticatedDropdown()}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key='signin' style={{ float: 'right' }}>
          Sign In
        </Menu.Item>
      );
    }
  }

  const handleMenuItemClicked = (event) => {
    console.log(event);
    if (event.key === 'signin') {
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_IN);
    }
  }

  return (
    <nav className='topnav'>
      <Menu theme='dark' mode='horizontal' selectable={false} onClick={handleMenuItemClicked} style={{ lineHeight: '64px' }}>
        <Menu.Item key='brand' style={{ fontSize: '32px' }}>
          <Link to='/home'>
            <span>Calcutta</span>
          </Link>
        </Menu.Item>
        {generateAuthMenu()}
      </Menu>
      <AuthModal />
    </nav>
  );
}

export default Topnav;