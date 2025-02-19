"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';
import loadingStore from '@/store/loading';
import refreshStore from '@/store/refresh';
import trainertabStore from '@/store/trainertab';
import { banks } from '@/app/data';
import MybanksOwn from '@/components/common/Mybanks';


interface Bank {
  bankid: string
  type: string
  bankname: string
  duration: number
  totalaccumulated: number
  dailyaccumulated: number
  limittotal: number
  limitdaily: number
  earnings: number
  remainingtime: number
}


export default function Mybanks() {
    const {tab, setTab, clearTab} = trainertabStore()
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const [list, setList] = useState<Bank[]>([])
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    const {refresh, setRefresh} = refreshStore()


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory/getinventory?page=${currentpage}&limit=9`,{
            withCredentials:true
            })

            setLoading(false)
            setList(response.data.data)
            setTotalPage(response.data.totalpages)
            
          } catch (error) {
            setLoading(false)
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string, data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
                 
                }    
              } 
          }
        }
        getWallets()
    },[tab, currentpage, refresh])

    const handlePageChange = (page: number) => {
      setCurrentPage(page)
    }

    

  return (
    <div className="w-full flex flex-col gap-4 text-amber-950 py-8">
    

            <div className=' w-full grid grid-cols-[repeat(auto-fill,minmax(300px,.3fr))] gap-4 h-fit place-items-center place-content-center'>

              {Object.values(list).map((item, index) => (
                <MybanksOwn key={index} bankid={item.bankid} type={item.type} duration={item.duration} totalaccumulated={item.totalaccumulated} dailyaccumulated={item.dailyaccumulated} limittotal={item.limittotal} limitdaily={item.limitdaily} earnings={item.earnings} remainingtime={item.remainingtime} bankname={item.bankname}/>   
              ))}

            </div>

            {Object.values(list).length === 0 && (
                  <div className=' w-full h-[200px] flex items-center justify-center'>
                    <p className=' text-sm '>No banks yet!</p>
                  </div>
                )}

            {Object.values(list).length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6'>
                  <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )}
    
           
        </div>
  )
}
