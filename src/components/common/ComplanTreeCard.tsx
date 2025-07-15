'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { complanSchema, complanTreeSchema, SaveComplan, SaveTreeComplan } from '@/validitions/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Switch } from '../ui/switch'
import { banks, petimg } from '@/app/data'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'
import { Button } from '../ui/button'

type Props = {
    _id: string,
    name: string
    type: string
    duration: number,
    profit: number,
    isActive: boolean
    islocked: boolean
    limit: number,
    stocks: number
    price: number
}

export default function Complantreecard(prop: Props) {
    const [dialog, setDialog] = useState(false)
    const [isOpen, setIsopen] = useState('')
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [checked, setChecked] = useState(false)
    

    // Form handler
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        trigger,
        formState: { errors },
    } = useForm<SaveTreeComplan>({
        resolver: zodResolver(complanTreeSchema),
        defaultValues: ({
             duration: prop.duration,
             profit: prop.profit,
             price: prop.price,
             isActive: prop.isActive,
             limit: prop.limit,
             stocks: prop.stocks

        })
    });

    useEffect(() => {
        reset({
          duration: prop.duration,
          profit: prop.profit * 100,
          price: prop.price,
          isActive: prop.isActive,
          limit: prop.limit,
          stocks: prop.stocks
        });
      }, [prop, reset]);

    const onsubmit = async (data: SaveTreeComplan) => {
        setRefresh('true');
        setLoading(true);
        console.log(data)
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tbank/edittbank`, {
                isActive: data.isActive,
                tbankid: prop._id,
                profit: data.profit / 100 ,
                duration: data.duration ,
                price: data.price,
                stocks: data.stocks,
                limit: data.limit
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating complan for ${prop.name}...`,
                success: `Complan updated successfully. `,
                error: `Error while updating complan for ${prop.name}.`,
            });
            if (response.data.message === 'success') {
                setRefresh('false');
                reset();
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

    const img = banks.find((item) => item.id === prop.name)

     const bgImage = () => {
            if(prop.name === 'Mango'){
                return '/tree/mango_4.jpg'
            }else if(prop.name === 'Avocado'){
                return '/tree/avocado_4.jpg'
            } else if(prop.name === 'Apple'){
                return '/tree/apple_4.jpg'
            } else if(prop.name === 'Lanzones'){
                return '/tree/lanzones_4.jpg'
            } else {
                return '/tree/rambutan_4.jpg'
            }
    }


    useEffect(() => {
        reset({
             duration: prop.duration,
            profit: prop.profit * 100,
            price: prop.price,
            isActive: prop.isActive,
            limit: prop.limit,
            stocks: prop.stocks
        })
    },[prop])



  return (
    <div className={` group w-full h-auto bg-cream rounded-md overflow-hidden shadow-md ${(prop.name.includes('Money') || prop.name.includes('Treasure')) && 'grayscale'}`}>

                   

                        <div className=' relative transition-all duration-300 w-full overflow-hidden  shadow-sm flex items-center justify-center '
                        // style={{backgroundImage: `url(${bgImage()})`, backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'top'}}
                        
                        >

                            <img src={bgImage()} alt="tree"  className=' object-cover'/>


                        </div>

                       <form onSubmit={handleSubmit(onsubmit)} action="" className=' p-4'>
                        
                        <div className=' w-full flex justify-between'>
                            <p className=' text-sm font-medium'>Available on Store</p>
                            <Switch 
                            checked={watch("isActive")} 
                            onCheckedChange={(value) => setValue("isActive", value)} 
    />
                        </div>
                        <p className=' text-lg font-black'>{prop.name}</p>


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Profit (%)</label>
                        <Input type='number' className=' text-xs' {...register('profit', {valueAsNumber: true})}/>
                        {errors.profit && <p className='text-[.6em] text-red-500'>{errors.profit.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Duration (days)</label>
                        <Input  type='number' className=' text-xs' {...register('duration', {valueAsNumber: true})}/>
                        {errors.duration && <p className='text-[.6em] text-red-500'>{errors.duration.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Price (php)</label>
                        <Input  type='number' className=' text-xs' {...register('price', {valueAsNumber: true})}/>
                        {errors.price && <p className='text-[.6em] text-red-500'>{errors.price.message}</p>}

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Stocks</label>
                        <Input  type='number' className=' text-xs' {...register('stocks', {valueAsNumber: true})}/>
                        {errors.stocks && <p className='text-[.6em] text-red-500'>{errors.stocks.message}</p>}

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Limit</label>
                        <Input  type='number' className=' text-xs' {...register('limit', {valueAsNumber: true})}/>
                        {errors.limit && <p className='text-[.6em] text-red-500'>{errors.limit.message}</p>}


                        <Button disabled={prop.name.includes('Money') || prop.name.includes('Treasure')}  className={`w-full mt-4`}>

                            {(prop.name.includes('Money') || prop.name.includes('Treasure')) ? ' Coming Soon!' : 'Save'}
                        </Button>
                       </form>

    </div>
  )
}
