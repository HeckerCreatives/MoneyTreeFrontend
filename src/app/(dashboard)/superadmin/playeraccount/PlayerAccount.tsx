'use client'
import Card from '@/components/common/Card'
import axios, { AxiosError } from 'axios'
import { Copy, Wallet } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Invites from './Invites'
import Inventory from './Inventory'
import WalletHistory from './WalletHistory'
import loadingStore from '@/store/loading'
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import { Button } from '@/components/ui/button'
import BuyHistory from './BuyHistory'
import PayoutHistory from './payoutHistory'

  

interface Wallet {
    type: string
    amount: number
}

interface User {
    username: string
    status: string
    referral: string
    referralid: string
}

export default function PlayerAccount() {
    const router = useRouter()
    const [wallet, setWallet] = useState<Wallet[]>([])
    const { loading, setLoading, clearLoading } = loadingStore()
    const [referral, setReferral] = useState('')
    const [unclaimed, setUnclaimed] = useState(0)
    const params = useSearchParams()
    const {rate, setRate} = rateStore()
    const id = params.get('id')
    const [data, setData] = useState<User>()
    const [open, setOpen] = useState(false)
    const {refresh, setRefresh} = refreshStore()
    


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {

            if(id !== null){
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/getplayerwalletforadmin?playerid=${id}`,{
                    withCredentials:true
                    })
        
                    setWallet(response.data.data.userwallets)
                    setLoading(false)
            }
           
          
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
    },[])

    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {

            if(id !== null){
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuserdetailssuperadmin?userid=${id}`,{
                    withCredentials:true
                    })
        
                    setLoading(false)
                    setData(response.data.data)
                    
            }
           
          
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
    },[refresh])

    //get rate 
    useEffect(() => {
        const getWallets = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/conversionrate/getcurrentconversionrate`,{
            withCredentials:true
            })

            setRate(response.data.data.rate)

        
        } catch (error) {
            if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
               
                }    
            } 
        }
        }
        getWallets()
    },[])

    const banuser = async () => {
        setLoading(true);
        setRefresh("true");
    
        try {
            const request = axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/banunbanuser`,
                {
                    status: data?.status === "active" ? "banned" : "active", // Toggle status
                    userid: id,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "Application/json",
                    },
                }
            );
    
            const response = await toast.promise(request, {
                loading: `${data?.status === "active" ? "Banning" : "Unbanning"} player account...`,
                success: `Successfully ${data?.status === "active" ? "banned" : "unbanned"}.`,
                error: `Error while ${data?.status === "active" ? "banning" : "unbanning"} player account.`,
            });
    
            if (response.data.message === "success") {
                setLoading(false);
                setRefresh("false");
                setOpen(false);
            }
        } catch (error) {
            setLoading(false);
            setRefresh("false");
    
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string; data: string }>;
                if (axiosError.response) {
                    toast.error(`${axiosError.response.data.data}`);
                    if (axiosError.response.status === 401) router.push("/");
                }
            }
        }
    };


  return (
    <div className=' w-full h-fit flex flex-col gap-2 py-8 font-thin'>

        <h2 className=' text-xl font-bold text-black'>Player Account</h2>
        <div className=' grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-4'>
            <div className=' w-full grid grid-cols-1  gap-8 max-h-[160px] bg-cream rounded-xl shadow-sm'>
                <div className='relative w-full max-h-[160px] flex flex-col justify-between p-6 text-xs'>

                    <div className=' flex flex-col'>
                        <h2 className=' ~text-xl/2xl font-medium'>{data?.username} <span className={` text-sm ${data?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>({data?.status})</span></h2>
                        {data?.referralid !== '' ? (
                        <a target='_blank' href={`/superadmin/playeraccount/?id=${data?.referralid}`} className=' text-xs underline cursor-pointer'>Referral: {data?.referral}</a>
                        ) : (
                        <p className=' text-xs'>Referral: {data?.referral}</p>
                        )}
                        <Dialog open={open} onOpenChange={(setOpen)}>
                        <DialogTrigger className={`${data?.status === 'active' ? ' primary-red flex items-center justify-center ' : 'primary-green flex items-center justify-center ' } w-[150px] mt-4`}>{data?.status === 'active' ? 'Ban' : 'Unban' }</DialogTrigger>
                        <DialogContent className=' bg-cream'>
                            <DialogHeader>
                            <DialogTitle>{data?.status === 'active' ? 'Ban' : 'Unban' } User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to {data?.status === 'active' ? 'ban' : 'unban' } {data?.username}
                            </DialogDescription>
                            </DialogHeader>

                            <div className=' w-full flex items-center justify-end gap-4'>
                                <Button variant={'destructive'} onClick={banuser} className={``}>{data?.status === 'active' ? 'Ban' : 'Unban' }</Button>
                            </div>
                        </DialogContent>
                        </Dialog>

                    </div>

                   
                    <img src="/assets/logo.png" width={400} height={400} className=' ~w-32/40 absolute bottom-4 right-4' />

                </div>

               
            </div>

            <div className=' w-full h-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2'>
                <Card name={'Money Wallet'} amount={wallet.find((item) => item.type === 'fiatbalance')?.amount || 0} type='fiatbalance' color={'bg-amber-400'} subcolor={'bg-amber-300'} editable={true}/>
                <Card name={'Game Wallet Profit'} amount={wallet.find((item) => item.type === 'gamebalance')?.amount || 0} type='gamebalance' color={'bg-sky-400'} subcolor={'bg-sky-300'} editable={true}/>
                <Card name={'Referral Commission Wallet'} amount={wallet.find((item) => item.type === 'directreferralbalance')?.amount || 0} type='directreferralbalance' color={'bg-lime-400'} subcolor={'bg-lime-300'} editable={true}/>
                <Card name={'Unilevel Commission Wallet'} amount={wallet.find((item) => item.type === 'unilevelbalance')?.amount || 0} color={'bg-lime-400'} type='unilevelbalance' subcolor={'bg-lime-300'} editable={true}/>
            </div>

        </div>

        <Tabs defaultValue="Invites" className="w-full mt-8">
        <TabsList className=' bg-cream h-full flex flex-wrap w-fit'>
            <TabsTrigger value="Invites">Invites</TabsTrigger>
            <TabsTrigger value="Inventory">Inventory</TabsTrigger>
            <TabsTrigger value="WalletHistory">Wallet History</TabsTrigger>
                {/* <TabsTrigger value="BuyHistory">Purchase History</TabsTrigger>
                    <TabsTrigger value="PayoutHistory">Payout History</TabsTrigger> */}
                </TabsList>
                <TabsContent value="Invites">
                    <Invites/>
                </TabsContent>
                <TabsContent value="Inventory">
                    <Inventory/>
                </TabsContent>
        
                <TabsContent value="WalletHistory">
                    <WalletHistory/>
                </TabsContent>
                <TabsContent value="BuyHistory">
                    <BuyHistory/>
                </TabsContent>
                <TabsContent value="PayoutHistory">
                    <PayoutHistory/>
                </TabsContent>
        </Tabs>




    </div>
  )
}
