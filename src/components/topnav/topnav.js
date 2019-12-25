import React, { useState, useEffect } from 'react';
import { navigate, Link } from '@reach/router';

import AuthModal from '../authModal/authModal';

import { Menu, Button, Icon } from 'antd';
import 'antd/dist/antd.css';

import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import AuthService, { User } from '../../firebase/authService';


const { SubMenu } = Menu;

function Topnav() {

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_IN, Topnav, handleSignin);
    Pubsub.subscribe(NOTIF.SIGN_OUT, Topnav, handleSignout);

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_IN, Topnav);
      Pubsub.unsubscribe(NOTIF.SIGN_OUT, Topnav);
    });
  }, []);

  const handleSignin = () => {
    setAuthenticated(true);
  }

  const handleSignout = () => {
    setAuthenticated(false);
  }

  const generateAuthenticatedDropdown = () => {
    let menu = [
      <Menu.Item key='signout' style={{textAlign: 'center'}}  >
        <Button 
          type='danger' 
          onClick={() => AuthService.signout()}
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
              <Icon type="setting" />
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