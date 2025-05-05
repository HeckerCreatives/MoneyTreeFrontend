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
import { Trash2 } from 'lucide-react'
  

interface List {
    date: string,
    grossamount: number,
    withdrawalfee: number,
    netammount: number,
    status: string,
    id: string,

}

export default function PayoutHistory() {
    const router = useRouter()
    const [list, setList] = useState<List[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const {rate, setRate, clearRate} = rateStore()
    const params = useSearchParams()
    const id = params.get('id')
    const [type, setType] = useState('unilevelbalance')
        const [open2, setOpen2] = useState(false)
    
 


    useEffect(() => {
        setLoading(true)
        const getList = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payout/getrequesthistoryplayersuperadmin?playerid=${id}&page=${currentpage}&limit=10&type=${type}`,{
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

    const deletePayout = async (id: string) => {
        setLoading(true);
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payout/deletepayout`,
            {
              payoutid: id,
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
          setOpen2(false)
          window.location.reload()
    
        } catch (error) {
          setLoading(false);
    
    
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
     <div className=' w-full flex flex-col gap-4 h-auto bg-cream rounded-xl shadow-sm p-6'>

         <Select value={type} onValueChange={setType}>
           <SelectTrigger className="w-[200px]">
               <SelectValue placeholder="Select" />
           </SelectTrigger>
           <SelectContent>
               <SelectItem value="unilevelbalance"> Unilevel Withdraw History</SelectItem>
               <SelectItem value="directreferralbalance">Referral Withdraw History</SelectItem>
               <SelectItem value="gamebalance">Game Withdraw History</SelectItem>
       
               {/* <SelectItem value="unilevelbalance">Unilevel Commission Wallet History</SelectItem> */}
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
                <TableHead>Gross Amount</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Withdrawal Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
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
                  

                    <TableCell>{item.status}</TableCell>
                       <TableCell>
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
  )
}
