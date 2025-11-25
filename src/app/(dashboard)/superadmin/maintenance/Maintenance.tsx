'use client'
import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'

interface List {
    type: string
    value: string
}

export default function Maintenance() {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [game, setGame] = useState(false)
    const [referral, setReferral] = useState(false)
    const [unilevel, setUnilevel] = useState(false)
    const [rankBonus, setRankBonus] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [list, setList] = useState<List[]>([])

    const event = list.find((item) => item.type === 'eventgame')
    const buyonetakeone = list.find((item) => item.type === 'b1t1')
    const payout = list.find((item) => item.type === 'payout')
    const full = list.find((item) => item.type === 'fullgame')
    const gameState = list.find((item) => item.type === 'game')
    const referralState = list.find((item) => item.type === 'referral')
    const unilevelState = list.find((item) => item.type === 'unilevel')
    const rankBonusState = list.find((item) => item.type === 'rankbonus')

    useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/getmaintenance`,{
            withCredentials:true
            })

            setLoading(false)
            setList(response.data.data.maintenancelist)
            
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
    },[ refresh])

    useEffect(() => {
        setLoading(true)
        const getData = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reset/resetleaderboard`,{
            withCredentials:true
            })

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
        getData()
    },[ refresh])

    useEffect(() => {
        setChecked1(payout?.value == '0' ? false : true)
        setChecked2(full?.value == '0' ? false : true)
        setGame(gameState?.value == '0' ? false : true)
        setReferral(referralState?.value == '0' ? false : true)
        setUnilevel(unilevelState?.value == '0' ? false : true)
        setRankBonus(rankBonusState?.value == '0' ? false : true)
    },[list])

    const updateMaintenance = async (data: string, open: boolean) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/changemaintenance`, {
                type: data,
                value: open ? '1' : '0'
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating ${data === 'eventgame' ? 'event game' : 'buy one take one'} maintenance...`,
                success: `${data === 'payout' ? 'Maintenance Payout' : ' Full Maintenance'} successfully ${open ? 'on' : 'off'}. `,
                error: `Error while updating ${data === 'payout' ? 'Maintenance Payout' : ' Full Maintenance'} maintenance.`,
            });
            if (response.data.message === 'success') {
                setRefresh('false');
                setLoading(false);
            }
        } catch (error) {
            setRefresh('true');
            setLoading(false);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string, data: string }>;
                if (axiosError.response && axiosError.response.status === 401) {
                    toast.error(`${axiosError.response.data.data}`);
                    router.push('/');
                }

                if (axiosError.response && axiosError.response.status === 400) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 402) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 403) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 404) {
                    toast.error(`${axiosError.response.data.data}`);
                }
            }
        }
    };

    const resetleaderboard = async () => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reset/resetleaderboard`,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Reseting leaderboard...`,
                success: `Leaderboard successfully reset. `,
                error: `Error while reseting leaderboard.`,
            });
            if (response.data.message === 'success') {
                setRefresh('false');
                setLoading(false);
            }
        } catch (error) {
            setRefresh('true');
            setLoading(false);

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string, data: string }>;
                if (axiosError.response && axiosError.response.status === 401) {
                    toast.error(`${axiosError.response.data.data}`);
                    router.push('/');
                }

                if (axiosError.response && axiosError.response.status === 400) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 402) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 403) {
                    toast.error(`${axiosError.response.data.data}`);
                }

                if (axiosError.response && axiosError.response.status === 404) {
                    toast.error(`${axiosError.response.data.data}`);
                }
            }
        }
    };

  return (
    <div className="w-full flex flex-col gap-4 font-light my-8">

        <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full justify-between'>
                <h2 className=' ~text-sm/xl font-semibold'>Payout({!checked1 ? 'off' : 'on'})</h2>
                <Switch checked={checked1} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('payout', newChecked); 
                }}
                />
            </div>

            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-ful justify-between'>
                <h2 className=' ~text-sm/xl font-semibold'>Full Maintenance ({!checked2 ? 'off' : 'on'})</h2>
                <Switch checked={checked2} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('fullgame', newChecked); 
                }}
                />
            </div>

            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full justify-between'>
                <h2 className=' ~text-sm/xl font-semibold'>Game Wallet Balance ({!game ? 'off' : 'on'})</h2>
                <h2 className=' ~text-xs/sm font-semibold'>Cut Value</h2>
                <Switch checked={game} 
                onCheckedChange={(newChecked) => {
                    setGame(newChecked); 
                    updateMaintenance('game', newChecked); 
                }}
                />
            </div>

            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full justify-between'>
                <h2 className=' ~text-sm/lg font-semibold'>Referral Commission Wallet Balance ({!referral ? 'off' : 'on'})</h2>
                <h2 className=' ~text-xs/sm font-semibold'>Cut Value</h2>
                <Switch checked={referral} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('referral', newChecked); 
                }}
                />
            </div>

            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full justify-between'>
                <h2 className=' ~text-sm/lg font-semibold'>Unilevel Commission Wallet Balance ({!unilevel ? 'off' : 'on'})</h2>
                <h2 className=' ~text-xs/sm font-semibold'>Cut Value</h2>
                <Switch checked={unilevel} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('unilevel', newChecked); 
                }}
                />
            </div>

            <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full justify-between'>
                <h2 className=' ~text-sm/lg font-semibold'>Rank Up Bonus Wallet Balance ({!rankBonus ? 'off' : 'on'})</h2>
                {/* <h2 className=' ~text-xs/sm font-semibold'>Cut Value</h2> */}
                <Switch checked={rankBonus} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('rankbonus', newChecked); 
                }}
                />
            </div>


            {/* <div className='flex flex-col gap-2 bg-cream shadow-md p-4 rounded-md w-full max-w-[280px]'>
                <h2 className=' text-lg font-semibold'>Buy one take one({!checked3 ? 'off' : 'on'})</h2>
                <Switch checked={checked3} 
                 onCheckedChange={(newChecked) => {
                    setChecked3(newChecked); 
                    updateMaintenance('b1t1', newChecked); 
                }}
                />
                
            </div> */}

            {/* <div className='flex flex-col gap-2 bg-white p-4 rounded-md w-full max-w-[280px]'>
                <h2 className=' text-lg font-semibold'>Leaderboard</h2>
                
                <button onClick={resetleaderboard} className=' primary-btn text-xs'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                    Reset</button>
                
            </div> */}

        </div>
    </div>
  )
}
