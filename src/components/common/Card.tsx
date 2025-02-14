'use client'
import loadingStore from '@/store/loading'
import rateStore from '@/store/rate'
import { Wallet } from 'lucide-react'
import React from 'react'

type Props = {
    name: string
    amount: number
    color: string
    subcolor: string
}
export default function Card( prop: Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const {rate, setRate, clearRate} = rateStore()


  return (
    <div className={` relative flex items-center justify-center w-full max-w-[375px] h-fit  font-normal shadow-sm rounded-xl  text-amber-950 hover:scale-105 transition-all duration-200`}    
    >
        <img src="/assets/card.png" alt="card" className=' w-full h-40' />

        <div className=' w-full h-full flex  absolute'>
            <div className=' w-full flex flex-col gap-2 text-sm p-4'>
                <p className=' '>{prop.name}</p>
                {loading === true ? (
                <h2 className=' ~text-sm/lg font-semibold mt-2'>---</h2>
                ):(

                    <div className=' flex flex-col  mt-2'>
                        <h2 className=' ~text-lg/xl font-black'>₱{prop.amount.toLocaleString()}</h2>
                        <p className=' text-xs text-zinc-700'>${(prop.amount / rate).toLocaleString()}</p>
                    </div>

                )}
                <p className=' text-zinc-700 text-[.7rem]'>Total balance</p>

            </div>

            <div className=' w-[80px] px-6 h-full flex items-center justify-center '>
                <div className={` ~w-12/16 aspect-square rounded-full flex items-center justify-center text-amber-700`}>
                    <Wallet size={30} className=' font-black'/>
                </div>

            </div>

        </div>
    
    </div>
  )
}
