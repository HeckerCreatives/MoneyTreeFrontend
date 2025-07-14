import Playerlayout from '@/components/layout/Playerlayout'
import React from 'react'
import Store from './Store'
import BuyHistory from './Buyhistory'
export default function page() {
  return (
    <Playerlayout>
       <Store/>
       {/* <BuyHistory/> */}
    </Playerlayout>
  )
}
