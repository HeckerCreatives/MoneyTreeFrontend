'use client';
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
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
import { useRouter } from 'next/navigation';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import loadingStore from '@/store/loading';
import rateStore from '@/store/rate';
import { Button } from '@/components/ui/button';

const items = [
  { id: 1, content: '1', img:'/assets/Dog1.png' },
  { id: 2, content: '2', img:'/assets/Bird1.png' },
  { id: 3, content: '3', img:'/assets/Cat1.png' },
  { id: 4, content: '4', img:'/assets/Fish1.png' },
  { id: 5, content: '5', img:'/assets/Dog2.png' },
  { id: 6, content: '6', img:'/assets/Bird2.png' },
  { id: 7, content: '7', img:'/assets/Cat2.png' },
  { id: 8, content: '8', img:'/assets/Fish2.png' },
  { id: 9, content: '9', img:'/assets/Dog3.png' },
  { id: 10, content: '10', img:'/assets/Bird3.png' },
];

interface List {
  _id: string
  username: string
  createdAt: string
  level: number,
  totalAmount: number

}


export default function Invites() {
  const [current, setCurrent] = useState(0);
  const { loading, setLoading, clearLoading } = loadingStore()
  const router = useRouter()
  const [totalpage, setTotalPage] = useState(0)
  const [currentpage, setCurrentPage] = useState(0)
  const [list, setList] = useState<List[]>([])
  const {rate, setRate, clearRate} = rateStore()
  const [search, setSearch] = useState('')

  



  //invites 
  useEffect(() => {
   
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300); 

    return () => clearTimeout(debounceTimer);
  }, [currentpage, search, current]); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/unilevel/playerunilevel?level=${current}&page=${currentpage}&limit=10&search=${search}`,
        { withCredentials: true }
      );

      setLoading(false);
      setList(response.data.data.length !== 0 ? response.data.data[0].data : []);
      setTotalPage(response.data.data[0].totalPages);
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





  return (
    <div className="w-full flex md:flex-row flex-col gap-8 py-8">

      <div className=' flex flex-row md:flex-col gap-2 whitespace-nowrap overflow-x-auto md:overflow-hidden px-2'>
        {Array.from({length: 10}).map((_, index) => (
          <button onClick={() => setCurrent(index)} key={index} className=' w-[72px] min-w-[72px] relative flex items-center justify-center'>
          {current === index ? (
            <>
            <img src="/assets/active.png" alt="button" />
            <p className=' text-sm font-black text-amber-50 absolute'>Level {index + 1}</p>

            </>
          ):(
            <>
            <img src="/assets/notactive.png" alt="button" />
            <p className=' text-sm font-black text-amber-950 absolute'>Level {index + 1}</p>

            </>
          )}
        </button>
        ))}
        

      </div>
      <div className=' w-full p-6 bg-cream shadow-sm'>

        <Input type='text' placeholder='Search e.g user123' value={search} onChange={(e) => setSearch(e.target.value)} className=' w-[250px] bg-gray-100 mb-6'/>

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
                <TableHead>Lvl</TableHead>
                <TableHead className="">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((item, index) => (
                <TableRow key={item._id}>
                <TableCell className="">{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>Lvl {item.level}</TableCell>

                <TableCell className=' '>
                  <div className='flex flex-col'>
                    ₱{item.totalAmount.toLocaleString()} <span className=' text-[.6rem] text-zinc-500'>${(item.totalAmount / rate).toLocaleString()}</span>
                  </div>
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