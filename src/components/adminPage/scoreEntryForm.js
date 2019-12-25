import React from 'react';

import { InputNumber, Form, Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';


function ScoreEntryForm(props) {


  const teamLabel = (teamObj) => {
    return '(' + teamObj.seed + ') ' + teamObj.name;
  }

  const getFields = () => {
    const { getFieldDecorator } = props.form;
    
    return (
      <Row key={props.gameCode} type='flex' style={{ justifyContent: 'space-between' }}>
        <Col span={10}>
          <Form.Item label={teamLabel(props.team1)} style={{ display: 'flex' }}>
            {getFieldDecorator(`${props.gameCode}_team1`, {
              rules: [
                {
                  type: 'number',
                  message: 'Must be a number'
                }
              ],
              initialValue: props.team1.score
            })(<InputNumber size='small' min={0} max={999} />)}
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label={teamLabel(props.team2)} style={{ display: 'flex' }}>
            {getFieldDecorator(`${props.gameCode}_team2`, {
              rules: [
                {
                  type: 'number',
                  message: 'Must be a number'
                }
              ],
              initialValue: props.team2.score
            })(<InputNumber size='small' min={0} max={999} />)}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type={props.button || 'default'} htmlType='submit' icon='check' name={props.gameCode} loading={props.loading} />
        </Col>
      </Row>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      console.log(props.gameCode);
      console.log(props.gameId);
  
      console.log(values[`${props.gameCode}_team1`]);
      console.log(values[`${props.gameCode}_team2`]);
      console.log(props);

      let team1Score = values[`${props.gameCode}_team1`];
      let team2Score = values[`${props.gameCode}_team2`];

      // if both scores are valid numbers AND either score is changed from its original value
      if (team1Score != null && team2Score != null && 
          (team1Score != props.team1.score || team2Score != props.team2.score)) {
        let scoreObj = {
          team1: {
            id: props.team1.id,
            score: team1Score
          },
          team2: {
            id: props.team2.id,
            score: team2Score
          }
        };
        
        props.setScore(scoreObj, props.round, props.gameId);
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit} name={props.gameCode}>
      {getFields()}
    </Form>
  );
}

const WrappedScoreEntryForm = Form.create({ name: 'scoreEntry' })(ScoreEntryForm);

export default WrappedScoreEntryForm;