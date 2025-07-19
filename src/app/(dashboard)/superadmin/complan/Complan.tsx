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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Complantreecard from '@/components/common/ComplanTreeCard';

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

interface ComplanTree {
  duration: number
  id: string
  isActive: boolean
  limit: number
  name: string
  price: number
  profit: number
  stocks: number
  type: string

}



export default function Complan() {
    const {tab, setTab, clearTab} = trainertabStore()
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const [store, setStore] = useState<Complan[]>([])
    const [tree, setTree] = useState<ComplanTree[]>([])
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

      useEffect(() => {
        setLoading(true)
        const getData = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tbank/gettbankadmin`,{
            withCredentials:true
            })

            setLoading(false)
            setTree(response.data.data)
            console.log(response.data)
            
          } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string, data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
                 
                }    
              } 
          }
        }
        getData()
    },[ refresh])


      const preferredOrder = ["Lanzones", "Rambutan", "Avocado", "Mango", "Moneytree"];

        const sortedTree = [...tree]
        .map(item => ({
            ...item,
        }))
        .sort((a, b) => {
            const indexA = preferredOrder.indexOf(a.name);
            const indexB = preferredOrder.indexOf(b.name);
            return indexA - indexB;
        });






  return (
    <div className="w-full flex flex-col gap-4 font-light py-8">

      <Tabs defaultValue="bank" className="w-full">
      <TabsList>
        <TabsTrigger value="bank">Bank</TabsTrigger>
        <TabsTrigger value="tree">Tree</TabsTrigger>
      </TabsList>
      <TabsContent value="bank">
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
      </TabsContent>
      <TabsContent value="tree">
          <div className=' w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] place-items-center gap-4 '>
            {sortedTree.map((item, index) => (
              <Complantreecard 
                key={index}
                _id={item.id}
                name={item.name}
                type={item.type}
                price={item.price}
                duration={item.duration}
                profit={item.profit}
                isActive={item.isActive}
                islocked={false} limit={item.limit} stocks={item.stocks}/>
          ))}
        </div>
      </TabsContent>
    </Tabs>
         
    </div>
  )
}
