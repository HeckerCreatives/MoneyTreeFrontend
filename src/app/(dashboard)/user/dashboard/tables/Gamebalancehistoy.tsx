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
import loadingtableStore from '@/store/tableloading'
import rateStore from '@/store/rate'


interface List {
    createdAt: string
    amount: number
    username: string
    type:string 
    fromusername: string
    banktype:string
    bankname: string

}

export default function Gamebalanacehistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/playerwallethistory?type=gamebalance&page=${currentpage}&limit=10`,{
            withCredentials:true
            })

            setList(response.data.data.history)
            setTotalPage(response.data.data.pages)
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
    },[currentpage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }


  return (
     <div className=' w-full flex flex-col gap-4 h-[500px]  rounded-xl shadow-sm mt-4'>
        <p className=' text-sm font-medium'>Game Wallet Earning History</p>
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
                <TableHead>Bank Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className=' '>
                        <div className='flex flex-col'>
                        ₱{item?.amount?.toLocaleString() || 0} <span className=' text-[.6rem] text-zinc-500'>${(item?.amount || 0 / rate).toLocaleString()}</span>
                        </div>
                    </TableCell>
                    <TableCell>{item.bankname}</TableCell>
                   
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
