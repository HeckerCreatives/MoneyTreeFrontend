'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { complanSchema, SaveComplan } from '@/validitions/validation'
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
    min: number,
    max: number,
    duration: number,
    profit: number,
    b1t1: string
    islocked: boolean,
    isActive: boolean,
}

export default function Complancard(prop: Props) {
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
    } = useForm<SaveComplan>({
        resolver: zodResolver(complanSchema),
        defaultValues: ({
             duration: prop.duration,
             profit: prop.profit,
             min: prop.min,
             max: prop.max,
             b1t1: prop.b1t1 === '0' ? false : true,
        })
    });

    useEffect(() => {
        reset({
          duration: prop.duration,
          profit: prop.profit * 100, // Convert profit to percentage
          min: prop.min,
          max: prop.max,
          isActive: prop.isActive
        });
      }, [prop, reset]);

    const onsubmit = async (data: SaveComplan) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bank/editbank`, {
                b1t1: data.b1t1 ? '1' : '0',
                bankid: prop._id,
                profit: data.profit / 100 ,
                duration: data.duration ,
                min: data.min,
                max: data.max,
                isActive: data.isActive
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

    const bgImage = (animal: string) => {
        if(animal === 'Fish'){
            return '/assets/BG4.png'
        }else if(animal === 'Bird'){
            return '/assets/BG5.png'
        }else if(animal === 'Cat'){
            return '/assets/BG3.png'
        }else if(animal === 'Dog'){
            return '/assets/BG1.png'
        } else {
            return '/assets/BG2.png'
        }
    }


    useEffect(() => {
        reset({
            duration: prop.duration,
            profit: prop.profit * 100,
            min: prop.min,
            max: prop.max,
            b1t1: prop.b1t1 === '0' ? false : true,
            isActive: prop.isActive
        })
    },[prop])


  return (
    <div className={` group w-full h-auto bg-cream rounded-md overflow-hidden shadow-md ${(prop.name.includes('Money') || prop.name.includes('Treasure')) && 'grayscale'}`}>

                   

                        <div className=' transition-all duration-300 w-full aspect-video  shadow-sm flex items-center justify-center relative'
                        style={{backgroundImage: `url('/assets/BG.png')`, backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}
                        
                        >
                            <img src={img?.img} alt='store' width={150} height={150}  className=' group-hover:scale-110 transition-all duration-300'/>


                        </div>

                       <form onSubmit={handleSubmit(onsubmit)} action="" className=' p-4'>

                         <div className=' w-full flex justify-between'>
                            <p className=' text-sm font-medium'>Available on Store</p>
                            <Switch 
                            checked={watch("isActive")} 
                            onCheckedChange={(value) => setValue("isActive", value)} 
    />
                        </div>
                        
                        <div className=' w-full flex justify-between mt-2'>
                            <p className=' text-sm font-medium'>Buy one take one</p>
                            <Switch 
                            checked={watch("b1t1")} 
                            onCheckedChange={(value) => setValue("b1t1", value)} 
    />
                        </div>
                        <p className=' text-lg font-black'>{prop.name}</p>


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Profit (%)</label>
                        <Input type='number' className=' text-xs' {...register('profit', {valueAsNumber: true})}/>
                        {errors.profit && <p className='text-[.6em] text-red-500'>{errors.profit.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Duration (days)</label>
                        <Input  type='number' className=' text-xs' {...register('duration', {valueAsNumber: true})}/>
                        {errors.duration && <p className='text-[.6em] text-red-500'>{errors.duration.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Minimum Price (php)</label>
                        <Input  type='number' className=' text-xs' {...register('min', {valueAsNumber: true})}/>
                        {errors.min && <p className='text-[.6em] text-red-500'>{errors.min.message}</p>}


                        {/* <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Maximum (php)</label>
                        <Input  type='number' className=' text-xs' {...register('max', {valueAsNumber: true})}/>
                        {errors.max && <p className='text-[.6em] text-red-500'>{errors.max.message}</p>} */}


                        <Button disabled={prop.name.includes('Money') || prop.name.includes('Treasure')}  className={`w-full mt-4`}>

                            {(prop.name.includes('Money') || prop.name.includes('Treasure')) ? ' Coming Soon!' : 'Save'}
                        </Button>
                       </form>

    </div>
  )
}
