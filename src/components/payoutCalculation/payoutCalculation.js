import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Card, Col, Radio, Row, Select, Button, message } from 'antd';
import CommissionerFeeInput from './commissionerFeeInput';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import { useSettingsDispatch } from '../../context/leagueSettingsContext';

const { Option } = Select;

function PayoutCalculation() {

  const [selectedCalcOption, setSelectedCalcOption] = useState(null);
  const [commissionerFee, setCommissionerFee] = useState(null);
  const [commissionerFeeType, setCommissionerFeeType] = useState(null);
  const [isSettingChanged, setIsSettingChanged] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const calcOptions = useRef([]);

  const { authenticated } = useAuthState();
  const { leagueId, roleId } = useLeagueState();

  const settingsDispatch = useSettingsDispatch();

  const [payoutSettings, settingsFetchDate, getSettings] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}?settingClass=Payout`,
    method: 'GET',
    processData: null,
    conditions: [authenticated, leagueId]
  });

  const [setPayoutSettingsResponse, setPayoutSettingsResponseDate, setPayoutSettings] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS,
    method: 'POST',
    processData: null,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      downloadSettings();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (payoutSettings) {
      // parse allowed calculation options
      if (payoutSettings.allowed && payoutSettings.allowed.length > 0) {
        const calcAllowed = payoutSettings.allowed.filter(val => {
          return val.Code === 'PAYOUT_CALCULATION_MODE';
        });
  
        calcOptions.current = calcAllowed;
      }

      if (payoutSettings.settings && payoutSettings.settings.length > 1) {
        // parse selected calculation option
        const selectedCalcOption = payoutSettings.settings.find(s => s.Code === 'PAYOUT_CALCULATION_MODE');
        setSelectedCalcOption(selectedCalcOption.SettingValue);
        settingsDispatch({ type: 'update', key: 'calcOption', value: selectedCalcOption.SettingValue });

        // parse current commissioner's fee value
        const feePercent = payoutSettings.settings.find(s => s.Code === 'COMMISSIONER_FEE_PERCENT');
        const feeAbsolute = payoutSettings.settings.find(s => s.Code === 'COMMISSIONER_FEE_ABSOLUTE');

        if (feePercent.SettingValue != null) {
          setCommissionerFeeType('percent');
          setCommissionerFee(feePercent.SettingValue);
        } else if (feeAbsolute.SettingValue != null) {
          setCommissionerFeeType('absolute');
          setCommissionerFee(feeAbsolute.SettingValue);
        }
      }
    }
  }, [settingsFetchDate]);

  useEffect(() => {
    if (setPayoutSettingsResponseDate != undefined) {
      setUpdateLoading(false);
      setIsSettingChanged(false);
      message.success('Settings Saved');
    }
  }, [setPayoutSettingsResponseDate]);

  const downloadSettings = () => {
    getSettings();
  }

  const calcOptionSelected = (opt) => {
    setIsSettingChanged(true);
    setSelectedCalcOption(opt);
    settingsDispatch({ type: 'update', key: 'calcOption', value: opt });
  }

  const commissionerFeeTypeChange = (event) => {
    setIsSettingChanged(true);
    setCommissionerFeeType(event.target.value)
  }

  const commissionerFeeChange = (value) => {
    setIsSettingChanged(true);
    setCommissionerFee(value);
  }

  const generateCalcOptions = () => {
    if (calcOptions.current.length) {
      return calcOptions.current.map(opt => {
        return <Option key={opt.AllowedValue} value={opt.AllowedValue}>{opt.AllowedValue}</Option>;
      });
    }

    return null;
  }

  const sendUpdatePayoutSettingsRequest = () => {
    // I don't like this hard-coded junk any more than you do
    const updatedSettings = [
      {
        settingParameterId: 9,
        settingValue: selectedCalcOption
      },
      {
        settingParameterId: 10,
        settingValue: commissionerFeeType === 'percent' ? commissionerFee : null
      },
      {
        settingParameterId: 11,
        settingValue: commissionerFeeType === 'absolute' ? commissionerFee : null
      }
    ]

    const payload = {
      leagueId: leagueId,
      settings: updatedSettings
    };

    setUpdateLoading(true);
    setPayoutSettings(payload);
  }

  return (
    <Fragment>
      <Row justify='space-around'>
        <Col md={10} xs={12}>
          <Card title='Calculation Mode' style={{ height: '100%' }}>
            <Select value={selectedCalcOption} style={{ width: '100%' }} onChange={calcOptionSelected}>
              {generateCalcOptions()}
            </Select>
          </Card>
        </Col>
        <Col md={10} xs={12}>
          <Card title={'Commissioner\'s Fee'} style={{ height: '100%' }}>
            <Row justify='center'>
              <Radio.Group onChange={commissionerFeeTypeChange} value={commissionerFeeType}>
                <Radio value='percent'>Percentage</Radio>
                <Radio value='absolute'>Absolute</Radio>
              </Radio.Group>
            </Row>
            <Row justify='center'>
              <CommissionerFeeInput
                inputType={commissionerFeeType}
                minValue={null}
                maxValue={null}
                feeValue={commissionerFee}
                feeValueChange={commissionerFeeChange}
              />
            </Row>
          </Card>
        </Col>
      </Row>
      { roleId == 1 || roleId == 2 ? 
        <Row justify='center'>
          <Button
            type='primary'
            style={{ marginTop: 8 }}
            disabled={!isSettingChanged}
            onClick={sendUpdatePayoutSettingsRequest}
            loading={updateLoading}
          >
            Save Changes
          </Button>
        </Row>
        :
        null
      }
    </Fragment>
  );
}

export default PayoutCalculation;