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
import DeletePayinHistory from '@/components/common/DeletePayinHistory'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ApprovedPayin from './ApprovedPayin'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

interface List {
    id: string
    username: string
    userid: string
    firstname: string
    lastname: string
    value: string
    status:  string
    createdAt: string
    processby: string

}



export default function Payinhistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const [search, setSearch] = useState('')
    const [date, setDate] = useState('')
    const { refresh, setRefresh} = refreshStore()



    useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/payin/getpayinhistorysuperadmin?page=${currentpage}&limit=10&searchUsername=${search}&date=${date}`,
              { withCredentials: true }
            );
    
            setList(response.data.data.payinhistory);
            setTotalPage(response.data.data.totalPages);
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
    }, [currentpage, search, refresh, date]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const reset = () => {
      setSearch('')
      setDate('')
    }

   


  return (
     <div className=' w-full flex flex-col gap-4 h-auto  bg-cream rounded-xl shadow-sm mt-4 p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Payin History</p>
        <div className=' flex gap-2'>
          <Input value={date} onChange={(e) => setDate(e.target.value)} type='date'/>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user...' className=' w-fit'/>
          <Button onClick={reset}><RefreshCcw size={20}/></Button>
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
                <TableHead>Username</TableHead>
                <TableHead>Send by</TableHead>
                {/* <TableHead>Approved by</TableHead> */}
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className=' flex flex-col'>₱{item.value.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.value as any / rate).toLocaleString()}</span></TableCell>

                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.processby}</TableCell>
                    {/* <TableCell>{item.processby}</TableCell> */}
                    <TableCell className=' flex gap-2'>
                      <DeletePayinHistory id={item.id} userid={item.userid}/>
                      {/* <ApprovedPayin data={item}/> */}
                    </TableCell>
                    {/* <TableCell>{item.firstname}</TableCell>
                    <TableCell>{item.lastname}</TableCell> */}
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {list.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )}
        
    </div>
  )
}
