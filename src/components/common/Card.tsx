'use client'
import loadingStore from '@/store/loading'
import rateStore from '@/store/rate'
import { Pen, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { handleApiError } from '@/lib/errorHandler'

type Props = {
    name: string
    amount: number
    color: string
    subcolor: string
    type?: string
    editable: boolean
}
export default function Card( prop: Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const {rate, setRate, clearRate} = rateStore()

    const [amount, setAmount] = useState(0)
    const params = useSearchParams()
    const id = params.get('id')
    const [dialogOpen, setDialogOpen] = useState(false);


    const editWallet = async () => {
        setLoading(true)
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallet/edituserwalletforadmin`,{
                playerid: id,
                wallettype: prop.type,
              amount: amount
            },
                {
                    withCredentials: true
                }
            )
    
            if(response.data.message === 'success'){
              toast.success('Success')
              setLoading(false)
              window.location.reload()
           
    
            } 
    
            
            
        } catch (error) {
          setLoading(false)
    
            handleApiError(error)
            
        }
    
    }

  

    const [inputValue, setInputValue] = useState('');

    // Update this in useEffect to sync with `amount`
    useEffect(() => {
    setInputValue(amount.toString());
    }, [amount]);

   const formatNumberWithCommas = (value: string) => {
    const [intPart, decPart] = value.split('.');
    const formattedInt = intPart ? Number(intPart).toLocaleString() : '0';
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
    };


    useEffect(() => {
     setAmount(prop.amount)
     setInputValue(formatNumberWithCommas(prop.amount.toString()))
    },[prop.amount])

    useEffect(() => {
    if (dialogOpen) {
        const [intPart, decPart] = amount.toString().split('.');
        const formattedInt = Number(intPart).toLocaleString();
        const formatted = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
        setInputValue(formatted);
    }
    }, [dialogOpen]);





  return (
    <div className={` relative flex items-center justify-center w-full max-w-[375px] h-fit  font-normal shadow-sm rounded-xl  text-amber-950 hover:scale-105 transition-all duration-200`}    
    >
        <img src="/assets/card.png" alt="card" className=' w-full h-40' />

        <div className=' w-full h-full flex  absolute'>
            <div className=' w-full flex flex-col gap-2 text-sm p-4'>
                <p className=' '>{prop.name}</p>
                {loading === true ? (
                <h2 className=' ~text-sm/lg font-semibold mt-2'>---</h2>
                ):(

                    // <div className=' flex flex-col  mt-2'>
                    //     <h2 className=' ~text-lg/xl font-black'>₱{prop.amount.toLocaleString()}</h2>
                    //     <p className=' text-xs text-zinc-700'>${(prop.amount / rate).toLocaleString()}</p>
                    // </div>

                    <div className=' flex items-center gap-4'>
                    <div className=' flex flex-col  mt-2'>
                                <h2 className=' ~text-lg/xl font-semibold'>₱{prop.amount.toLocaleString()}</h2>
                                <p className=' text-xs text-zinc-700'>${(prop.amount / rate).toLocaleString()}</p>
                            </div>
                            {prop.editable && (
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger>
                            <button className=' bg-black text-white p-1 rounded-sm cursor-pointer'><Pen size={ 12}/></button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Are you absolutely sure to edit <span className=' text-yellow-500'>{prop.name}</span>?</DialogTitle>
                                <DialogDescription>
                                
                                </DialogDescription>
                                </DialogHeader>

                                <div className=' w-full'>
                                    <label htmlFor="">Amount</label>
                                   <Input
                                    type="text"
                                    className="text-black mt-1"
                                    value={formatNumberWithCommas(inputValue)}
                                     onChange={(e) => {
                                        let raw = e.target.value.replace(/,/g, '');

                                        // Allow numbers with at most one decimal point and 2 decimals
                                        if (!/^\d*\.?\d{0,2}$/.test(raw)) return;

                                        const floatVal = parseFloat(raw);
                                        if (!isNaN(floatVal)) {
                                            if (floatVal > 1_000_000) return;
                                            setAmount(floatVal);
                                        } else {
                                            setAmount(0);
                                        }

                                        // Show formatted value immediately
                                        setInputValue(formatNumberWithCommas(raw));
                                        }}

                                    />



                                    <Button disabled={loading} onClick={editWallet} className='clip-btn px-12 w-fit mt-4'>
                                    {loading && ( <div className='spinner'></div>)}
                                        Save</Button>

                                </div>
                            </DialogContent>
                            </Dialog>


                            )}
                        

                    </div>

                )}
                <p className=' text-zinc-700 text-[.7rem]'>Total balance</p>

            </div>

            <div className=' w-[80px] px-6 h-full flex items-center justify-center '>
                <div className={` ~w-12/16 aspect-square rounded-full flex items-center justify-center text-amber-700`}>
                    <Wallet size={30} className=' font-black'/>
                </div>

            </div>

        </div>
    
    </div>
  )
}
