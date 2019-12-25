import React, { useState, useEffect } from 'react';
import CanvasJSReact from '../../canvas/canvasjs.react';
import './auctionChart.css';
import { Data } from '../../utilities/data';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AuctionChart(props) {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (Data.leagueInfo) {
      let userArr = Data.leagueInfo.users.map(user => {
        console.log(user);
        return (
          { y: user.buyIn, label: user.name }
        );
      })
      console.log(userArr);
      setUsers(userArr);
    }
    
  }, [Data.leagueInfo]);

  const options = {
    animationEnabled: true,
    title: {
      text: 'Auction Breakdown'
    },
    data: [
      {
        type: 'pie',
        startAngle: 75,
        toolTipContent: '<b>{label}</b>: ${y}',
        showInLegend: true,
        legendText: '{label}',
        indexLabelFontSize: 14,
        indexLabel: '{label} - ${y}',
        dataPoints: users
      }
    ]
  };

  if (props.status == 'in-progress') {
    return (
      <div className='auction-breakdown'>
        <CanvasJSChart options={options} />
      </div>
    );
  } else {
    return null;
  }
  
}

export default AuctionChart;