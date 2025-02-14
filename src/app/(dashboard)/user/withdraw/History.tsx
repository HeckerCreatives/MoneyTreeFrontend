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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'

interface List {
    date: string
    grossamount: number
    withdrawalfee: number
    netammount: number
    status: string

}

export default function Withdrawhistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {refresh, setRefresh} = refreshStore()
    const {rate, setRate, clearRate} = rateStore()
    const [wallet, setWallet] = useState('gamebalance')


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payout/getrequesthistoryplayer?type=${wallet}&page=${currentpage}&limit=10`,{
            withCredentials:true
            })

            setList(response.data.data.history)
            setTotalPage(response.data.data.totalPages)
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
    },[currentpage, wallet, refresh])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const statusColor = (data: string) => {
      if(data === 'In review'){
        return 'text-blue-500'
      } else  if(data === 'done'){
        return 'text-green-500'
      } else {
        return 'text-red-500'
      }
    }


  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm mt-4 p-6'>
        <p className=' text-sm font-medium'>Withdrawal History</p>

        <Select  value={wallet} onValueChange={setWallet}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Wallet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gamebalance">Game Wallet</SelectItem>
          <SelectItem value="commissionbalance">Commisson Wallet</SelectItem>
        </SelectContent>
      </Select>
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
                <TableHead>Gross Amount</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Withdrawal Fee</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.date).toLocaleString()}</TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.grossamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.grossamount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.netammount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.netammount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.withdrawalfee.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.withdrawalfee / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className={` ${statusColor(item.status)}`}>{item.status}</TableCell>
                   
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
