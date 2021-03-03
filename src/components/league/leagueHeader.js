import React, { useState, useEffect } from 'react';

import { Layout, Typography } from 'antd';
import 'antd/dist/antd.css';

const { Header } = Layout;
const { Title } = Typography;

function LeagueHeader(props) {

  const [level, setLevel] = useState(1);
  const [style, setStyle] = useState({});
  const [type, setType] = useState('');

  useEffect(() => {
    if (props.class === 'primary') {
      setLevel(1);
      setStyle({ margin: 0, fontSize: '32px', fontWeight: 500 });
      setType('');
    } else if (props.class === 'secondary') {
      setLevel(3);
      setStyle({ lineHeight: '32px', fontWeight: 400, margin: 0 });
      setType('secondary');
    }
  }, [props.class]);

  const getTooltip = (icon, text) => {
    if (icon != null && text != null) {
      return {
        icon: [icon, icon],
        tooltips: [text, text]
      };
    }

    return null;
  }

  return (
    <Header style={{ background: 'none', textAlign: 'center', height: '48px' }}>
      <Title
        ellipsis={{ rows: 1 }}
        level={level}
        style={style}
        type={type}
        copyable={getTooltip(props.tooltipIcon, props.tooltipText)}
      >
        {props.text}
      </Title>
    </Header>
  );
}

export default LeagueHeader;