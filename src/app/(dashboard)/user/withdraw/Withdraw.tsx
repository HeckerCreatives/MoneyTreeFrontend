'use client'
import React, { useEffect, useState } from 'react'
import History from './History'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Withdrawform from '@/components/forms/Withdrawform'
import Withdrawhistory from './History'
import loadingStore from '@/store/loading'
import rateStore from '@/store/rate'

  

interface Wallet {
    gamebalance: 0,
    fiatbalance: 0,
    commissionbalance: 0
}


export default function Withdraw() {

    const router = useRouter()
    const [wallet, setWallet] = useState<Wallet>()
    const { loading, setLoading, clearLoading } = loadingStore()
    const [referral, setReferral] = useState('')
    const [unclaimed, setUnclaimed] = useState(0)
    const {rate} = rateStore()


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/playerwallets`,{
            withCredentials:true
            })

            setWallet(response.data.data)
            setLoading(false)
          
          } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string, data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
                  
                }    
              } 
          }
        }
        getWallets()
    },[])

    console.log(rate)


  return (
    <div className="w-full flex flex-col gap-8 font-light py-8">
        <div className=' w-auto flex flex-wrap gap-4 items-center '>

            <div className=' relative flex items-center justify-center w-full max-w-[400px] h-[170px] shadow-sm rounded-md'>
                <img src="/assets/card.png" alt="card" className=' max-w-[400px] w-full max-h-[200px] h-full'/>
                <div className=' p-6 absolute w-full '>
                    <div className=' flex flex-col'>
                        <p className=' text-sm/lg font-bold'>Game Wallet Ballance</p>
                        <p className=' text-xs text-zinc-500 mt-2'>Total earnings</p>
                        <h2 className=' ~text-xl/2xl font-medium '>₱{wallet?.gamebalance.toLocaleString()}</h2>
                        <h2 className=' text-[.7rem] '>${((wallet?.gamebalance || 0) / rate).toLocaleString()}</h2>

                        <Withdrawform wallet={'Game Wallet Ballance'} type={'gamebalance'}/>
                    </div>

                </div>

            </div>

            <div className=' relative flex items-center justify-center w-full max-w-[400px] h-[170px] shadow-sm rounded-md'>
                <img src="/assets/card.png" alt="card" className=' max-w-[400px] w-full max-h-[220px] h-full'/>
                <div className=' p-6 absolute w-full items-center justify-center text-amber-950'>
                    <div className=' flex flex-col'>
                        <p className=' text-sm/lg font-bold'>Commission Wallet Ballance</p>
                        <p className=' text-xs mt-2'>Total earnings</p>
                        <h2 className=' ~text-xl/2xl font-medium '>₱{wallet?.commissionbalance.toLocaleString()}</h2>
                        <h2 className=' text-[.7rem] '>${((wallet?.commissionbalance || 0) / rate).toLocaleString()}</h2>


                        <Withdrawform wallet={'Commission Wallet Ballance'} type={'commissionbalance'}/>
                    </div>

                </div>

            </div>

        </div>

        <Withdrawhistory/>

       

    </div>
  )
}
