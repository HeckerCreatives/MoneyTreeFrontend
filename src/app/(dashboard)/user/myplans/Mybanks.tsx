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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyTreeOwn from '@/components/common/MyTreeOwn';
import TreeClaimHistory from './TreeClaimHistory';
import ClaimHistory from './Claimhistory';
import DailyClaimHistory from './GameDailyclaimHistory';



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

interface Tree {
  tbankid: string,
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


export default function Mybanks() {
    const {tab, setTab, clearTab} = trainertabStore()
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const [list, setList] = useState<Bank[]>([])
    const [tree, setTree] = useState<Tree[]>([])
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

       useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tinventory/gettinventory`,{
            withCredentials:true
            })

            setLoading(false)
            setTree(response.data.data.tree)
            // setTotalPage(response.data.totalpages)
            console.log(response.data)
            
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

    

  return (
    <div className="w-full flex flex-col gap-4 text-amber-950 py-8">

      <Tabs defaultValue="bank" className="w-full">
        <TabsList>
          <TabsTrigger value="bank">Bank</TabsTrigger>
          <TabsTrigger value="tree">Tree</TabsTrigger>
        </TabsList>
        <TabsContent value="bank">
           <div className=' w-full grid grid-cols-[repeat(auto-fill,minmax(300px,.3fr))] gap-4 h-fit place-items-center place-content-center'>

              {Object.values(list).map((item, index) => (
                <MybanksOwn
                key={index}
                bankid={item.bankid}
                type={item.type}
                duration={item.duration}
                totalaccumulated={item.totalaccumulated ?? 0}
                dailyaccumulated={item.dailyaccumulated ?? 0}
                limittotal={item.limittotal ?? 0}
                limitdaily={item.limitdaily ?? 0}
                earnings={item.earnings ?? 0}
                remainingtime={item.remainingtime}
                bankname={item.bankname}
              />
              
                // <MybanksOwn key={index} bankid={item.bankid} type={item.type} duration={item.duration} totalaccumulated={item.totalaccumulated} dailyaccumulated={item.dailyaccumulated} limittotal={item.limittotal} limitdaily={item.limitdaily} earnings={item.earnings} remainingtime={item.remainingtime} bankname={item.bankname}/>   
              ))}

            </div>

            {Object.values(list).length === 0 && (
                  <div className=' w-full h-[200px] flex items-center justify-center '>
                    <p className=' text-sm '>No banks yet!</p>
                  </div>
                )}

            {Object.values(list).length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6 '>
                  <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )}

            <Tabs defaultValue="Claim" className="w-full mt-8">
              <TabsList className=' bg-cream'>
                  <TabsTrigger value="Claim">Earnings History</TabsTrigger>
                  <TabsTrigger value="Daily">Game History</TabsTrigger>
              </TabsList>
              <TabsContent value="Claim">
                  <ClaimHistory/>
              </TabsContent>
              <TabsContent value="Daily">
                  <DailyClaimHistory/>
              </TabsContent>
              </Tabs>

        </TabsContent>
        <TabsContent value="tree">
            <div className=' w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 h-fit place-items-center place-content-center'>

              {Object.values(tree).map((item, index) => (
                <MyTreeOwn
                  key={index} tbankid={item.tbankid} bankname={item.bankname} type={item.type} buyprice={item.buyprice} profit={item.profit} duration={item.duration} earnings={item.earnings} remainingtime={item.remainingtime} purchasedate={item.purchasedate} maturedate={item.maturedate} totalprofit={item.totalprofit} />
              
                // <MybanksOwn key={index} bankid={item.bankid} type={item.type} duration={item.duration} totalaccumulated={item.totalaccumulated} dailyaccumulated={item.dailyaccumulated} limittotal={item.limittotal} limitdaily={item.limitdaily} earnings={item.earnings} remainingtime={item.remainingtime} bankname={item.bankname}/>   
              ))}

            </div>

            {Object.values(tree).length === 0 && (
                  <div className=' w-full h-[200px] flex items-center justify-center '>
                    <p className=' text-sm '>No tree yet!</p>
                  </div>
                )}

            {/* {Object.values(tree).length !== 0 && (
                <div className=' w-full flex items-center justify-center mt-6 '>
                  <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                </div>
            )} */}

           
                  <TreeClaimHistory/>
              
        </TabsContent>
        
      </Tabs>
    

           
    
           
        </div>
  )
}
