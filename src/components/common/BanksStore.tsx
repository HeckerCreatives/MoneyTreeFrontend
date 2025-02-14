import { banks } from '@/app/data'
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
  
interface Bank {
    _id: string
    type:string
    name: string
    min: number
    max: number
    profit:any 
    duration: number
    b1t1: string
    locked: boolean
} 

export default function BanksStore(prop: Bank) {
    const [val, setVal] = useState(0);
    const [dialog, setDialog] = useState(false)
    const [isOpen, setIsopen] = useState('')
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()

    const buyBank = async () => {
        setDialog(false)
        setLoading(true)
        setRefresh('true')
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/buybank`,{
                type: prop.type, // bank type // piggy_bank, money_vault, and treasure_chest
                amount: val
            },{
                withCredentials: true,
                headers:{
                    'Content-Type':'Application/json'
                }
            })

            const response = await toast.promise(request, {
                loading: `Purchasing ${prop.name}...`,
                success: `You succesfully purchased ${prop.name}`,
                error: `Error while purchasing ${prop.name}`,
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
    // const canBuy = async () => {
    //     try {
    //     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainer/getusertrainer?type=${prop.rank}`,{
    //     withCredentials:true
    //     })
    
    //     setLoading(false)
    //     if(response.data.message === 'success'){
    //         buyPet()
    //     }
                
    //     } catch (error) {
    //     setLoading(false)
    //     if (axios.isAxiosError(error)) {
    //         const axiosError = error as AxiosError<{ message: string, data: string }>;
    //         if (axiosError.response && axiosError.response.status === 401) {
    //             toast.error(`${axiosError.response.data.data}`)
    //             router.push('/')

    //         }

    //         if (axiosError.response && axiosError.response.status === 400) {
    //             toast.error(`${axiosError.response.data.data}`)     
                    
    //         }

    //         if (axiosError.response && axiosError.response.status === 402) {
    //             toast.error(`${axiosError.response.data.data}`)          
                        
    //         }

    //         if (axiosError.response && axiosError.response.status === 403) {
    //             toast.error(`${axiosError.response.data.data}`)              
                
    //         }

    //         if (axiosError.response && axiosError.response.status === 404) {
    //             toast.error(`${axiosError.response.data.data}`)             
    //         }
    // } 

    //     }
    // }

    const findBank = banks.find((item) => item.id === prop.name)

  return (
    <div  className={`relative w-fit h-auto flex items-center justify-center ${prop.locked && 'grayscale'}`}>
        <img src="/assets/storecard.png" alt="" />
        <div className=' w-full flex gap-4 items-center justify-center h-full absolute p-6'>
            <div className=' w-fit'>
                <img src={findBank?.img} alt="bank" width={100} height={100} className=' w-[180px] aspect-square' />

            </div>

            <div className=' w-full flex flex-col text-amber-50 text-xs'>
                <h2 className=' text-lg font-black'>{prop.name}</h2>
                {prop.locked ? (
                    <>
                     <p>Profit: xxx %</p>
                    <p>Duration: xx days</p>
                    <p>Starts with: xxxxxx php</p>
                    </>
                   
                ): (
                    <>
                    <p>Profit: {prop.profit * 100} %</p>
                   <p>Duration: {prop.duration} days</p>
                   <p>Starts with: {prop.min.toLocaleString()} php</p>
                   </>
                )
                }
                


                <Drawer>
                <DrawerTrigger disabled={prop.locked} className='bg-[#A8DC08] px-4 py-2 text-sm font-bold text-amber-50 rounded-sm mt-6'>
                    {prop.locked ? 'Coming Soon!' : 'Buy now'}
                </DrawerTrigger>
                <DrawerContent className=' flex flex-col items-center justify-center h-[80%] md:h-[50%] bg-cream border-amber-100'>
                    <DrawerHeader>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                    </DrawerHeader>

                    <div className=' w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 h-auto bg-amber-50 rounded-sm'>
                        <div className=' w-full h-fit md:h-full flex items-center justify-center '>
                            <img src={findBank?.img} alt="bank" width={300} height={300} className=' md:w-[300px] w-[200px]'/>
                        </div>

                        <div className=' w-full flex flex-col justify-center text-amber-950 p-4 md:p-6'>
                            <h2 className=' text-lg font-black'>{prop.name}</h2>
                            <p>Profit: {prop.profit * 100} %</p>
                            <p>Duration: {prop.duration} days</p>
                            <p>Minimum: {prop.min.toLocaleString()} php</p>
                            <p>Maximum: {prop.max.toLocaleString()} php</p>

                            <label htmlFor="" className=' text-xs mt-2 mb-1'>Enter amount</label>
                            <Input type='number' min={500} value={val} onChange={(e) => setVal(e.target.valueAsNumber)} placeholder='Amount'/>

                            <div className=' w-full flex items-center gap-4 mt-6'>
                            <Button onClick={buyBank} className=' w-full '>
                                {loading && (
                                    <span className='loader'></span>
                                )}
                                Buy</Button>
                            <DrawerClose className=' w-full'>
                            <Button variant="outline" className=' w-full '>Cancel</Button>
                            </DrawerClose>
                            </div>

                            

                        </div>
                    </div>
                    
                </DrawerContent>
                </Drawer>

            </div>
        </div>
    </div>
  )
}
