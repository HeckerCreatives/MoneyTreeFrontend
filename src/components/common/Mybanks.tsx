'use client'
import { banks } from '@/app/data'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import Countdown from 'react-countdown';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import loadingStore from '@/store/loading';
import refreshStore from '@/store/refresh';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';


type Prop = {
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

export default function MybanksOwn( prop: Prop) {
    const [dialog, setDialog] = useState(false)
    const [isOpen, setIsopen] = useState('')
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const percentage = (prop.totalaccumulated / prop.limittotal) * 100

    const findBank = banks.find((item) => item.id === prop.bankname)

    const claimEarnings = async () => {
        setDialog(false)
        setLoading(true)
        setRefresh('true')
        try {

                const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/claimtotalincome`,{
                    bankid: prop.bankid
                },{
                    withCredentials: true,
                    headers:{
                        'Content-Type':'application/json'
                    }
                })

                const response = await toast.promise(request, {
                    loading: `Claiming ${prop.type} earnings...`,
                    success: `You succesfully claimed ${prop.type} earnings.`,
                    error: `Error while claiming ${prop.type} earnings.`,
                });
                if(response.data.message === 'success'){
                    setLoading(false)
                    router.push('?state=false')
                    setRefresh('false')
    
    
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
    }
    
  return (
    <div className=' max-w-[300px] min-h-[400px] relative flex items-center justify-center'>

        <img src="/assets/bigcard.png" alt="bank" />
        <div className=' absolute w-full h-full p-4 '>
            <div className=' w-full flex items-center justify-center'>
                <img src={findBank?.img} alt="" className=' w-[60%]' />
            </div>

            <div className=' flex flex-col gap-2 text-amber-950 p-4'>
                <h2 className=' ~text-sm/lg font-black'>{prop.bankname}</h2>
                {/* <h2 className=' ~text-xs/sm font-semibold'>Daily earnings: Php{prop.dailyaccumulated.toLocaleString()}</h2> */}
                <h2 className=' ~text-xs/sm font-semibold'>Total earned: Php{prop.totalaccumulated.toLocaleString()}</h2>

                <Countdown
                    className=' mt-2'
                    date={Date.now() + (prop.remainingtime * 1000)} 
                    renderer={({ days, hours, minutes, seconds }) => (
                    <span className=' font-bold ~text-xs/sm'>
                        Ends in: {days} days : {hours} : {minutes} : {seconds}
                    </span>
                    )}
                />



                <Dialog open={dialog} onOpenChange={setDialog}>
                    <DialogTrigger className=' flex items-center '>
                        <Button className=' mt-4'>Claim now</Button>

                    </DialogTrigger>
                    <DialogContent className=' bg-amber-50 text-amber-950'>
                        <DialogHeader>
                        <DialogTitle>Claim {prop.bankname} earnings</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to claim {prop.bankname} earnings
                        </DialogDescription>
                        </DialogHeader>

                        <div className=' w-full flex items-end justify-end gap-4'>
                            <Button onClick={() => setDialog(!dialog)} className='' variant={'outline'}>Cancel</Button>
                            <Button disabled={loading} onClick={claimEarnings} className=' '>
                            {loading === true && (
                                <span className=' loader'></span>
                            )}
                            Claim</Button>
                        </div>
                        
                    </DialogContent>
                    </Dialog>

            </div>
        </div>
    </div>
  )
}
