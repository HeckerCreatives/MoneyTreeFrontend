'use client'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loadhistory from './tables/Loadhistory'
import Comissionhistory from './tables/Comissionhistory'
import Referralhistory from './tables/Referralhistory'
import Gamebalanacehistory from './tables/Gamebalancehistoy'
import Comissionwithdrawhistory from './tables/Comissionwithdrawhistory'
import Gamewithdrawhistory from './tables/Gamewithdrawhistory'
import Transferfundshistory from './tables/Transferfundshistory'
  
  

export default function Tables() {
  const [tab, setTab] = useState('tab1')

  return (
    <div className=' w-full h-auto bg-[#F9F1DB] rounded-xl shadow-sm p-6'>
      <Select value={tab} onValueChange={setTab}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='tab1'>Load Balance History</SelectItem>
        <SelectItem value='tab2'>Commission History (Lvl 2-10)</SelectItem>
        <SelectItem value='tab3'>Referral History (Lvl 1)</SelectItem>
        <SelectItem value='tab4'>Game Wallet Earning History</SelectItem>
        <SelectItem value='tab5'>Commission Withdraw History</SelectItem>
        <SelectItem value='tab6'>Game Withdraw History</SelectItem>
        {/* <SelectItem value='tab7'>Transfer Funds History</SelectItem> */}
      </SelectContent>
    </Select>

    {tab === 'tab1' && (
      <Loadhistory/>
    )}

    {tab === 'tab2' && (
      <Comissionhistory/>
    )}

    {tab === 'tab3' && (
      <Referralhistory/>
    )}

    {tab === 'tab4' && (
      <Gamebalanacehistory/>
    )}

    {tab === 'tab5' && (
      <Comissionwithdrawhistory/>
    )}  

    {tab === 'tab6' && (
      <Gamewithdrawhistory/>
    )}  

    {tab === 'tab7' && (
      <Transferfundshistory/>
    )}  

    </div>
  )
}
