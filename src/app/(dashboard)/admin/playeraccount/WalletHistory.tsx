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
import rateStore from '@/store/rate'
import loadingtableStore from '@/store/tableloading'
  

interface List {
    createdAt: string
    amount: number
    username: string
    creaturename: string
    type: string,
    fromusername: string,
    trainerrank: string,
    trainername: string,

}

export default function WalletHistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const params = useSearchParams()
    const id = params.get('id')
    const [type, setType] = useState('fiatbalance')
 


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/getplayerwallethistoryforadmin?playerid=${id}&page=${currentpage}&limit=10&type=${type}`,{
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
    },[currentpage, type])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const history = (data: string) => {
        if(data === 'fiatbalance'){
            return 'Wallet Balance History'
        } else if(data === 'gamebalance'){
            return 'Game Balance History'
        } else {
            return 'Commission History'

        }
    }


  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm mt-4 p-6'>
        <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
             <SelectItem value="fiatbalance"> Money Wallet History</SelectItem>
             <SelectItem value="gamebalance">Game Harvest Profit History</SelectItem>
             <SelectItem value="directreferralbalance">Referral Commission Wallet History</SelectItem>
             <SelectItem value="commissionbalance">Unilevel Commission Wallet History</SelectItem>
        </SelectContent>
        </Select>

        <p className=' text-sm font-medium'>{history(type)}</p>
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
                <TableHead>From</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className=' flex flex-col'>₱{item.amount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.amount / rate).toLocaleString()}</span></TableCell>

                    <TableCell>{item.fromusername}</TableCell>
                   
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
