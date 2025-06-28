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
import { useRouter } from 'next/navigation'
import Pagination from '@/components/common/Pagination'
import { Input } from '@/components/ui/input'
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'

interface List {
    _id: string
    totalValue: number

}



export default function Saleshistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const [search, setSearch] = useState('')
    const { refresh, setRefresh} = refreshStore()
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/analytics/gettotalpayinperday?startDate=${start}&endDate=${end}`,
              { withCredentials: true }
            );

            setList(response.data.data.analytics)
    
          } catch (error) {
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string; data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
               
              }
            }
          } finally {
            setLoading(false);
          }
        }, 500); 
    
        return () => clearTimeout(delayDebounceFn); 
      }, [start, end, refresh]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

   


  return (
     <div className=' w-full flex flex-col gap-4 h-[500px] bg-cream rounded-xl shadow-sm my-8 p-6'>
        <div className=' w-full flex flex-col gap-4 '>
        <p className=' text-sm font-medium'>Sales History</p>

        <div className=' flex flex-wrap gap-4 items-center'>
            <div className=' flex flex-col gap-1'>
                <label htmlFor="" className=' text-xs'>Start Date</label>
                <Input type='date' value={start} onChange={(e) => setStart(e.target.value)} placeholder='Search user...' className=' bg-gray-100 w-fit'/>

            </div>

            <div className=' flex flex-col gap-1'>
                <label htmlFor="" className=' text-xs'>End Date</label>
                <Input type='date' value={end} onChange={(e) => setEnd(e.target.value)} placeholder='Search user...' className=' bg-gray-100 w-fit'/>


            </div>

        </div>
        </div>
            <Table>
                {loading === true && (
                    <TableCaption>
                        <span className=' loaderdark'></span>
                    </TableCaption>
                )}
                {list.length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
                <TableRow>
                <TableHead className="">Date</TableHead>
                <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{item._id}</TableCell>
                    <TableCell className=' flex flex-col'>₱{item.totalValue.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.totalValue / rate).toLocaleString()}</span></TableCell>

                 
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {/* {list.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )} */}
        
    </div>
  )
}
