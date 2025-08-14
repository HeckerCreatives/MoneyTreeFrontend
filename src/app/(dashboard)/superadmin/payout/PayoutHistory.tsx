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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RotateCcw, Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import Card from '@/components/common/Card'
import { Input } from '@/components/ui/input'






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

interface Totals {
  totalrequestgame: number
  totalrequestdirect: number,
  totalrequestunilevel: number,
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
    const [search, setSearch] = useState('')
    const [searchHistory, setSearchHistory] = useState('')
    const { refresh, setRefresh} = refreshStore()
    const [tab, setTab] = useState('gamebalance')
    const [status, setStatus] = useState('done')
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [totalrequests, setTotalRequests] = useState<Totals>()
    const [payoutid, setPayoutId] = useState('')
    const [paymethod, setPaymethod] = useState('all')
  

    useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/payout/getpayouthistorysuperadmin?page=${currentpage2}&limit=10&type=${tab}&searchUsername=${searchHistory}`,
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
      }, [currentpage2, refresh, tab, searchHistory]);

      useEffect(() => {
        setLoading(true);
    
        const delayDebounceFn = setTimeout(async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/payout/getpayoutlist?page=${currentpage}&limit=10&type=${tab}&methodtype=${paymethod}&searchUsername=${search}`,
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
      }, [currentpage, refresh, tab, paymethod, search]);

      useEffect(() => {
        setSearch('')
        setSearchHistory('')
      }, [tab])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageChange2 = (page: number) => {
      setCurrentPage2(page)
  }

  const processPayout = async (id: string) => {
    setLoading(true);
    setRefresh('true')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/processpayout`,
        {
          payoutid: payoutid,
          status: status
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Payout sucessfully processed.');
      clearLoading();
      setRefresh('false')
      setOpen(false)

    } catch (error) {
      setLoading(false);
      setRefresh('false')
      setOpen(false)


      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          toast.error(`${axiosError.response.data.data}`);
          router.push('/')
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

  // const deletePayout = async (id: string) => {
  //   setLoading(true);
  //   setRefresh('true')
  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/payout/deletepayout`,
  //       {
  //         payoutid: id,
  //       },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     toast.success('Payout sucessfully deleted.');
  //     clearLoading();
  //     setRefresh('false')
  //     setOpen(false)

  //   } catch (error) {
  //     setLoading(false);
  //     setRefresh('false')
  //     setOpen(false)


  //     if (axios.isAxiosError(error)) {
  //       const axiosError = error as AxiosError<{ message: string; data: string }>;
  //       if (axiosError.response && axiosError.response.status === 401) {
  //         toast.error(`${axiosError.response.data.data}`);
  //         router.push('/')
  //       }

  //       if (axiosError.response && axiosError.response.status === 400) {
  //         toast.error(`${axiosError.response.data.data}`);
  //       }

  //       if (axiosError.response && axiosError.response.status === 402) {
  //         toast.error(`${axiosError.response.data.data}`);
  //       }

  //       if (axiosError.response && axiosError.response.status === 403) {
  //         toast.error(`${axiosError.response.data.data}`);
  //       }

  //       if (axiosError.response && axiosError.response.status === 404) {
  //         toast.error(`${axiosError.response.data.data}`);
  //       }
  //     }
  //   }
  // };

  
  useEffect(() => {
    setLoading(true);

    const getTotals = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/payout/gettotalrequest`,
          { withCredentials: true }
        );
        setTotalRequests(response.data.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string; data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
            
          }
        }
      } finally {
        setLoading(false);
      }
    }
    getTotals()

  }, []);


  const deletePayout = async (id: string) => {
    setLoading(true);
    setRefresh('true')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/deletepayout`,
        {
          payoutid: payoutid,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Payout history sucessfully deleted .');
      clearLoading();
      setRefresh('false')
      setOpen(false)
      setOpen2(false)
      setOpen3(false)

    } catch (error) {
      setLoading(false);
      setRefresh('false')
      setOpen(false)


      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          toast.error(`${axiosError.response.data.data}`);
          router.push('/')
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

    <div className=' flex flex-col gap-12 w-full py-8'>
      <div className=' w-full flex items-center justify-center'>
        <div className=' w-fit grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
          <Card name={'Game Payout'} amount={totalrequests?.totalrequestgame || 0} color={''} subcolor={''} editable={false}/>
          <Card name={'Referral Payout'} amount={totalrequests?.totalrequestdirect || 0} color={''} subcolor={''} editable={false}/>
          <Card name={'Unilevel Payout'} amount={totalrequests?.totalrequestunilevel || 0} color={''} subcolor={''} editable={false}/>
        </div>
      </div>
     
      <Tabs defaultValue="gamebalance" className="w-full">
      <TabsList>
        <TabsTrigger onClick={() => setTab('gamebalance')} value="gamebalance">Game</TabsTrigger>
        <TabsTrigger onClick={() => setTab('directreferralbalance')} value="directreferralbalance">Referral</TabsTrigger>
        <TabsTrigger onClick={() => setTab('unilevelbalance')} value="unilevelbalance">Unilevel</TabsTrigger>
      </TabsList>
      <TabsContent value="gamebalance" className=' flex flex-col gap-4'>
      <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Game Payout List</p>

        <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>
          <Select value={paymethod} onValueChange={setPaymethod}>
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

       


        {/* <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user...' className=' bg-gray-100 w-fit'/> */}
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
                <TableHead>Username</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Account no.</TableHead>
                <TableHead>Account name</TableHead>
                <TableHead>Gross amount</TableHead>
                <TableHead>Net amount</TableHead>

                <TableHead>Withdrawal fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.firstname}</TableCell>
                    <TableCell>{item.lastname}</TableCell>
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

                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger onClick={() => setPayoutId(item.id)} className='text-[.6rem] primary-green text-white px-2 py-1 rounded-sm font-medium flex items-center gap-1 justify-center'><RotateCcw size={12}/>Process</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Process Payout</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. Process payout <span className=' text-amber-800'>{item.id}</span> from <span className=' text-amber-800'>{item.username}</span>, gross amount of <span className=' text-amber-800'>{item.grossamount.toLocaleString()} php </span> and net amount of  <span className=' text-amber-800'>{item.netamount.toLocaleString()}php</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className=' w-full flex flex-col gap-4'>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="done">Approved</SelectItem>
                              <SelectItem value="reject">Reject</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className=' w-full flex flex-col gap-1'>
                            <Button onClick={() => processPayout(item.id)} disabled={loading} className=' mt-4'>
                              {loading === true && (
                                <span className='loader'></span>
                              )}
                              Continue</Button>

                              <p className=' w-full text-center text-xs'>or</p>

                              <Button disabled={loading} onClick={() => deletePayout(item.id)} variant={'destructive'}>
                              {loading === true && (
                                <span className='loader'></span>
                              )}
                                Delete payout</Button>
                          </div>


                          </div>
                        </DialogContent>
                      </Dialog>

                    </TableCell>
                   
                   
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
       <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Game Payout History</p>

         <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
        
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
                  {/* <TableHead>Action</TableHead> */}
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
                    {/* <TableCell>
                    <Dialog open={open2} onOpenChange={setOpen2}>
                      <DialogTrigger className=' text-[.7rem] bg-red-500 text-white p-1 rounded-md flex items-center gap-1'><Trash2 size={15}/></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete history.
                          </DialogDescription>
                        </DialogHeader>

                        <div className=' w-full flex items-end justify-end'>
                          <button disabled={loading} 
                          onClick={() => deletePayout(item.id)} 
                          className=' px-4 py-2 text-xs bg-red-500 text-white rounded-md'>Continue</button>

                        </div>
                      </DialogContent>
                    </Dialog>
                    </TableCell> */}

                   
                   
                   
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
        <p className=' text-sm font-medium'>Referral Payout List</p>

        <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>
          <Select value={paymethod} onValueChange={setPaymethod}>
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

        {/* <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user...' className=' bg-gray-100 w-fit'/> */}
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
                <TableHead>Username</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Account no.</TableHead>
                <TableHead>Account name</TableHead>
                <TableHead>Gross amount</TableHead>
                <TableHead>Net amount</TableHead>

                <TableHead>Withdrawal fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                   <TableRow key={index}>
                   <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                   <TableCell>{item.username}</TableCell>
                   <TableCell>{item.firstname}</TableCell>
                   <TableCell>{item.lastname}</TableCell>
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

                   <TableCell>{item.status}</TableCell>
                   <TableCell>
                     <Dialog open={open} onOpenChange={setOpen}>
                       <DialogTrigger onClick={() => setPayoutId(item.id)} className='text-[.6rem] primary-green text-white px-2 py-1 rounded-sm font-medium flex items-center gap-1 justify-center'><RotateCcw size={12}/>Process</DialogTrigger>
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>Process Payout</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. Process payout <span className=' text-amber-800'>{item.id}</span> from <span className=' text-amber-800'>{item.username}</span>, gross amount of <span className=' text-amber-800'>{item.grossamount.toLocaleString()} php </span> and net amount of  <span className=' text-amber-800'>{item.netamount.toLocaleString()}php</span>
                            </DialogDescription>
                         </DialogHeader>
                         <div className=' w-full flex flex-col gap-4'>
                         <Select value={status} onValueChange={setStatus}>
                           <SelectTrigger className="w-[180px]">
                             <SelectValue placeholder="Status" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="done">Approved</SelectItem>
                             <SelectItem value="reject">Reject</SelectItem>
                           </SelectContent>
                         </Select>

                         <div className=' w-full flex flex-col gap-1'>
                          <Button onClick={() => processPayout(item.id)} disabled={loading} className=' mt-4'>
                            {loading === true && (
                              <span className='loader'></span>
                            )}
                            Continue</Button>

                            <p className=' w-full text-center text-xs'>or</p>

                            <Button disabled={loading} onClick={() => deletePayout(item.id)} variant={'destructive'}>
                            {loading === true && (
                              <span className='loader'></span>
                            )}
                              Delete payout</Button>
                         </div>

                         

                         </div>
                       </DialogContent>
                     </Dialog>

                   </TableCell>
                  
                  
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
       <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Referral Payout History</p>
         <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
        
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
                  {/* <TableHead>Action</TableHead> */}
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
                    {/* <TableCell>
                    <Dialog open={open2} onOpenChange={setOpen2}>
                      <DialogTrigger className=' text-[.7rem] bg-red-500 text-white p-1 rounded-md flex items-center gap-1'><Trash2 size={15}/></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete history.
                          </DialogDescription>
                        </DialogHeader>

                        <div className=' w-full flex items-end justify-end'>
                          <button disabled={loading} 
                          onClick={() => deletePayout(item.id)} 
                          className=' px-4 py-2 text-xs bg-red-500 text-white rounded-md'>Continue</button>

                        </div>
                      </DialogContent>
                    </Dialog>
                    </TableCell> */}
                   
                   
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
        <p className=' text-sm font-medium'>Unilevel Payout List</p>

        <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>
          <Select value={paymethod} onValueChange={setPaymethod}>
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

        {/* <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search user...' className=' bg-gray-100 w-fit'/> */}
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
                <TableHead>Username</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Account no.</TableHead>
                <TableHead>Account name</TableHead>
                <TableHead>Gross amount</TableHead>
                <TableHead>Net amount</TableHead>

                <TableHead>Withdrawal fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                   <TableRow key={index}>
                   <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                   <TableCell>{item.username}</TableCell>
                   <TableCell>{item.firstname}</TableCell>
                   <TableCell>{item.lastname}</TableCell>
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

                   <TableCell>{item.status}</TableCell>
                   <TableCell>
                     <Dialog open={open} onOpenChange={setOpen}>
                       <DialogTrigger onClick={() => setPayoutId(item.id)} className='text-[.6rem] primary-green text-white px-2 py-1 rounded-sm font-medium flex items-center gap-1 justify-center'><RotateCcw size={12}/>Process</DialogTrigger>
                       <DialogContent>
                         <DialogHeader>
                           <DialogTitle>Process Payout</DialogTitle>
                           <DialogDescription>
                              This action cannot be undone. Process payout <span className=' text-amber-800'>{item.id}</span> from <span className=' text-amber-800'>{item.username}</span>, gross amount of <span className=' text-amber-800'>{item.grossamount.toLocaleString()} php </span> and net amount of  <span className=' text-amber-800'>{item.netamount.toLocaleString()}php</span>
                            </DialogDescription>
                         </DialogHeader>
                         <div className=' w-full flex flex-col gap-4'>
                         <Select value={status} onValueChange={setStatus}>
                           <SelectTrigger className="w-[180px]">
                             <SelectValue placeholder="Status" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="done">Approved</SelectItem>
                             <SelectItem value="reject">Reject</SelectItem>
                           </SelectContent>
                         </Select>

                         <div className=' w-full flex flex-col gap-1'>
                          <Button onClick={() => processPayout(item.id)} disabled={loading} className=' mt-4'>
                            {loading === true && (
                              <span className='loader'></span>
                            )}
                            Continue</Button>

                            <p className=' w-full text-center text-xs'>or</p>

                            <Button disabled={loading} onClick={() => deletePayout(item.id)} variant={'destructive'}>
                            {loading === true && (
                              <span className='loader'></span>
                            )}
                              Delete payout</Button>
                         </div>

                         

                         </div>
                       </DialogContent>
                     </Dialog>

                   </TableCell>
                  
                  
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
       <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>
        <div className=' w-full flex items-center justify-between '>
        <p className=' text-sm font-medium'>Unilevel Payout History</p>
         <div className=' flex items-center gap-2'>
          <Input placeholder='Search' value={searchHistory} onChange={(e) => setSearchHistory(e.target.value)}/>
        
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
                  {/* <TableHead>Action</TableHead> */}
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
