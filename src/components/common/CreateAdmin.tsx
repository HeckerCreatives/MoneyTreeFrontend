import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '../ui/input'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAdmin, CreateAdminAccount, PaymentForm, paymentFormSchema } from '@/validitions/validation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeOff, Plus } from 'lucide-react'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'

  
type Props = {
    wallet: string
    type: string
}

export default function Createadminform( prop: Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [open, setOpen] = useState(false)

    
    


    const { register,control,reset, handleSubmit,setValue, formState: { errors } } = useForm<CreateAdminAccount>({
        resolver: zodResolver(createAdmin),
      });
    
      const onSubmit = async (data: CreateAdminAccount) => {
        setLoading(true)
        setRefresh('true')
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/registerstaffs`,{
               username: data.username,
               password: data.password
            },{
                withCredentials: true,
                headers:{
                    'Content-Type':'Application/json'
                }
            })

            const response = await toast.promise(request, {
                loading: `Creating admin account...`,
                success: `Successfully created. `,
                error: `Error while creating admin account.`,
            });
            if(response.data.message === 'success'){
                setLoading(false)
                setRefresh('false')
                reset()
                setOpen(false)


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
      };


      console.log(prop)
      
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger className=' primary-btn px-4'>
        <Plus size={15}/>Create
    </DialogTrigger>
    <DialogContent className=' md:w-full w-[90%] rounded-lg'>
      <DialogHeader>
        <DialogTitle>Create Admin Account</DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className=' flex flex-col gap-1'>

        <label htmlFor="type" className=' label mt-2'>Username</label>
        <Input type='text' placeholder='Username' {...register('username')}/>
        {errors.username && <span className="error">{errors.username.message}</span>}


         <label htmlFor="" className='text-sm text-zinc-500'>Password</label>
                <div className="relative">
                    <Input
                        placeholder='Password'
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


        <button disabled={loading} className=' primary-btn px-4 py-3 mt-4'>
            {loading === true && (
                <span className=' loader'></span>
            )}
            Save</button>
    
      </form>

     
    </DialogContent>
  </Dialog>
  
  )
}
