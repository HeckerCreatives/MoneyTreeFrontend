import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import refreshStore from '@/store/refresh'
import { useRouter } from 'next/navigation'
import loadingStore from '@/store/loading'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

type Props = {
    id: string
    userid: string
}

export default function DeletePayinHistory( data: Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [open, setOpen] = useState(false)

    const deletePayin = async () => {
            setLoading(true)
            setRefresh('true')
            try {
                const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payin/deletepayinplayersuperadmin`,{
                    transactionid: data.id, 
                    userid: data.userid
                },{
                    withCredentials: true,
                    headers:{
                        'Content-Type':'Application/json'
                    }
                })
    
                const response = await toast.promise(request, {
                    loading: `Deleting payin...`,
                    success: `Deleted successfully. `,
                    error: `Error while deleting payin.`,
                });
                if(response.data.message === 'success'){
                    setLoading(false)
                    setRefresh('false')
                    setOpen(false)
                }
    
            } catch (error) {
                setLoading(false)
                setRefresh('false')
    
                 if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError<{ message: string, data: string }>;
                        if (axiosError.response && axiosError.response.status === 401) {
                            toast.error(`${axiosError.response.data.data}`)
                            router.push('/')
    
                        }
    
                        if (axiosError.response && axiosError.response.status === 400) {
                            toast.error(`${axiosError.response.data.data}`)     
                                
                        }
    
                        if (axiosError.response && axiosError.response.status === 402) {
                            toast.error(`${axiosError.response.data.data}`)          
                                    
                        }
    
                        if (axiosError.response && axiosError.response.status === 403) {
                            toast.error(`${axiosError.response.data.data}`)              
                            
                        }
    
                        if (axiosError.response && axiosError.response.status === 404) {
                            toast.error(`${axiosError.response.data.data}`)             
                        }
                } 
          
                
            }
    };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger className=' text-[.7rem] text-white flex items-center gap-1 bg-red-600 py-2 px-3 rounded-md'>
        <Trash size={15}/> Delete
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete payin history.
        </DialogDescription>
      </DialogHeader>
      <div className=' mt-6 flex items-end justify-end'>
        <Button onClick={deletePayin} disabled={loading}>
        {loading === true && (
                <span className=' loader'></span>
            )}
            Continue</Button>

      </div>
    </DialogContent>
  </Dialog>
  )
}
