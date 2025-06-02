'use client'
import Pagination from '@/components/common/Pagination'
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
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Maintenance from './Maintenance'
import loadingtableStore from '@/store/tableloading'
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'

interface List {
    username: string
    amount: number,
    date: string
    rank: number
}

interface Lead {
  username: string,
  amount: number,
  rank: number
}

export default function Leaderboard() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [listlead, setListLead] = useState<Lead[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const {refresh, setRefresh} = refreshStore()
    const [search, setSearch] = useState('')
    const [dates, setDates] = useState<string[]>([])
    const [date, setDate] = useState('')

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setLoading(true);
      
        const delayDebounceFn = setTimeout(async () => {
          try {
            const encodedDate = encodeURIComponent(date)
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardhistory?date=${encodedDate}`,
              {
                withCredentials: true,
              }
            );
      
           setList(response.data.data)
            setTotalPage(response.data.data.totalPages);
            setLoading(false);
          } catch (error) {
            setLoading(false);
      
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string; data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
               
              }
            }
          }
        }, 500); 
      
       
        return () => clearTimeout(delayDebounceFn);
      }, [currentpage, refresh, search, router, date]); 

      useEffect(() => {
        setLoading(true);
      
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardsa?page&limit`,
              {
                withCredentials: true,
              }
            );

            setListLead(response.data.data.top10)
            setTotalPage(response.data.data.totalPages);
            setLoading(false);
          } catch (error) {
            setLoading(false);
      
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string; data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
               
              }
            }
          }
        }, 500); 
      
       
        return () => clearTimeout(delayDebounceFn);
      }, [currentpage, refresh, search, router]); 


      useEffect(() => {
        setLoading(true);
      
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardhistorydates`,
              {
                withCredentials: true,
              }
            );

           setDates(response.data.data)
           setDate(response.data.data[0])
            setLoading(false);
          } catch (error) {
            setLoading(false);
      
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string; data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
               
              }
            }
          }
        }, 500); 
      
       
        return () => clearTimeout(delayDebounceFn);
      }, []); 



    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }


  return (

    <div className=' w-full p-8 flex flex-col gap-4'>
        <Maintenance/>

        <div className=' w-full flex flex-col gap-6 items-center justify-center lg:p-6 bg-cream rounded-md'>

           <div className=' w-full flex items-center'>
                  <h2 className=' text-xl font-bold text-black'>Leaderboard</h2>
          
                  </div>
              <Table>
                {loading === true && (
                    <TableCaption>
                        <span className=' loaderdark'></span>
                    </TableCaption>
                )}
                {listlead.length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
                <TableRow>
                <TableHead className="">Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Username</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listlead.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell>{item.rank}</TableCell>

                    <TableCell className=' flex flex-col'>{item.amount.toLocaleString()}</TableCell>

                    <TableCell>{item.username}</TableCell>
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            <div className=' w-full flex flex-col gap-4 items-start mt-6'>
              <p className=' text-lg text-start'>History</p>

              <Select value={date} onValueChange={setDate}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className=" text-xs">
                {dates.map((item, index) => (
                <SelectItem key={index} value={item}>{item}</SelectItem>

                ))}
                
              </SelectContent>
            </Select>
            </div>

            


                <Table className=' mt-4'>
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
                {/* <TableHead className="">Date</TableHead> */}
                <TableHead className="">Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Username</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    {/* <TableCell className="">{new Date(item.date).toLocaleString()}</TableCell> */}
                    <TableCell>{item.rank}</TableCell>

                    <TableCell className=' flex flex-col'>{item.amount.toLocaleString()}</TableCell>

                    <TableCell>{item.username}</TableCell>
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

          
      </div>
    
    </div>

    

      
  )
}
