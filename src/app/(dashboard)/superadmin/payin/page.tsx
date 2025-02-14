'use-client'
import Superadminlayout from '@/components/layout/Superadminlayout'
import React from 'react'
import Payin from './Payin'
import Payinhistory from './PayinHistory'

export default function page() {
  return (
    <Superadminlayout>
       <Payin/>
       <Payinhistory/>
    </Superadminlayout>
  )
}
