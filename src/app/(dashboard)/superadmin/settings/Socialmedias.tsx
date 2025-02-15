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
import { Pen, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DeleteSocials from '@/components/forms/DeleteSocials'
import EditSocials from '@/components/forms/EditSocials'
import AddSocials from '@/components/forms/AddSocial'
import refreshStore from '@/store/refresh'
import loadingtableStore from '@/store/tableloading'


interface List {
  _id: string,
  link: string,
  title: string,
}

export default function Socialmedias() {
  const router = useRouter()
  const {loading, setLoading, clearLoading} = loadingtableStore()
  const [search, setSearch] = useState('')
  const { refresh, setRefresh} = refreshStore()
  const [list, setList] = useState<List[]>([])

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/getsociallinks`,{
        withCredentials:true
        })

        setLoading(false)
        setList(response.data.data)
        
      } catch (error) {
        setLoading(false)
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string, data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
            
            }    
          } 
      }
    }
    getData()
},[ refresh])


  return (
    <div className=' flex flex-col  w-full max-w-[400px] p-6 bg-cream rounded-md'>
        <p className=' font-semibold'>Social Media</p>

        <div className=' flex items-center mt-2'>
          <AddSocials id={''} username={''}/>

        </div>

        <Table>
          {list.length === 0 && (
          <TableCaption>No data.</TableCaption>
          )}
        <TableHeader>
            <TableRow>
            <TableHead className="">Link</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
            
            </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item, index) => (
            <TableRow key={index}>
            <TableCell className="">{item.link.slice(0,25)}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell className=' flex gap-2'>
              <EditSocials id={item._id} title={item.title} link={item.link}/>
              <DeleteSocials title={item.title} link={item.link} id={item._id}/>

            </TableCell>
            
            </TableRow>
          ))}
            
        </TableBody>
        </Table>


    </div>
  )
}
