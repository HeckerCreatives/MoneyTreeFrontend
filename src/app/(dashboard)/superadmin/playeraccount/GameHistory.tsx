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
import { Input } from '@/components/ui/input'

import Superadminlayout from '@/components/layout/Superadminlayout'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'


interface List {
     amount: number,
    createdAt: string
    historyid: string
    bankname: string
    type: string
      
}



export default function GameHistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const { refresh, setRefresh} = refreshStore()
    const params = useSearchParams()
    const id = params.get('id')
    const [open, setOpen] = useState(false)


    useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/inventory/dailyclaimhistorysa?page=${currentpage}&limit=10&playerid=${id}`,
              { withCredentials: true }
            );

             setList(response.data.data.history)
             setTotalPage(response.data.data.totalpages)
    
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
      }, [refresh]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

     const deletHistory = async (data: string) => {
        setLoading(true);
        setRefresh('true')
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/deletedailyclaimhistorysa`, {
                historyid: data
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const response = await toast.promise(request, {
                loading: `Deleting history...`,
                success: `Successfully deleted `,
                error: `Error while deleting history.`,
            });
            if (response.data.message === 'success') {
                setLoading(false);
                // window.location.reload()
              setRefresh('false')
              setOpen(false)

            }
        } catch (error) {
            setLoading(false);
    
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string, data: string }>;
                if (axiosError.response && axiosError.response.status === 401) {
                    toast.error(`${axiosError.response.data.data}`);
                    router.push('/');
                }
    
                if (axiosError.response && axiosError.response.status === 400) {
                    toast.error(`${axiosError.response.data.data}`);
                }
    
                if (axiosError.response && axiosError.response.status === 402) {
                    toast.error(`${axiosError.response.data.data}`);
                }
    
                if (axiosError.response && axiosError.response.status === 403) {
                    toast.error(`${axiosError.response.data.data}`);
                }
    
                if (axiosError.response && axiosError.response.status === 404) {
                    toast.error(`${axiosError.response.data.data}`);
                }
            }
        }
    };



  return (
        <div className=' w-full bg-cream flex flex-col gap-6 p-4  min-w-[300px] rounded-md mt-12'>
        <p className=' text-sm font-semibold'>Game Daily Claim History</p>
         <Table className=' w-full'>
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
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                {/* <TableHead>Rank</TableHead> */}
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="">{item.bankname}</TableCell>
                    <TableCell className="">₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    {/* <TableCell className="">{item.rank}</TableCell> */}
                    <TableCell className="">
                      <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger className=' text-[.7rem] bg-red-500 text-white p-1 rounded-md flex items-center gap-1'><Trash2 size={15}/></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the history.
                          </DialogDescription>
                        </DialogHeader>

                        <div className=' w-full flex items-end justify-end'>
                          <button disabled={loading} 
                          onClick={() => deletHistory(item.historyid)} 
                          className=' px-4 py-2 text-xs bg-red-500 text-white rounded-md'>Continue</button>

                        </div>
                      </DialogContent>
                    </Dialog>


                    </TableCell>
                     
                 
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {list.length !== 0 && (
                <div className=' w-full flex items-center justify-center'>
                    <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )}
    </div>
  )
}
