'use client'
import React from 'react'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { conversionRate, CreateMasterKey, masterkey, SaveConversionRate } from '@/validitions/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import loadingStore from '@/store/loading'
import rateStore from '@/store/rate'
import refreshStore from '@/store/refresh'
import { Button } from '../ui/button'

export default function Masterkey() {
    const {rate} = rateStore()
    const { refresh, setRefresh } = refreshStore();
    const { loading, setLoading, clearLoading } = loadingStore();
    const router = useRouter();


    // Form handler
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useForm<CreateMasterKey>({
        resolver: zodResolver(masterkey),
        defaultValues: ({})
    });

    const save = async (data: CreateMasterKey) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/globalpass/createglobalpassword`, {
                secretkey: data.key
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Creating master key...`,
                success: `Master key successfully created. `,
                error: `Error while creating master key.`,
            });
            if (response.data.message === 'success') {
                setRefresh('false');
                reset();
                setLoading(false);
                // window.location.reload()
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
    <div className=' w-full h-fit max-w-[300px] bg-cream p-6 rounded-md'>
        <h2 className='text-lg font-semibold'>Master Key</h2>
        <form onSubmit={handleSubmit(save)} className=' flex flex-col gap-2'>
            <label htmlFor="" className=' text-sm text-zinc-500 mt-4'>Secret Key</label>
            <Input placeholder='Secret Key' type='text' className=' bg-gray-100' {...register('key')}/>

         
            <Button disabled={loading} className=' mt-2'>
            {loading === true && (
                        <span className='loader'></span>
                    )}
                Save</Button>
        </form>
    </div>
    
  )
}
