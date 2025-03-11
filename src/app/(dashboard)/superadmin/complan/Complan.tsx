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
import Complancard from '@/components/common/Complancard';
import loadingStore from '@/store/loading';
import refreshStore from '@/store/refresh';
import trainertabStore from '@/store/trainertab';

interface Complan {
    _id: string,
    name: string
    type: string
    min: number,
    max: number,
    duration: number,
    profit: number,
    b1t1: string
    islocked: boolean

}


const items = [
    { id: 1, content: '1', img:'/assets/Dog1.png' },
    { id: 2, content: '2', img:'/assets/Bird1.png' },
    { id: 3, content: '3', img:'/assets/Cat1.png' },
    { id: 4, content: '4', img:'/assets/Fish1.png' },
    { id: 5, content: '5', img:'/assets/Dog2.png' },
    { id: 6, content: '6', img:'/assets/Bird2.png' },
    { id: 7, content: '7', img:'/assets/Cat2.png' },
    { id: 8, content: '8', img:'/assets/Fish2.png' },
    { id: 9, content: '9', img:'/assets/Dog3.png' },
    { id: 10, content: '10', img:'/assets/Bird3.png' },
    { id: 11, content: '10', img:'/assets/cat3.png' },
  ];

export default function Complan() {
    const {tab, setTab, clearTab} = trainertabStore()
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const [store, setStore] = useState<Complan[]>([])
    const {refresh, setRefresh} = refreshStore()


    // const findPets = store.find((item) => item.rank === tab)


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bank/getbanksadmin`,{
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
    },[tab, refresh])




  return (
    <div className="w-full flex flex-col gap-4 font-light py-8">
    
            

            <div className=' w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] place-items-center gap-4 '>
              
                
            {store
            .filter((item) => item.type !== "money_vault" && item.type !== "treasure_chest")
            .map((item, index) => (
              <Complancard 
                key={index} 
                _id={item._id} 
                name={item.name} 
                type={item.type} 
                min={item.min} 
                max={item.max} 
                duration={item.duration} 
                profit={item.profit} 
                b1t1={item.b1t1} 
                islocked={false} 
              />
          ))}

               

            </div>
    
           
        </div>
  )
}
