import React, { useEffect, useState } from 'react'
import './DetailsCard.scss'

interface IDetailsCardProp {
  title: String
  price: number
  volume: number
  change: number
}

const DetailsCard = ({ title, price, volume, change }: IDetailsCardProp) => {
  const [changeClassName, setChangeClassName] = useState('')
  useEffect(() => {
    if (Math.abs(change) > 0) {
      setChangeClassName(change > 0 ? 'font_green' : 'font_red')
    } else {
      setChangeClassName('font_grey')
    }
  }, [change])
  return (
    <div className="card_container">
      <span className="card_title">{title}</span>
      <span className="card_price">${price}</span>
      <div className="card_details">
        <div>
          <span>volume:</span>
          <span>{Math.abs(volume) > 0 ? volume : '-'}</span>
        </div>
        <div>
          <span>change:</span>
          <span className={changeClassName}>{change}</span>
        </div>
      </div>
    </div>
  )
}

export default DetailsCard
