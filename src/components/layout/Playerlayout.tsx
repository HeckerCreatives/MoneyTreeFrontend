'use client'
import { user } from '@/routes/route'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Copy, LogIn, LogOut, Menu, MenuIcon } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { encryptUid } from '@/helpers/encrypt'
import rateStore from '@/store/rate'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import pageStore from '@/store/Page'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export default function Playerlayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const path = usePathname()
    const params = useSearchParams()
    const router = useRouter()
    const [avatar, setAvatar] = useState('')
    const [referral, setReferral] = useState('')
    const {rate, setRate, clearRate} = rateStore()
    const {page, setPage} = pageStore()
    const [name, setName] = useState('')
    const [referrer, setReferrer] = useState('')
    
    
    const breadcrumd = user.find((item) => path.includes(item.path))

    useEffect(() => {
      const getAvatar = localStorage.getItem('avatar')

      setAvatar(getAvatar || '')
  },[avatar])

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
            toast.error(`${axiosError.response.data.data}`)
            router.push('/')  
            }    
          } 
      }
    }
    getWallets()
},[])

  const copyReferral = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_REFERRAL}/auth/signup?uid=${encryptUid(referral)}`)
    toast.success('Referral link copied')
  }

  const logout = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.message === 'success') {
        toast.success('Logging out...')
        router.push('/auth/login')
      } 

    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string, data: string }>
        if (axiosError.response && axiosError.response.status === 401) {
          toast.error(`${axiosError.response.data.data}`)
          router.push('/')
        }

      }
    }
  }

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuserdetails`,{
        withCredentials:true
        })

        setName(response.data.data.username)
        setReferrer(response.data.data.referral)
      } catch (error) {

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message: string, data: string }>;
          if (axiosError.response && axiosError.response.status === 401) {
            toast.error(`${axiosError.response.data.data}`)
            router.push('/auth/login')
            }    
          } 
      }
    }
    getList()
},[])

    
  return (
    <div className=' w-full max-w-[1920px] h-[100dvh] grid grid-cols-1 lg:grid-cols-[100px_1fr] items-center p-4 overflow-hidden'
        style={{backgroundImage: "url('/Christmas Theme.jpg')" , backgroundPosition:'bottom', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}

    
    >

      <div className=' relative z-40 w-full h-full hidden lg:flex items-center justify-center bg-amber-950 rounded-md '>
        <nav className=' px-4 w-full max-w-[1520px] h-full flex flex-col items-center justify-between relative p-4'>
          <div className=' flex flex-col gap-8'>
            <div>
                <img src="/assets/logo.png" alt="" width={100}/>

            </div>

            <div className=' hidden  lg:flex flex-col gap-2 items-center rounded-full shadow-sm'>
                {user.map((item, index) => (
                  <TooltipProvider key={index} delayDuration={.5} >
                  <Tooltip>
                    <TooltipTrigger>
                    <a onClick={() => setPage(item.name)} href={item.path} className={` flex items-center gap-2 px-2 py-2 text-[.7rem] rounded-md font-medium ${path.includes(item.path) ? 'bg-amber-50 text-amber-950' : 'text-amber-50 hover:bg-amber-50 hover:text-amber-950'} transition-all duration-200`}>{item.icon}</a>
                    </TooltipTrigger>
                    <TooltipContent side='left' className=' font-semibold bg-amber-50 text-amber-950 text-xs'>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                   
                ))}

            </div>
          </div>
          
{/* 
          <div className=' flex items-center gap-2 text-amber-950'>
              <p>{breadcrumd?.name}</p>
              <div className=' h-5 aspect-square rounded-full bg-amber-950'>

              </div>

            </div> */}

        </nav>
      </div>
        

        <div className=" w-full relative h-screen flex flex-col items-center overflow-y-auto overflow-x-hidden lg:px-8"
        >
          <header className=' px-4 rounded-md sticky top-0 z-50 bg-amber-50 text-xs font-semibold w-full flex text-amber-950 items-center justify-between py-2 border-b-2 border-amber-950/20'>
          <div className=' flex items-center gap-4'>
            <Sheet>
            <SheetTrigger className=' lg:hidden block bg-amber-950 p-1 rounded-sm text-amber-50'>
              <MenuIcon size={15}/>
            </SheetTrigger>
            <SheetContent side={'left'} className=' bg-amber-50'>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription>
                  
                </SheetDescription>
              </SheetHeader>
              <div>
                <img src="/assets/logo.png" alt="" width={150}/>

            </div>

            <div className=' flex flex-col gap-1 rounded-full shadow-sm mt-4'>
                {user.map((item, index) => (
                  <a key={index} onClick={() => setPage(item.name)} href={item.path} className={`  flex items-center gap-2 px-2 py-2 text-[.7rem] rounded-md font-medium ${path.includes(item.path) ? 'bg-amber-950 text-amber-50' : 'text-amber-950 hover:bg-amber-950 hover:text-amber-50'} transition-all duration-200`}>{item.icon} {item.name}</a>

                ))}

            </div>
            </SheetContent>
          </Sheet>

              <p className=' text-lg font-black'>
                {breadcrumd?.name} 

               <span className=' text-amber-800'> {(path.includes('/user/sponsor') && referrer !== null) && `(${referrer})`}</span> 
              </p>
          </div>
          


           

            <DropdownMenu>
                  <DropdownMenuTrigger className=' focus:ring-0'>
                    <div className=' flex items-center gap-2'>
                      <p>{name}</p>
                      <div className=' h-8 aspect-square rounded-full'>
                        <img src="/assets/coin.png" alt="coin" width={50} height={50} />
                      </div>

                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent >
                      <DropdownMenuLabel className=' text-xs'>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className=' text-xs flex items-center gap-2'><button onClick={logout} className=' flex items-center gap-2'>Log out <LogIn size={12}/></button></DropdownMenuItem>
                  
                  
                  </DropdownMenuContent>
              </DropdownMenu>

          </header>
        
          <main className="  w-full relative flex flex-1 flex-col items-center gap-4  ">
              {children}
          </main>
        </div>

    </div>
  )
}
