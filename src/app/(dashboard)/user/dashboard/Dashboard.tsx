'use client'
import Card from '@/components/common/Card'
import { Button } from '@/components/ui/button'
import { encryptUid } from '@/helpers/encrypt'
import loadingStore from '@/store/loading'
import axios, { AxiosError } from 'axios'
import { Copy, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'
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


interface Wallet {
    gamebalance: 0,
    fiatbalance: 0,
    commissionbalance: 0
}

interface Statistics {
    game:number,
    referral:number,
    unilevel:number
}

export default function Dashboard() {
    const router = useRouter()
    const [wallet, setWallet] = useState<Wallet>()
    const [stats, setStats] = useState<Statistics>()
    const { loading, setLoading, clearLoading } = loadingStore()
    const [referral, setReferral] = useState('')
    const [unclaimed, setUnclaimed] = useState(0)
    const [status, setStatus] = useState(false)
    const [event, setEvent] = useState('On')
    const [open, setOpen] = useState(false)
    const [gameid, setGameid] = useState('')
    const [username, setUsername] = useState('')

 
    


    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/playerwallets`,{
            withCredentials:true
            })

            setWallet(response.data.data)
            setLoading(false)
          
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
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallethistory/getwalletstatistics`,{
            withCredentials:true
            })
            
            setStats(response.data.data)
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

    useEffect(() => {
      const getWallets = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory/getunclaimedincomeinventory`,{
          withCredentials:true
          })
          
        setUnclaimed(response.data.data.totalaccumulated)
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analytics/getreferrallinkstatus`,{
        withCredentials:true
        })

        setStatus(response.data.data.status)
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string, data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
           
            }    
          } 
      }
    }
    getData()
  },[])

    //get referral
    useEffect(() => {
      const getReferral = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getreferrallink`,{
          withCredentials:true
          })

          setReferral(response.data.data)

        
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
              toast.error(`${axiosError.response.data.data}`)
              router.push('/')  
              }    
            } 
        }
      }
      getReferral()
    },[])

    const copyReferral = () => {
      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_REFERRAL}/auth/register?uid=${encryptUid(referral)}`)
      toast.success('Referral link copied')
    }

    //game id
    useEffect(() => {
      const getList = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuserdetails`,{
          withCredentials:true
          })
    
          setGameid(response.data.data.gameid)
          setUsername(response.data.data.username)
    
        } catch (error) {
    
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
               
              }    
            } 
        }
      }
      getList()
    },[])

    const copyGameid = () => {
      navigator.clipboard.writeText(`${gameid}`)
      toast.success('Game id copied')
    }
    


  return (
    <div className=' w-full h-fit flex flex-col gap-2 py-8 font-thin'>

        <div className=' grid grid-cols-1 lg:grid-cols-[350px_1fr] place-items-center md:place-items-start gap-4'>
            <div className='relative flex items-center justify-center  w-full max-w-[350px] h-full max-h-[520px] rounded-lg shadow-sm p-4 overflow-hidden'
            style={{backgroundImage: 'url(/assets/Background.png)'}}
            >

              <div className=' z-0 absolute w-full h-full bg-zinc-950/30'>

              </div>

                <div className=' relative z-20 w-full h-full flex flex-col justify-between gap-2 text-xs text-amber-50 '>

                    {/* <h2 className=' text-2xl font-black'>{username}</h2> */}
                    {/* <div className=' flex items-center gap-2'>
                        <p>Events:</p>
                        <h2 className=' ~text-xl/2xl font-medium text-amber-700'>{event}</h2>
                    </div> */}

                    <div className=' flex flex-col gap-2'>
                      {/* <p className=' text-zinc-50'>Invites your your friends.</p> */}
                      <div className=' flex flex-col'>
                          {status === true && (
                          <button onClick={copyReferral} className=' bg-[#A8DC08] px-3 py-1 w-fit text-sm text-amber-950 flex items-center gap-1 rounded-sm font-bold'><Copy size={15}/>Referral</button>
                          )}
                      </div>
                    </div>
                    

                    <div className=' flex items-center justify-center'>
                      <img src="/assets/logo.png" width={300} height={300} className=' ' />
                    </div>


                    <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger className=' w-full'>
                    <Button className=' w-full'>Play now</Button>

                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Play now</DialogTitle>
                        <DialogDescription>
                         Are you sure you want to play?
                        </DialogDescription>
                      </DialogHeader>
                        <div className=' flex items-center justify-end gap-2'>
                          <button onClick={() => setOpen(!open)} className=' px-4 py-2 bg-gray-200 rounded-md ~text-xs/sm'>Cancel</button>
                          <a onClick={copyGameid} href={`${process.env.NEXT_PUBLIC_GAME_LINK}?userID=${gameid}`} target='_blank' className=' px-4 w-fit text-sm text-white font-medium bg-[#A8DC08] py-2 rounded-lg'>Continue</a>

                        </div>
                    </DialogContent>
                  </Dialog>
                </div>

                
            </div>

            <div className="w-full grid gap-4 p-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] place-items-center">
              <Card name="Wallet Balance" amount={wallet?.fiatbalance || 0} color="bg-amber-400" subcolor="bg-amber-300" />
              <Card name="Total Withdrawables" amount={(wallet?.gamebalance || 0) + (wallet?.commissionbalance || 0)} color="bg-lime-400" subcolor="bg-lime-300" />
              <Card name="Game Total Earnings" amount={stats?.game || 0} color="bg-green-400" subcolor="bg-green-300" />
              <Card name="Game Wallet Earnings" amount={unclaimed} color="bg-emerald-400" subcolor="bg-emerald-300" />

              <Card name="Referral Commissions Wallet Earnings" amount={stats?.referral || 0} color="bg-teal-400" subcolor="bg-teal-300" />
              <Card name="Unilevel Commissions Wallet Earnings" amount={stats?.unilevel || 0} color="bg-cyan-400" subcolor="bg-cyan-300" />
              {/* <Card name="Commission Wallet Earnings" amount={wallet?.commissionbalance || 0} color="bg-sky-400" subcolor="bg-sky-300" /> */}
              <Card name="Total Earnings" amount={(stats?.referral || 0) + (stats?.unilevel || 0) + (stats?.game || 0)} color="bg-indigo-400" subcolor="bg-indigo-300" />
          </div>

{/* 
            <div className="w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 p-4">
              <Card name="Wallet Balance" amount={wallet?.fiatbalance || 0} color="bg-amber-400" subcolor="bg-amber-300" />
              <Card name="Total Withdrawables" amount={(wallet?.gamebalance || 0) + (wallet?.commissionbalance || 0)} color="bg-lime-400" subcolor="bg-lime-300" />
              <Card name="Game Total Earnings" amount={stats?.game || 0} color="bg-green-400" subcolor="bg-green-300" />
              <Card name="Game Wallet Earnings" amount={unclaimed} color="bg-emerald-400" subcolor="bg-emerald-300" />

              <Card name="Referral Commissions" amount={stats?.referral || 0} color="bg-teal-400" subcolor="bg-teal-300" />
              <Card name="Unilevel Commissions" amount={stats?.unilevel || 0} color="bg-cyan-400" subcolor="bg-cyan-300" />
              <Card name="Commission Wallet Earnings" amount={wallet?.commissionbalance || 0} color="bg-sky-400" subcolor="bg-sky-300" />
              <Card name="Total Earnings" amount={(stats?.referral || 0) + (stats?.unilevel || 0) + (stats?.game || 0)} color="bg-indigo-400" subcolor="bg-indigo-300" />
          </div> */}




        </div>

        {/* <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card name={'Referral Commissions'} amount={stats?.referral || 0} color={'bg-teal-400'} subcolor={'bg-teal-300'}/>
          <Card name={'Unilevel Commissions'} amount={stats?.unilevel || 0} color={'bg-cyan-400'} subcolor={'bg-cyan-300'}/>
          <Card name={'Commission Wallet Earnings'} amount={wallet?.commissionbalance || 0} color={'bg-sky-400'} subcolor={'bg-sky-300'}/>
          <Card name={'Total Earnings'} amount={(stats?.referral || 0) + (stats?.unilevel || 0) + (stats?.game || 0)} color={'bg-indigo-400'} subcolor={'bg-indigo-300'}/>
        </div> */}

    </div>
  )
}
