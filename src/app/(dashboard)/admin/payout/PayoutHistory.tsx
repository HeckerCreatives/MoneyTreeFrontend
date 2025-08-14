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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"




interface History {
    id: string
    username: string
    userid: string
    firstname: string
    lastname: string
    value: string
    status:  string
    createdAt: string
}


interface List {
  id: string
  username: string
  userid: string
  firstname: string
  lastname: string
  paymentmethod: string
  accountnumber:string
  accountname: string
  grossamount: number
  withdrawalfee: number
  netamount: number
  status: string
  type:string
  createdAt:string
  phonenumber: string
}


export default function Payouthistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [history, setHistory] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)

    const [totalpage2, setTotalPage2] = useState(0)
    const [currentpage2, setCurrentPage2] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const [searchHistory, setSearchHistory] = useState('')
    const { refresh, setRefresh} = refreshStore()
    const [tab, setTab] = useState('gamebalance')
    const [paymethodHistory, setPaymethodHistory] = useState('all')
    



    useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/payout/getpayouthistorysuperadmin?page=${currentpage2}&limit=10&type=${tab}&searchUsername=${searchHistory}&methodtype=${paymethodHistory}`,
              { withCredentials: true }
            );
    
            setHistory(response.data.data.payoutlist);
            setTotalPage2(response.data.data.totalPages);
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
      }, [currentpage2, refresh, tab, searchHistory, paymethodHistory]);

      useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/payout/getpayoutlist?page=${currentpage}&limit=10&type=${tab}`,
              { withCredentials: true }
            );
    
            setList(response.data.data.payoutlist);
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
      }, [currentpage, refresh, tab]);

    const handlePageChange2 = (page: number) => {
      setCurrentPage2(page)
  }


    useEffect(() => {
          setSearchHistory('')
        setPaymethodHistory('all')

        }, [tab])


   


  return (

    <div className=' flex flex-col gap-12 w-full py-8'>


      <Tabs defaultValue="gamebalance" className="w-full">
      <TabsList className=' bg-cream'>
        <TabsTrigger onClick={() => setTab('gamebalance')} value="gamebalance">Game</TabsTrigger>
               <TabsTrigger onClick={() => setTab('directreferralbalance')} value="directreferralbalance">Referral</TabsTrigger>
               <TabsTrigger onClick={() => setTab('unilevelbalance')} value="unilevelbalance">Unilevel</TabsTrigger>
      </TabsList>
      <TabsContent value="gamebalance" className=' flex flex-col gap-4'>
     
       <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Game Payout History</p>
         <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
           <Select value={paymethodHistory} onValueChange={setPaymethodHistory}>
            <SelectTrigger className=" w-[100px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gcash">GCash</SelectItem>
              <SelectItem value="gotyme">GoTyme</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
            <Table>
                {loading === true && (
                    <TableCaption>
                        <span className=' loaderdark'></span>
                    </TableCaption>
                )}
                {history.length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
                <TableRow>
                  <TableHead className="">Date</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Payment method</TableHead>
                  <TableHead>Account no.</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Gross amount</TableHead>
                  <TableHead>Net amount</TableHead>

                  <TableHead>Withdrawal fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.paymentmethod}</TableCell>
                    <TableCell>{item.accountnumber}</TableCell>
                    <TableCell>{item.accountname}</TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.grossamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.grossamount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.netamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.netamount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.withdrawalfee.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.withdrawalfee / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className={`${item.status === 'done' ? 'text-green-400' : 'text-red-500'}`}>{item.status}</TableCell>

                   
                   
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {history.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentpage2} total={totalpage2} onPageChange={handlePageChange2}/>
                </div>
            )}
        
       </div>
      </TabsContent>
      <TabsContent value="directreferralbalance" className=' flex flex-col gap-4'>
     
       <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>ComissionPayout History</p>
         <div className=' flex items-center gap-2'>
            <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
           <Select value={paymethodHistory} onValueChange={setPaymethodHistory}>
            <SelectTrigger className=" w-[100px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gcash">GCash</SelectItem>
              <SelectItem value="gotyme">GoTyme</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
            <Table>
                {loading === true && (
                    <TableCaption>
                        <span className=' loaderdark'></span>
                    </TableCaption>
                )}
                {history.length === 0 && (
                <TableCaption>No data.</TableCaption>
                )}
            <TableHeader>
            <TableRow>
                  <TableHead className="">Date</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Payment method</TableHead>
                  <TableHead>Account no.</TableHead>
                  <TableHead>Account name</TableHead>
                  <TableHead>Gross amount</TableHead>
                  <TableHead>Net amount</TableHead>
                  <TableHead>Withdrawal fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {history.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.paymentmethod}</TableCell>
                    <TableCell>{item.accountnumber}</TableCell>
                    <TableCell>{item.accountname}</TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.grossamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.grossamount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.netamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.netamount / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className=' '>
                      <div className='flex flex-col'>
                        ₱{item.withdrawalfee.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.withdrawalfee / rate).toLocaleString()}</span>
                      </div>
                    </TableCell>

                    <TableCell className={`${item.status === 'done' ? 'text-green-400' : 'text-red-500'}`}>{item.status}</TableCell>
                   
                   
                   
                    </TableRow>
                ))}
                
            </TableBody>
            </Table>

            {history.length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                    <Pagination currentPage={currentpage2} total={totalpage2} onPageChange={handlePageChange2}/>
                </div>
            )}
        
       </div>
      </TabsContent>
      <TabsContent value="unilevelbalance" className=' flex flex-col gap-4'>
     
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
      <div className=' w-full flex items-center justify-between '>
      <p className=' text-sm font-medium'>ComissionPayout History</p>
       <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
             <Select value={paymethodHistory} onValueChange={setPaymethodHistory}>
            <SelectTrigger className=" w-[100px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="gcash">GCash</SelectItem>
              <SelectItem value="gotyme">GoTyme</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
          <Table>
              {loading === true && (
                  <TableCaption>
                      <span className=' loaderdark'></span>
                  </TableCaption>
              )}
              {history.length === 0 && (
              <TableCaption>No data.</TableCaption>
              )}
          <TableHeader>
          <TableRow>
                <TableHead className="">Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Account no.</TableHead>
                <TableHead>Account name</TableHead>
                <TableHead>Gross amount</TableHead>
                <TableHead>Net amount</TableHead>
                <TableHead>Withdrawal fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
          {history.map((item, index) => (
                  <TableRow key={index}>
                  <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.paymentmethod}</TableCell>
                  <TableCell>{item.accountnumber}</TableCell>
                  <TableCell>{item.accountname}</TableCell>
                  <TableCell className=' '>
                    <div className='flex flex-col'>
                      ₱{item.grossamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.grossamount / rate).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className=' '>
                    <div className='flex flex-col'>
                      ₱{item.netamount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.netamount / rate).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className=' '>
                    <div className='flex flex-col'>
                      ₱{item.withdrawalfee.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.withdrawalfee / rate).toLocaleString()}</span>
                    </div>
                  </TableCell>

                  <TableCell className={`${item.status === 'done' ? 'text-green-400' : 'text-red-500'}`}>{item.status}</TableCell>
                 
                 
                 
                  </TableRow>
              ))}
              
          </TableBody>
          </Table>

          {history.length !== 0 && (
              <div className=' w-full flex items-center justify-center mt-6'>
                  <Pagination currentPage={currentpage2} total={totalpage2} onPageChange={handlePageChange2}/>
              </div>
          )}
      
     </div>
    </TabsContent>
      
    </Tabs>

       
    </div>
    
  )
}
