import React from 'react'
import PlayerAccount from './PlayerAccount'

export default function page() {
  return (
    <div className=' w-full h-screen'>
       <div className=' w-full bg-amber-50 flex items-center justify-center h-auto py-12'>
          <div className=' w-full max-w-[1440px] px-4'>
          <PlayerAccount/>

          </div>
      </div>
    </div>
   
  )
}
