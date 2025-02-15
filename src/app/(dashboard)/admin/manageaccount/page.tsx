import Superadminlayout from '@/components/layout/Superadminlayout'
import React from 'react'
import ManageAccount from './ManageAccount'
import Adminlayout from '@/components/layout/Adminlayout'

export default function page() {
  return (
    <Adminlayout>
        <ManageAccount/>
    </Adminlayout>
  )
}
