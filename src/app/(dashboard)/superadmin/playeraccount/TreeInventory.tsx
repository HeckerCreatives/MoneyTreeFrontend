'use client';
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import loadingStore from '@/store/loading';
import rateStore from '@/store/rate';
import GrantMaturity from '@/components/common/GrantMaturity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react';
import Countdown from 'react-countdown';
import refreshStore from '@/store/refresh';
import TreeGrantMaturity from '@/components/common/TreeGrantMaturity';
  

interface Tree {
  treebankid: string,
  bankname: string,
  type: string
  buyprice: number,
  profit: number,
  duration: number,
  earnings: number,
  remainingtime: number,
  purchasedate: number,
  maturedate: number,
  totalprofit: number

}



export default function TreeInventory() {
  const [current, setCurrent] = useState('0');
  const { loading, setLoading, clearLoading } = loadingStore()
  const router = useRouter()
  const [totalpage, setTotalPage] = useState(0)
  const [currentpage, setCurrentPage] = useState(0)
  const [list, setList] = useState<Tree[]>([])
  const {rate, setRate, clearRate} = rateStore()
  const [search, setSearch] = useState('')
const {refresh, setRefresh} = refreshStore()
  

  const params = useSearchParams()
    const id = params.get('id')

  


  //invites 
  useEffect(() => {
   
    const debounceTimer = setTimeout(() => {
        if(id !== null) {
        fetchData();

        }
    }, 500); 

    return () => clearTimeout(debounceTimer);
  }, [currentpage, search, refresh]); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tinventory/getplayertinventory?playerid=${id}&page=${currentpage}&limit=10`,
        { withCredentials: true }
      );

      setLoading(false);
      setList(response.data.data.tree)
      setTotalPage(response.data.totalpages)
    
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const deletPlan = async ( id: string) => {
    console.log(id)
    setLoading(true);
        setRefresh('true')

    try {
        const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tinventory/deleteplayertinventory`, {
          // playerid: id,
          tbankid: id
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await toast.promise(request, {
            loading: `Deleting plan...`,
            success: `Successfully deleted `,
            error: `Error while deleting plan.`,
        });
        if (response.data.message === 'success') {
            setLoading(false);
        setRefresh('flase')

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
    <div className="w-full flex flex-col gap-8">

      <div className=' w-full p-6 bg-cream shadow-sm rounded-md'>


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
                <TableHead className="">Name</TableHead>
                <TableHead className="">Earnings</TableHead>
                <TableHead className="">Duration</TableHead>
                <TableHead className="">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(list).map((item, index) => (
                <TableRow key={item.treebankid}>
                <TableCell className=' uppercase'>{item.bankname}</TableCell>

                <TableCell className=' '>
                  <div className='flex flex-col'>
                    ₱{item.earnings?.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item?.earnings / rate).toLocaleString()}</span>
                  </div>
                </TableCell>

                <TableCell className=' '>
                  <div className='flex flex-col'>
                    <Countdown
                       className="mt-2"
                       date={Date.now() + item.remainingtime * 1000}
                       renderer={({ days, hours, minutes, seconds, completed }) => {
                           if (completed) {
                           return (
                               <span className="font-bold text-green-600 text-xs sm:text-sm">
                               To CLaim
                               </span>
                           );
                           } else {
                           return (
                               <span className="font-bold text-xs sm:text-sm">
                               Ends in: {days} days : {hours} : {minutes} : {seconds}
                               </span>
                           );
                           }
                       }}
                       />
                  </div>
                </TableCell>

                <TableCell className=' flex items-center gap-2'>
                  <TreeGrantMaturity id={item.treebankid} userid={''}/>
                  <Dialog >
                                     <DialogTrigger className=' text-[.7rem] bg-red-500 text-white p-2 rounded-md flex items-center gap-1'><Trash2 size={15}/></DialogTrigger>
                                     <DialogContent>
                                       <DialogHeader>
                                         <DialogTitle>Are you absolutely sure?</DialogTitle>
                                         <DialogDescription>
                                           This action cannot be undone. This will permanently delete history.
                                         </DialogDescription>
                                       </DialogHeader>
               
                                       <div className=' w-full flex items-end justify-end'>
                                         <button disabled={loading} 
                                          onClick={() => deletPlan(item.treebankid)} 
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

        
    </div>
  );
}