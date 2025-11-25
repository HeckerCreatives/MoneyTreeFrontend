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
  

export interface RankItem {
  index: number;
  owner: string;
  username: string;
  totalAmount: number;
  rankLevel: string;
  rankPercentage: number;
  rankEarnings: number;
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface RankResponse {
  message: string;
  data: RankItem[];
  pagination: Pagination;
}


const levelsTab = [
    {id: 0, name: 'Level 1 - Associate'},
    {id: 1, name: 'Level 2 - Senior'},
    {id: 2, name: 'Level 3 - Manager'},
    {id: 3, name: 'Level 4 - Director'},
    {id: 4, name: 'Level 5 - Prestige'},
    {id: 5, name: 'Level 6 - Hall of Fame'},
]

export default function Topcommission() {
    const router = useRouter()
    const [list, setList] = useState<RankItem[]>([])
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [level, setLevel] = useState('0')
    const [totalPage, setTotalPage] = useState(0)

     const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }
 


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/getrankbonuswallethistoryforadmin?page=${currentPage}&limit=10&level=${level}`,{
            withCredentials:true
            })

            setList(response.data.data)
            setTotalPage(response.data.pagination.totalPages || 0)
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
    },[currentPage, level])


  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm my-8 p-6'>
       

        <p className=' text-sm font-medium'>Rank Up Bonus</p>

        {/* <div className=' flex flex-wrap items-center justify-between'>
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

            <Input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search' className=' w-fit' />
        </div> */}

         <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className=" text-xs">
                    {levelsTab.map((item, index) => (
                    <SelectItem key={index} value={item.id.toString()}>{item.name}</SelectItem>
                    ))}
                   
                  </SelectContent>
                </Select>

       
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
                <TableHead className="">Username</TableHead>
                <TableHead className="">Rank Level</TableHead>
                <TableHead className="">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.values(list).map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{item.username}</TableCell>
                    <TableCell className="">{item.rankLevel}</TableCell>

                    <TableCell className=' '>
                        <div className='flex flex-col'>
                        ₱{item.totalAmount?.toLocaleString() || 0} <span className=' text-[.6rem] text-zinc-500'>${(item.totalAmount / rate).toLocaleString()}</span>
                        </div>
                    </TableCell>
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {list.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentPage} total={totalPage} onPageChange={handlePageChange}/>
                </div>
            )}

    </div>
  )
}
