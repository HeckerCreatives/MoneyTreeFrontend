'use client'
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { userchangepassword, UserChangePassword } from '@/validitions/validation';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import loadingStore from '@/store/loading';
import refreshStore from '@/store/refresh';
import { Button } from '../ui/button';

export default function Changepasswordadmin() {
    const { refresh, setRefresh } = refreshStore();
    const { loading, setLoading, clearLoading } = loadingStore();
    const router = useRouter();

    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form handler
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useForm<UserChangePassword>({
        resolver: zodResolver(userchangepassword),
        defaultValues: ({})
    });

    const changePassword = async (data: UserChangePassword) => {
        setRefresh('true');
        setLoading(true);
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/staffuser/changepasssuperadmin`, {
                password: data.password
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating password...`,
                success: `Updated successfully. `,
                error: `Error while updating password.`,
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

    return (
        <div className='w-full max-w-[350px] h-fit flex flex-col gap-4 bg-cream shadow-sm p-6 rounded-md'>
            <h2 className='text-lg font-semibold'>Change password</h2>

            <form onSubmit={handleSubmit(changePassword)} className='flex flex-col gap-1'>
                <label htmlFor="" className='text-sm text-zinc-500'>New password</label>
                <div className="relative">
                    <Input
                        placeholder='New password'
                        className='bg-gray-100'
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? <Eye size={15}/> : <EyeOff size={15}/>}
                    </button>
                </div>
                {errors.password && <p className='text-[.6em] text-red-500'>{errors.password.message}</p>}

                <label htmlFor="" className='text-sm text-zinc-500 mt-4'>Confirm password</label>
                <div className="relative">
                    <Input
                        placeholder='Confirm password'
                        className='bg-gray-100'
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirm')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showConfirmPassword ? <Eye size={15}/> : <EyeOff size={15}/>}
                    </button>
                </div>
                {errors.confirm && <p className='text-[.6em] text-red-500'>{errors.confirm.message}</p>}

                <Button disabled={loading} className=' mt-4'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                    Save password
                </Button>
            </form>
        </div>
    );
}