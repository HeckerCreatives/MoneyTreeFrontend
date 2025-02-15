import Changepasswordadmin from '@/components/forms/Changepasswordadmin'
import Conversionrate from '@/components/forms/Conversionrate'
import React from 'react'
import Socialmedias from './Socialmedias'

export default function Settings() {
  return (
    <div className="w-full flex flex-col gap-8 py-8">
    

        <div className=' w-full flex-wrap flex gap-4'>
           <Changepasswordadmin/>
           <Conversionrate/>
           <Socialmedias/>
        </div>

    </div>
  )
}
