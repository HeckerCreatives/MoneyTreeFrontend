'use client'
import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Facebook, Instagram, Menu, Youtube } from 'lucide-react'
import { navigation } from '../data'
import axios from 'axios'
import { FaDiscord, FaXTwitter, FaTelegram } from 'react-icons/fa6'
import Navigation from './Navigation'
  
interface List {
    _id: string,
    link: string,
    title: string,
  }


export default function Header() {

    const [list, setList] = useState<List[]>([])
  
    useEffect(() => {
      const getData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/getsociallinkslp`,{
          withCredentials:true
          })
  
          setList(response.data.data)
          
        } catch (error) {
          
      }
    }
      getData()
  },[])

  const icon = (data: string) => {
    if(data === 'facebook'){
      return <Facebook size={25}/>
    }else if(data === 'discord'){
      return  <FaDiscord size={25} />
    }else if(data === 'x'){
      return  <FaXTwitter size={25}/>
    }else if(data === 'instagram'){
      return  <Instagram size={25}/>
    }else if(data === 'telegram'){
      return  <FaTelegram  size={25}/>
    } else {
      return  <Youtube size={25}/>
  
    }
  }
  return (
    <section id={'home'} className=' w-full max-h-[1080px] h-screen flex flex-col items-center py-4'
    style={{backgroundImage: "url('/assets/Header BG.png')" , backgroundPosition:'bottom', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
    >
        <Navigation/>

        <div className=' relative w-full max-w-[1440px] h-full flex items-center justify-center'>
            <img src="/assets/logo.png" alt="" width={550} height={550} className=' md:-translate-y-28'/>
            <img src="/assets/Maskot.png" alt="" width={400} height={400} className=' hidden md:block absolute left-0 bottom-4 scale-x-[-1] -translate-x-16'/>

        </div>

    </section>
  )
}
