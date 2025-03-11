import Changepasswordadmin from '@/components/forms/Changepasswordadmin'
import Conversionrate from '@/components/forms/Conversionrate'
import React from 'react'
import Socialmedias from './Socialmedias'
import Masterkey from '@/components/forms/Masterkey'
import Masterkeyhistory from './Masterkeyhistory'
import Masterkeys from './Masterkeys'
import Weather from '@/components/common/Weather'

export default function Settings() {
  return (
    <div className="w-full flex flex-col gap-8 py-8">
    

        <div className=' w-full flex-wrap flex gap-4'>
           <Changepasswordadmin/>
           <Conversionrate/>
           <Socialmedias/>
          <Weather/>

          <Masterkeys/>
        </div>

    </div>
  )
}
