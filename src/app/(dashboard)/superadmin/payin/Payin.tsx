'use client';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendFiat, SendFiat } from '@/validitions/validation';
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from 'next/navigation';
import loadingStore from '@/store/loading';
import refreshStore from '@/store/refresh';
 

interface UserSerach {
    id: string
    username: string
    referralUsername: string
    status:string
    createdAt: string
}

export default function Payin() {
  const { loading, setLoading, clearLoading } = loadingStore();
  const { refresh, setRefresh} = refreshStore()
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState("")
  const router = useRouter()
  const [users, setUsers] = useState<UserSerach[]>([])

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SendFiat>({
    resolver: zodResolver(sendFiat),
  });

  // Handle form submission
  const onSubmit = async (data: SendFiat) => {
    setLoading(true);
    setRefresh('true')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payin/superadminsendfiatplayer`,
        {
          playerusername: data.username,
          amount: data.amount,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Fiat sent successfully!');
      reset()
      clearLoading();
      setRefresh('false')

    } catch (error) {
      setLoading(false);
      setRefresh('false')

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string; data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
          toast.error(`${axiosError.response.data.data}`);
          router.push('/')
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


    useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/searchplayerlist?playerusername=${user}&limit=99999`,
          { withCredentials: true }
        )
        setUsers(res.data.data.userlist)
      } catch (err) {
        console.error("Fetch failed", err)
      }
    }

    if (user.trim() === "") {
      getList()
      return
    }

    const delayDebounce = setTimeout(() => {
      if (user.trim().length > 0) {
        getList()
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [user])

 const selectedUsername = watch("username");

 const amount = watch('amount', 0);

 // Function to format number with commas
 const formatNumber = (value: number) => {
   return value.toLocaleString();
 };

 // Handle input change
 const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   let rawValue = event.target.value.replace(/,/g, ''); // Remove existing commas
   let numericValue = Number(rawValue);

   if (!isNaN(numericValue)) {
     setValue('amount', numericValue, { shouldValidate: true }); // Update form state
   }
 };

  return (
    <div className='w-full flex flex-col gap-8 font-light py-8'>

      <div className='w-full flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center max-w-[400px] w-full bg-cream h-auto rounded-lg relative p-4'>
          <div className='w-full p-4 flex flex-col gap-4'>
            <p className='text-lg font-medium'>Send fiat to player</p>

            


            {/* Form with validation */}
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
              <p className=' label'>Username</p>
               <Controller
                           name="username"
                           control={control}
                           render={({ field }) => {
                             const selectedUser = users.find((item) => item.username === field.value)
             
                             return (
                               <Popover open={open} onOpenChange={setOpen}>
                                 <PopoverTrigger asChild  className=' w-full'>
                                   <Button
                                     variant="outline"
                                     role="combobox"
                                     aria-expanded={open}
                                     className="w-full  justify-between bg-gray-100"
                                   >
                                     {selectedUser ? selectedUser.username : "Select username..."}
                                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                   </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-full p-0 ">
                                   <Command>
                                     <CommandInput
                                       value={user}
                                       onValueChange={setUser}
                                       placeholder="Search user..."
                                       className=' w-full'
                                     />
                                     <CommandList>
                                       <CommandEmpty>No user found.</CommandEmpty>
                                       <CommandGroup>
                                         {users.map((item) => (
                                           <CommandItem
                                             key={item.id}
                                             value={item.username} // ✅ use username for filtering
                                             onSelect={() => {
                                               field.onChange(item.username) // ✅ store id in form
                                               setOpen(false)
                                             }}
                                           >
                                             <Check
                                               className={cn(
                                                 "mr-2 h-4 w-4",
                                                 field.value === item.username ? "opacity-100" : "opacity-0"
                                               )}
                                             />
                                             {item.username}
                                           </CommandItem>
                                         ))}
                                       </CommandGroup>
                                     </CommandList>
                                   </Command>
                                 </PopoverContent>
                               </Popover>
                             )
                           }}
                         />
              {errors.username && <p className='text-[.6em] text-red-400'>{errors.username.message}</p>}


              <div>
                <p className=' label'>Amount</p>
                <Input
                  type="text" // Use text to allow formatted display
                  placeholder=""
                  className="bg-gray-100"
                  defaultValue={amount}
                  value={amount ? formatNumber(amount) : ''}
                  onChange={handleAmountChange}
                  onBlur={() => setValue('amount', amount || 0, { shouldValidate: true })} // Ensure valid number on blur
                />
                {errors.amount && (
                  <p className='error text-red-600 mt-2'>{errors.amount.message}</p>
                )}
              </div>

              


              <Button type='submit' className=' mt-4' disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}