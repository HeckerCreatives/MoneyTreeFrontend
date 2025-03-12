'use client'
import Playerlayout from '@/components/layout/Playerlayout'
import React from 'react'
import Dashboard from './Dashboard'
import Tables from './Table'
import Playnow from './Playnow'

export default function page() {
  return (
    <Playerlayout>
       

      <Dashboard/>
        <div className=' w-full '>
          <Tables/>
        </div>
    </Playerlayout>
  )
}
