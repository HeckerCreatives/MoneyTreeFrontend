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
  

interface List {
    type: string
    trainer: string
    rank: string
    totalaccumulated: number,
    dailyaccumulated: number,
    limittotal: number,
    limitdaily: number,
    earnings: number,
    remainingtime: number
    bank: string
    duration: string
  

}


export default function Inventory() {
  const [current, setCurrent] = useState('0');
  const { loading, setLoading, clearLoading } = loadingStore()
  const router = useRouter()
  const [totalpage, setTotalPage] = useState(0)
  const [currentpage, setCurrentPage] = useState(0)
  const [list, setList] = useState<List[]>([])
  const {rate, setRate, clearRate} = rateStore()
  const [search, setSearch] = useState('')

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
  }, [currentpage, search]); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/getplayerinventoryforadmin?playerid=${id}&page=${currentpage}&limit=10`,
        { withCredentials: true }
      );

      setLoading(false);
      setList(response.data.data)
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

  const deletPlan = async ( petid: string) => {
    setLoading(true);
    try {
        const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/deleteplayerinventoryforadmin`, {
          // playerid: id,
          bankid: petid
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'Application/json'
            }
        });

        const response = await toast.promise(request, {
            loading: `Deleting plan...`,
            success: `Successfully deleted `,
            error: `Error while deleting plan.`,
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




  return (
    <div className="w-full flex flex-col gap-8">

      <div className=' w-full p-6 bg-cream shadow-sm rounded-md'>

        {/* <div className=' flex flex-wrap items-center gap-4 mb-6'>
            <Input type='text' placeholder='Search e.g user123' value={search} onChange={(e) => setSearch(e.target.value)} className=' w-[250px] bg-gray-100 '/>

            <Select value={current} onValueChange={setCurrent} >
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
                {Array.from({ length: 10 }).map((_, index) => (
                    <SelectItem key={index} value={`${index}`}>Level {index + 1}</SelectItem>
                ))}
                
            </SelectContent>
            </Select>


        </div> */}


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
                <TableHead className="">bank Name</TableHead>
                <TableHead className="">Total Accumulated</TableHead>
                <TableHead className="">Daily Accumulated</TableHead>
                <TableHead className="">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item, index) => (
                <TableRow key={item.trainer}>
                <TableCell>{item.type}</TableCell>

                <TableCell className=' '>
                  <div className='flex flex-col'>
                    ₱{item.totalaccumulated.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.totalaccumulated / rate).toLocaleString()}</span>
                  </div>
                </TableCell>

                <TableCell className=' '>
                  <div className='flex flex-col'>
                    ₱{item.dailyaccumulated.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.dailyaccumulated / rate).toLocaleString()}</span>
                  </div>
                </TableCell>

                <TableCell className=' flex items-center gap-2'>
                  <GrantMaturity id={item.bank} userid={''}/>
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
                                          onClick={() => deletPlan( item.bank)} 
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