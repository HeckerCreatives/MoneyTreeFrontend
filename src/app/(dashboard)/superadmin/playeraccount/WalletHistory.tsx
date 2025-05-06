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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Pen, Trash2 } from 'lucide-react'
import BuyHistory from './BuyHistory'
import PayoutHistory from './payoutHistory'
import { handleApiError } from '@/lib/errorHandler'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
  

interface List {
    createdAt: string
    amount: number
    username: string
    creaturename: string
    type: string,
    fromusername: string,
    trainerrank: string,
    trainername: string,
    id: string

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
    const [amount, setAmount] = useState(0)

 


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

    const deletHistory = async (data: string) => {
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/deleteplayerwallethistoryforadmin`, {
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
                window.location.reload()
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

    const editHistory = async (data: string) => {
        setLoading(true)
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/editplayerwallethistoryforadmin`,{
                historyid: data,
              amount: amount
            },
                {
                    withCredentials: true
                }
            )
    
            if(response.data.message === 'success'){
              toast.success('Success')
              setLoading(false)
              window.location.reload()
           
    
            } 
    
            
            
        } catch (error) {
          setLoading(false)
    
            handleApiError(error)
            
        }
    
    }


  return (
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm mt-4 p-6'>
        <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="fiatbalance">Load Balance History</SelectItem>
            <SelectItem value="gamebalance">Game Wallet Earning History</SelectItem>
            <SelectItem value="commissionbalance">Commission History(Lvl 2-14)</SelectItem>
            <SelectItem value="directreferralbalance">Referral History(Lvl 1)</SelectItem>
            <SelectItem value="purchasehistory">Inventory History</SelectItem>
            <SelectItem value="payouthistory">Payout History</SelectItem>
            {/* <SelectItem value="unilevelbalance">Unilevel Commission Wallet History</SelectItem> */}
        </SelectContent>
        </Select>

        {(type === 'fiatbalance' || type === 'gamebalance' || type === 'directreferralbalance' || type === 'commissionbalance') && (
                    <>
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
                <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                    <TableCell className=' flex flex-col'>₱{item?.amount?.toLocaleString() || 0} <span className=' text-[.6rem] text-zinc-500'>${(item?.amount || 0 / rate).toLocaleString()}</span></TableCell>

                    <TableCell>{item.fromusername}</TableCell>
                    <TableCell className=' flex items-center gap-2'>
                    <Dialog >
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
                          onClick={() => deletHistory(item.id)} 
                          className=' px-4 py-2 text-xs bg-red-500 text-white rounded-md'>Continue</button>

                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* <Dialog>
                    <DialogTrigger onClick={() => setAmount(item.amount)} className=' text-[.7rem] bg-blue-500 text-white p-1 rounded-md flex items-center gap-1'><Pen size={15}/></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Are you absolutely sure to edit this?</DialogTitle>
                                <DialogDescription>
                                   
                                </DialogDescription>
                                </DialogHeader>

                                <div className=' w-full'>
                                    <label htmlFor="">Amount</label>
                                    <Input
                                      type="text"
                                      className="text-black mt-1"
                                      value={amount.toLocaleString()}
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/,/g, '');
                                        const numValue = Number(rawValue);

                                        if (rawValue === '') {
                                          setAmount(0);
                                        } else if (!isNaN(numValue) && numValue >= 0) {
                                          setAmount(numValue);
                                        }
                                      }}
                                    />

                                    <Button disabled={loading} onClick={() => editHistory(item.id)} className='clip-btn px-12 w-fit mt-4'>
                                    {loading && ( <div className='spinner'></div>)}
                                        Save</Button>

                                </div>
                            </DialogContent>
                            </Dialog> */}
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
        
                    </>
        )}

       


            {type === 'purchasehistory' && (
            <BuyHistory/>
            )}

            {type === 'payouthistory' && (
                <PayoutHistory/>
            )}
        
    </div>
  )
}
