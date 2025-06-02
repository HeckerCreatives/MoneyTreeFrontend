'use client'
import Pagination from '@/components/common/Pagination'
import Changepassworduser from '@/components/forms/Changepassworduser'
import Superadminlayout from '@/components/layout/Superadminlayout'
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import axios, { AxiosError } from 'axios'
import { Table } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Leaderboard from './Table'
import loadingtableStore from '@/store/tableloading'
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'

interface List {
    username: string
    amount: number,
    date: string
    rank: number
}

export default function page() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const {refresh, setRefresh} = refreshStore()
    const [search, setSearch] = useState('')

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setLoading(true);
      
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getleaderboardhistory?page&limit`,
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
      }, [currentpage, refresh, search, router]); 



    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }


  return (
    <Superadminlayout>
     <Leaderboard/>
    </Superadminlayout>
  )
}
