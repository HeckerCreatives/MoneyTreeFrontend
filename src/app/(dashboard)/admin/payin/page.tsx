'use-client'
import Superadminlayout from '@/components/layout/Superadminlayout'
import React from 'react'
import Payin from './Payin'
import Payinhistory from './PayinHistory'
import Adminlayout from '@/components/layout/Adminlayout'

export default function page() {
  return (
    <Adminlayout>
       <Payin/>
       <Payinhistory/>
    </Adminlayout>
  )
}
