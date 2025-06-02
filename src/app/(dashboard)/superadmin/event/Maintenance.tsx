'use client'
import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'

interface List {
    type: string
    value: string
}

interface IngameEntry {
    type: 'entrylimit' | 'tierentry' | 'gametimelimit';
    value: number | string[];
}

type TierType = 'Nest Stast' | 'Wealth Jar' | 'Piggy Bank';

type TierEntry = {
  type: 'tierentry';
  value: TierType[];
};

const TIER_OPTIONS: TierType[] = ['Nest Stast' ,'Wealth Jar' ,'Piggy Bank'];


export default function Maintenance() {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [list, setList] = useState<List[]>([])
    const [ingame, setIngame] = useState<IngameEntry[]>([])
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [entry, setEntry] = useState(0)
    const [lblimit, setLblimit] = useState(0)

    const event = list.find((item) => item.type === 'eventgame')


    const [tierEntry, setTierEntry] = useState<TierEntry>({
        type: 'tierentry',
        value: [], // or a default selection like ['Expert']
        });


        const toggleTier = (tier: TierType) => {
        setTierEntry(prev => ({
            ...prev,
            value: prev.value.includes(tier)
            ? prev.value.filter(t => t !== tier)
            : [...prev.value, tier],
        }));
        };


    const getMilliseconds = (min: number, secs: number) => {
        const ms = (min * 60 + secs) * 1000;
        console.log("Milliseconds:", ms);
        return ms;
    };

    

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

    // useEffect(() => {
    //     setLoading(true)
    //     const getData = async () => {
    //       try {
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reset/resetleaderboard`,{
    //         withCredentials:true
    //         })

    //         setLoading(false)
            
    //       } catch (error) {
    //         setLoading(false)
    //         if (axios.isAxiosError(error)) {
    //           const axiosError = error as AxiosError<{ message: string, data: string }>;
    //           if (axiosError.response && axiosError.response.status === 401) {
                
    //             }    
    //           } 
    //       }
    //     }
    //     getData()
    // },[ refresh])

     useEffect(() => {
         setChecked1(event?.value == '0' ? false : true)
        
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
                success: `${data === 'eventgame' 
                ? 'Event game' 
                : data === 'payout' 
                    ? 'Payout' 
                    : 'Buy one take one'} successfully ${open ? 'on' : 'off'}.`,

                error: `Error while updating ${data === 'eventgame' ? 'event game' : 'buy one take one'} maintenance.`,
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

    //entry limit
     useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingame/getplayerentrylimit`,{
            withCredentials:true
            })

            setLoading(false)
            setEntry(response.data.data.limit)
            
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

     const updateIngame = async (data: string, value: any) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingame/updateingamelist`, {
                type: data,
                value: value
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating ${data}...`,
                success: `Success`,

                error: `There's an error while updating the data.`,
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

      const updateEntrylimit = async (value: any) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingame/saveplayerentrylimit`, {
              entrylimit: value
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating entry limit...`,
                success: `Success`,

                error: `There's an error while updating the data.`,
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

    //tier entry
     useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingame/gettierentry`,{
            withCredentials:true
            })

            setLoading(false)
           const data = response.data.data;

            const activeTiers = Object.entries(data)
                .filter(([_, status]) => status)
                .map(([tier]) => tier as TierType);

            setTierEntry({
                type: 'tierentry',
                value: activeTiers,
            });
            
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

    const updateTierEntry = async () => {
        setRefresh('true');
        setLoading(true);
        try {

             const payload = {
            entries: TIER_OPTIONS.map(tier => ({
                type: tier,
                status: tierEntry.value.includes(tier),
            }))
            }; 
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingame/setevententry`, {
              entries: payload.entries
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating tier entry...`,
                success: `Success`,

                error: `There's an error while updating the data.`,
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

     //time limit
     useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ingame/geteventtimelimit`,{
            withCredentials:true
            })

            setLoading(false)
            setMinutes(response.data.data.minutes)
            setSeconds(response.data.data.seconds)
         
            
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

    const updateTimelimit = async () => {
        setRefresh('true');
        setLoading(true);
        try {

        
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ingame/saveeventtimelimit`, {
              minute: minutes,
              seconds: seconds
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating time limit...`,
                success: `Success`,

                error: `There's an error while updating the data.`,
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

     //leaderboard limit
     useEffect(() => {
        setLoading(true)
        const getWallets = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/getlblimit`,{
            withCredentials:true
            })

            setLoading(false)
            setLblimit(response.data.data.limit)
     
         
            
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

    const updateLeaderboardlimit = async () => {
        setRefresh('true');
        setLoading(true);
        try {

        
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/savelblimit`, {
              limit: lblimit
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating leaderboard limit...`,
                success: `Success`,

                error: `There's an error while updating the data.`,
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

    // useEffect(() => {
    //     setEntry(entrylimit?.value as number)
    // },[])



  return (
    <div className="w-full flex flex-col gap-4 font-light">

        <div className=' w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4'>
        

            <div className=' h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full '>
                <h2 className=' text-lg font-semibold'>Events ({!checked1 ? 'off' : 'on'})</h2>
                <Switch checked={checked1} 
                onCheckedChange={(newChecked) => {
                    setChecked1(newChecked); 
                    updateMaintenance('eventgame', newChecked); 
                }}
                />
            </div>

            <div className=' h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full '>
                <h2 className=' text-lg font-semibold'>Leaderboard</h2>
                
                <button onClick={resetleaderboard} className=' primary-btn text-xs'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                    Reset</button>
                
            </div>

              <div className=' h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full'>
                <h2 className=' text-lg font-semibold'>Player Entry Limit</h2>
                <div className=' flex items-center gap-2'>
                    <Input placeholder='Limit' type='number' value={entry} onChange={(e) => setEntry(e.target.valueAsNumber)}/>
                    <button onClick={() => updateEntrylimit(entry)}  className=' px-3 primary-btn text-xs'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                Save</button>
                </div>
                
                
            </div>

            <div className="h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full">
                <h2 className="text-lg font-semibold">Tier Entry</h2>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-4 w-full flex-wrap">
                    {TIER_OPTIONS.map((tier) => (
                        <label key={tier} className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            checked={tierEntry.value?.includes(tier)}
                            onChange={() => toggleTier(tier)}
                        />
                        {tier}
                        </label>
                    ))}
                    </div>

                    <button
                    onClick={() => updateTierEntry()}
                    className="px-3 py-1 primary-btn text-xs flex items-center gap-2"
                    >
                    {loading && <span className="loader" />}
                    Save
                    </button>
                </div>
            </div>



            <div className=' h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full '>
                <h2 className=' text-lg font-semibold'>Game Time Limit</h2>
                <div className=' flex items-end justify-center w-full gap-2'>
                 <div className=' w-full flex flex-col'>
                    <label htmlFor="" className=' text-[.7rem]'>Minutes</label>
                    <Input placeholder="Seconds" type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.valueAsNumber)} />
                    </div>

                    <div className=' w-full flex flex-col'>
                    <label htmlFor="" className=' text-[.7rem]'>Seconds</label>
                    <Input placeholder="Seconds" type="number" min="0" max="59" value={seconds}   
                    onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        if (val >= 0 && val <= 59) {
                        setSeconds(val);
                        } else if (val > 59) {
                        setSeconds(59); 
                        } else {
                        setSeconds(0);
                        }
                    }} />
                    </div>


                    <button onClick={() => updateTimelimit()} className=' px-3 primary-btn w-fit text-xs flex items-center justify-center gap-2'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                Save</button>
                </div>
                
                
            </div>

              <div className=' h-auto flex flex-col gap-2 bg-cream p-4 rounded-md w-full'>
                <h2 className=' text-lg font-semibold'>Leaderboard Limit</h2>
                <div className=' flex items-center gap-2'>
                    <Input placeholder='Limit' type='number' value={lblimit} onChange={(e) => setLblimit(e.target.valueAsNumber)}/>
                    <button onClick={() => updateLeaderboardlimit()}  className=' px-3 primary-btn text-xs'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                Save</button>
                </div>
                
                
            </div>

            



        </div>
    </div>
  )
}
