'use client'
import Card from '@/components/common/Card'
import Superadminlayout from '@/components/layout/Superadminlayout'
import React, { useEffect, useState } from 'react'
import Chart from './Chart'
import LongChart from './LongChart'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Users, Wallet } from 'lucide-react'
import rateStore from '@/store/rate'
import loadingtableStore from '@/store/tableloading'
import Adminlayout from '@/components/layout/Adminlayout'

interface AdminWallets {
  commission: number,
  products: number,
  commissioned: number,
  registered: number,
  payin: number,
  payoutgame: number,
  payoutcommission: number,
  payout: number,
  adminfeewallet: number
  referral: number,
  unilevel: number,
  direct: number,
  unilevelbalance: number,
  gamewalletbalance: number
}

export default function page() {
  const router = useRouter()
  const {loading, setLoading, clearLoading} = loadingtableStore()
  const {rate, setRate, clearRate} = rateStore()
  const [wallets, setWallets] = useState<AdminWallets>()
  const [totalsales, setTotalsales] = useState(0)


  useEffect(() => {
    setLoading(true)
    const getList = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/staffuser/getsadashboard`,{
        withCredentials:true
        })

        setLoading(false)
        setWallets(response.data.data)

        setTotalsales(response.data.data.commission + response.data.data.payin)
      } catch (error) {
        setLoading(false)

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string, data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
             
            }    
          } 
      }
    }
    getList()
},[])


  return (
    <Adminlayout>
        <div className=' w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] place-items-center mt-12 gap-4'>
          {/* <Card name={'Total Sales'} amount={totalsales} color={''} subcolor={''} editable={false}/>
         <Card name={'Total User Commission'} amount={(wallets?.direct ?? 0) + (wallets?.unilevelbalance ?? 0)} color={''} subcolor={''} editable={false}/>
         <Card name={'User Top Up'} amount={wallets?.payin || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'Total Payout'} amount={wallets?.payout || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Game Wallet'} amount={wallets?.gamewalletbalance || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Referral Commission'} amount={wallets?.direct || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Unilevel Commission'} amount={wallets?.unilevelbalance || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'Total Company Profit'} amount={totalsales - (wallets?.payout || 0)} color={''} subcolor={''} editable={false}/>
         <Card name={'Game Profit'} amount={wallets?.products || 0} color={''} subcolor={''} editable={false}/> */}

         <Card name={'Total Sales'} amount={wallets?.payin || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'Total User Commission'} amount={(wallets?.referral ?? 0) + (wallets?.unilevel ?? 0)} color={''} subcolor={''} editable={false}/>
         {/* <Card name={'User Top Up'} amount={wallets?.payin || 0} color={''} subcolor={''} editable={false}/> */}
         <Card name={'Total Payout'} amount={wallets?.payout || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Game Wallet'} amount={wallets?.gamewalletbalance || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Referral Commission'} amount={wallets?.direct || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'User Unilevel Commission'} amount={wallets?.unilevelbalance || 0} color={''} subcolor={''} editable={false}/>
         <Card name={'Total Company Profit'} amount={(wallets?.payin || 0) - (wallets?.payout || 0)} color={''} subcolor={''} editable={false}/>
         <Card name={'Game Profit'} amount={wallets?.products || 0} color={''} subcolor={''} editable={false}/>
         

        
          <div className={` relative flex items-center justify-center w-full max-w-[375px] h-fit  font-normal shadow-sm rounded-xl  text-amber-950 hover:scale-105 transition-all duration-200`}    
            >
                <img src="/assets/card.png" alt="card" className=' w-full h-40' />
        
                <div className=' w-full h-full flex  absolute'>
                    <div className=' w-full flex flex-col gap-2 text-sm p-4'>
                        <p className=' '>User Account</p>
                        {loading === true ? (
                          <h2 className=' ~text-sm/lg font-semibold mt-2'>---</h2>
                          ):(

                              <div className=' flex flex-col  mt-2'>
                                  <h2 className=' ~text-xl/2xl font-semibold'>{(wallets?.registered || 0).toLocaleString()}</h2>
                              </div>

                          )}
                          <p className=' text-zinc-700 text-[.7rem]'>Total users</p>
        
                    </div>
        
                    <div className=' w-[80px] px-6 h-full flex items-center justify-center '>
                        <div className={` ~w-12/16 aspect-square rounded-full flex items-center justify-center text-amber-700`}>
                            <Users size={30} className=' font-black'/>
                        </div>
        
                    </div>
        
                </div>
            
          </div>

        </div>
        <LongChart/>
    </Adminlayout>
  )
}
