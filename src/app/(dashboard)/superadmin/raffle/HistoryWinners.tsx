"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios, { AxiosError } from "axios"
import loadingStore from "@/store/loading"
import refreshStore from "@/store/refresh"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Pagination from "@/components/common/Pagination"

export interface RaffleEntry {
  id: string;
  owner: string;
  eventname: string;
  index: number;
  createdAt: string; // Use `Date` if you're parsing it
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface RaffleEntryResponse {
  message: string;
  data: RaffleEntry[];
  pagination: Pagination;
}



export default function WinnerHsitory() {
    const { loading, setLoading, clearLoading } = loadingStore();
    const { refresh, setRefresh} = refreshStore()
    const router = useRouter()
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    
  const [history, setHistory] = useState<RaffleEntry[]>([])


  useEffect(() => {
     const getList = async () => {
       try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffle/getrafflewinners?page=${currentpage}&limit=10`,{
         withCredentials:true
         })

         setHistory(response.data.data)
         setTotalPage(response.data.pagination.totalPages)

 
         
       } catch (error) {
 
         if (axios.isAxiosError(error)) {
           const axiosError = error as AxiosError<{ message: string, data: string }>;
           if (axiosError.response && axiosError.response.status === 401) {
              
             }    
           } 
       }
     }
     getList()
 },[refresh, currentpage])


  const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    

  return (
    

      <Card className=" border-none h-fit">
        <CardHeader>
          <CardTitle className=" text-sm">History</CardTitle>
        </CardHeader>
        <CardContent className=" border-orange-200">
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className=" py-2">Date</TableHead>
                  <TableHead className=" py-2">Username</TableHead>
                  <TableHead className="text-right py-2">Raffle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{entry.owner}</TableCell>
                    <TableCell className="text-right">Raffle {entry.index + 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No raffle history yet</div>
          )}

        {history.length !== 0 && (
             <div className=' w-full flex items-center justify-center mt-6'>
                 <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
             </div>
         )}
        </CardContent>
      </Card>
  )
}
