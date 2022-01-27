import React, { useState, useEffect, useRef, memo } from 'react';
import { Divider, List, Modal, Progress, Typography } from 'antd';
import 'antd/dist/antd.css';
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons/lib/icons';
import { useAuctionState } from '../../context/auctionContext';

const { Title, Text } = Typography;

function AuctionLoadingModal(props) {

  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('active');

  const downloadItemsStatus = useRef([]);

  const { connected, teamsDownloadedDate, auctionBuyInsDownloadedDate, auctionStatusDownloadedDate } = useAuctionState();

  useEffect(() => {
    updateDownloadItemsStatus();
  }, [connected, teamsDownloadedDate, auctionBuyInsDownloadedDate, auctionStatusDownloadedDate]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('Server is busy. Please refresh or try again later');
    }, (props.errorTimer || 15) * 1000);
  }, []);

  const queueDismiss = () => {
    setTimeout(() => {
      setVisible(false);
    }, 500);
  }

  const getDownloadItems = () => {
    return [
      { name: 'Connecting to auction service', status: connected ? 'success' : 'pending' },
      { name: 'Downloading current auction status', status: !!auctionStatusDownloadedDate ? 'success' : 'pending' },
      { name: 'Downloading teams', status: !!teamsDownloadedDate ? 'success' : 'pending' },
      { name: 'Downloading user buy-ins', status: !!auctionBuyInsDownloadedDate ? 'success' : 'pending' }
    ];
  }

  const calculateProgress = () => {
    const totalItems = downloadItemsStatus.current.length;
    let successItems = 0;
    let loadingStatus = 'success';

    for (var item of downloadItemsStatus.current) {
      if (item.status === 'success') {
        successItems++;
      } else if (item.status === 'pending' && loadingStatus !== 'error') {
        loadingStatus = 'active';
      } else if (item.status === 'error') {
        loadingStatus = 'error';
      }
    }

    setLoadingPercent((successItems / totalItems) * 100);
    setLoadingStatus(loadingStatus);

    // dismiss modal after showing all successes for a split second
    if (loadingStatus === 'success') {
      queueDismiss();
    }
  }

  const updateDownloadItemsStatus = () => {
    downloadItemsStatus.current = getDownloadItems();

    calculateProgress();
  }

  return (
    <Modal
      visible={visible}
      closable={false}
      keyboard={false}
      maskClosable={false}
      footer={null}
      style={{ top: 50, textAlign: 'center' }}
    >
      <Title>Entering Auction Room</Title>
      <Text type='danger'>{errorMessage}</Text>
      <AuctionLoadingProgress percent={loadingPercent} status={loadingStatus} />
      <Divider orientation='left'>Progress</Divider>
      <LoadingList items={downloadItemsStatus.current} />
    </Modal>
  );
}

function AuctionLoadingProgress(props) {
  return (
    <Progress
      percent={props.percent}
      showInfo={false}
      status={props.loadingStatus}
    />
  );
}

const LoadingList = memo(function LoadingList(props) {

  const getLoadingIcon = (itemStatus) => {
    switch (itemStatus) {
      case 'pending':
        return <LoadingOutlined style={{ color: '#1a90ff' }} spin />;
      case 'error':
        return <CloseCircleTwoTone twoToneColor='#eb2f96' />;
      case 'success':
        return <CheckCircleTwoTone twoToneColor='#52c41a' />;
      default:
        return null;
    }
  }

  return (
    <List
      itemLayout='horizontal'
      dataSource={props.items}
      renderItem={item => {
        return (
          <List.Item>
            <List.Item.Meta
              avatar={getLoadingIcon(item.status)}
              title={item.name}
            />
          </List.Item>
        );
      }}
    />
  );
});

export default AuctionLoadingModal;