"use client"
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import loadingStore from '@/store/loading';
import trainertabStore from '@/store/trainertab';
import BanksStore from '@/components/common/BanksStore';

interface Bank {
  _id: string
  type:string
  name: string
  min: number
  max: number
  profit: number 
  duration: number
  b1t1: string
}

export default function Store() {
    const {tab, setTab, clearTab} = trainertabStore()
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const [store, setStore] = useState<Bank[]>([])


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bank/getbanks`,{
            withCredentials:true
            })

            setLoading(false)
            setStore(response.data.data)
            
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
    },[tab])




  return (
    <div className="w-full flex flex-col gap-4 font-light py-8">

            <div className=' w-full grid grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-4 h-fit place-items-center '>

              {store
              .filter((item) => item.type !== "money_vault" && item.type !== "treasure_chest")
              .map((item, index) => (
                <BanksStore key={index} _id={item._id} type={item.type} name={item.name} min={item.min} max={item.max} profit={item.profit} duration={item.duration} b1t1={item.b1t1} locked={['Money Vault', 'Treasure Chest'].includes(item.name)}/>
              ))}

              
            </div>
    
           
        </div>
  )
}
