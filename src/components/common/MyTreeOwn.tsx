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
import rateStore from '@/store/rate';


type Prop = {
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

export default function MyTreeOwn( prop: Prop) {
    const [dialog, setDialog] = useState(false)
    const [isOpen, setIsopen] = useState('')
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const {rate} = rateStore()
    // const percentage = (prop. / prop.limittotal) * 100


    const claimEarnings = async () => {
        setDialog(false)
        setLoading(true)
        setRefresh('true')
        try {

                const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tinventory/treeclaimtotalincome`,{
                    tbankid: prop.tbankid
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

     const getEarningTier = () => {
        if (!prop.totalprofit || prop.totalprofit === 0) return 0; // avoid division by zero

        const percentage = (prop.earnings / prop.totalprofit) * 100;

        if (percentage <= 49) return 1;
        else if (percentage <= 75) return 2;
        else if (percentage < 100) return 3;
        else if (percentage === 100) return 4;

        return 0;
        };



     const bgImage = () => {
            if(prop.bankname === 'Mango'){
                return `/tree/mango_${getEarningTier()}.jpg`
            }else if(prop.bankname === 'Avocado'){
                return `/tree/avocado_${getEarningTier()}.jpg`
            } else if(prop.bankname === 'Moneytree'){
                return `/tree/apple_${getEarningTier()}.jpg`
            } else if(prop.bankname === 'Lanzones'){
                return `/tree/lanzones_${getEarningTier()}.jpg`
            } else {
                return `/tree/rambutan_${getEarningTier()}.jpg`
            }
    }

   
    
  return (
    <div className=' relative w-full max-w-[300px] min-h-[600px] flex items-center justify-center'>

        <img src="/assets/bigcard.png" alt="bank" className=' min-h-[600px] absolute top-0' />
        <div className=' absolute w-full h-full p-4 '>
            <div className=' w-full  overflow-hidden flex items-center justify-center'>
                <img src={bgImage()} alt="" className=' w-full object-center' />
            </div>

            <div className=' flex flex-col gap-2 text-amber-950 p-4'>
                <h2 className=' ~text-sm/lg font-black'>{prop.bankname}</h2>
                <h2 className=' ~text-xs/sm font-semibold'>Profit: {prop.profit * 100}%</h2>
                <h2 className=' ~text-xs/sm font-semibold'>Earnings: Php{prop.earnings?.toLocaleString()} </h2>
                {/* <h2 className=' ~text-xs/sm font-semibold'>Total earned: Php{prop.totalaccumulated.toLocaleString()} / Php {prop.limittotal.toLocaleString()}</h2> */}

               <Countdown
                className="mt-2"
                date={Date.now() + prop.remainingtime * 1000}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                    return (
                        <span className="font-bold text-green-600 text-xs sm:text-sm">
                        Claim now
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
