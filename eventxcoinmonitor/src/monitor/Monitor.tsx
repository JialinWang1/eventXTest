import React from 'react'
import DetailsCard from './DetailsCard/DetailsCard'
import './Monitor.scss'

const Monitor = () => {
  return (
    <div className="monitor_container">
      <span className="monitor_title">Cryptocurrency Realtime Price</span>
      <div className="monitor_body">
        <DetailsCard title={'Bitcoin'} price={1102303.2132312} volume={2} change={0} />
        <DetailsCard title={'Bitcoin'} price={1102303.2132312} volume={0} change={5} />
        <DetailsCard title={'Bitcoin'} price={1102303.2132312} volume={0} change={-5} />
        <DetailsCard title={'Bitcoin'} price={1102303.2132312} volume={5} change={-5} />
        <DetailsCard title={'Bitcoin'} price={1102303.2132312} volume={0} change={-5} />
      </div>
    </div>
  )
}

export default Monitor
