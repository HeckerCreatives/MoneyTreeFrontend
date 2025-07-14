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
import { Box, Trash } from 'lucide-react'
import refreshStore from '@/store/refresh'
import { useRouter, useSearchParams } from 'next/navigation'
import loadingStore from '@/store/loading'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

type Props = {
    id: string
    userid: string
}

export default function TreeGrantMaturity( data: Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [open, setOpen] = useState(false)
    const params = useSearchParams()
    const id = params.get('id')

    const grant = async () => {
            setLoading(true)
            setRefresh('true')
            try {
                const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tinventory/maxplayertreeinventorysuperadmin`,{
                    playerid: id,
                    tbankid: data.id
                },{
                    withCredentials: true,
                    headers:{
                        'Content-Type':'Application/json'
                    }
                })
    
                const response = await toast.promise(request, {
                    loading: `Granting maturity...`,
                    success: `Grant successfully. `,
                    error: `Error while granting maturity.`,
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
    <DialogTrigger className=' text-[.7rem] text-amber-950 flex items-center gap-1 bg-lime-300 py-2 px-3 rounded-md'>
        <Box size={15}/> Grant
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will grant plan maturity.
        </DialogDescription>
      </DialogHeader>
      <div className=' mt-6 flex items-end justify-end'>
        <Button onClick={grant} disabled={loading}>
        {loading === true && (
                <span className=' loader'></span>
            )}
            Continue</Button>

      </div>
    </DialogContent>
  </Dialog>
  )
}
