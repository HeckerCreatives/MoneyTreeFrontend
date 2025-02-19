import Playerlayout from '@/components/layout/Playerlayout'
import React from 'react'
import ClaimHistory from './Claimhistory'
import Mybanks from './Mybanks'


export default function page() {
  return (
    <Playerlayout>
       <Mybanks/>
       <ClaimHistory/>
    </Playerlayout>
  )
}
