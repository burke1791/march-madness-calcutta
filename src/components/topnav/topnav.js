import React, { useEffect } from 'react';
import { Link } from '@reach/router';

import AuthModal from '../authModal/authModal';

import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import { AUTH_FORM_TYPE, NOTIF, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { signOut, getCurrentSession } from '../../utilities/authService';
import { useAuthDispatch, useAuthState } from '../../context/authContext';
import UserService from '../../services/user/user.service';
import { genericContextUpdate } from '../../context/helper';
import { userServiceHelper } from '../../services/user/helper';


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
    let menu = [
      <Menu.Item key='passwordReset' style={{textAlign: 'center'}}  >
        Reset Password
      </Menu.Item>,
      <Menu.Item key='signout' style={{textAlign: 'center'}}  >
        Sign Out
      </Menu.Item>
    ];

    return menu;
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
    } else if (event.key === 'signout') {
      signOut();
    } else if (event.key === 'passwordReset') {
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.PASSWORD_RESET);
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