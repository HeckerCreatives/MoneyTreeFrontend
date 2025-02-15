'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/common/Pagination'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { object } from 'zod'
import { Input } from '@/components/ui/input'
import { RefreshCcw } from 'lucide-react'
import rateStore from '@/store/rate'
import loadingtableStore from '@/store/tableloading'
  

interface List {
    username: string
    directReferralBalance:number ,
    commissionBalance: number,
    totalBalance: number

}

export default function Topcommission() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
 


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/gettopcommissions?startDate=${start}&endDate=${end}`,{
            withCredentials:true
            })

            setList(response.data.data)
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
        getList()
    },[start, end])


  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm my-8 p-6'>
       

        <p className=' text-sm font-medium'>Top commssion list</p>

        <div className=' flex flex-wrap items-center gap-4'>
            <div className=' flex flex-col'>
                <label htmlFor="" className=' text-xs'>Start date</label>
                <Input value={start} onChange={(e) => setStart(e.target.value)} type='date'/>
            </div>

            <div className=' flex flex-col'>
                <label htmlFor="" className=' text-xs'>End date</label>
                <Input value={end} onChange={(e) => setEnd(e.target.value)} type='date'/>
            </div>

            <RefreshCcw size={15} className=' cursor-pointer' onClick={() => {setStart(''), setEnd('')}}/>

        </div>
            <Table>
                {loading === true && (
                    <TableCaption>
                        <span className=' loaderdark'></span>
                    </TableCaption>
                )}
                {Object.values(list).length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
                <TableRow>
                <TableHead className=""></TableHead>
                <TableHead className="">Username</TableHead>
                <TableHead className="">Commission</TableHead>
                <TableHead className="">Direct referral</TableHead>
                <TableHead>Total balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.values(list).map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{index + 1}</TableCell>
                    <TableCell className="">{item.username}</TableCell>

                    <TableCell className=' '>
                        <div className='flex flex-col'>
                        ₱{item.commissionBalance.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.commissionBalance / rate).toLocaleString()}</span>
                        </div>
                    </TableCell>

                    <TableCell className=' '>
                        <div className='flex flex-col'>
                        ₱{item.directReferralBalance.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.directReferralBalance / rate).toLocaleString()}</span>
                        </div>
                    </TableCell>

                    <TableCell className=' '>
                        <div className='flex flex-col'>
                        ₱{item.totalBalance.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.totalBalance / rate).toLocaleString()}</span>
                        </div>
                    </TableCell>
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

    </div>
  )
}
