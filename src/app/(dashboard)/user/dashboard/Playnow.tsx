'use client'
import { Download, Facebook, Instagram, Play, Send, Twitter, Youtube } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import loadingtableStore from '@/store/tableloading';
import refreshStore from '@/store/refresh';


interface List {
  _id: string,
  link: string,
  title: string,
}

export default function Playnow() {
  const router = useRouter()
  const {loading, setLoading, clearLoading} = loadingtableStore()
  const [search, setSearch] = useState('')
  const { refresh, setRefresh} = refreshStore()
  const [list, setList] = useState<List[]>([])
  const [gameid, setGameid] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/getsociallinksa`,{
        withCredentials:true
        })

        setLoading(false)
        setList(response.data.data)
        
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
  const getList = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getuserdetails`,{
      withCredentials:true
      })

      setGameid(response.data.data.gameid)

    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string, data: string }>;
        if (axiosError.response && axiosError.response.status === 401) {
           
          }    
        } 
    }
  }
  getList()
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

const copyGameid = () => {
  navigator.clipboard.writeText(`${gameid}`)
  toast.success('Game id copied')
}

const gamerUrl = `${process.env.NEXT_PUBLIC_GAME_LINK}/${gameid}`



  return (
    <div className=' w-full h-fit flex flex-col bg-white rounded-xl shadow-sm p-6'>

        <h2 className=' text-xl font-semibold'>Play now</h2>

        <div className=' w-full grid grid-cols-1 gap-4 mt-2'>

          {/* <div className=' w-full flex flex-col gap-2'>
            <div className=' w-full aspect-square relative bg-gray-100 rounded-md flex items-center justify-center'>
                <img src="/assets/Dog1.png" alt="bird" width={250} height={250} />
            </div>
            <button className=' text-sm text-white font-medium bg-dark py-3 w-full rounded-lg'><Download size={20}/>Download apk</button>

          </div> */}

          <div className=' w-full flex flex-col gap-2'>
            <div className=' relative w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center'
            style={{backgroundImage: "url(/hero2.png)", backgroundSize:'cover', backgroundRepeat:'no-repeat'}}
            >
                <img src="/assets/Trainer1.png" alt="bird" width={100} height={100} className=' ~w-20/32 absolute bottom-0 left-0' />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
            <p className=' text-sm text-white font-medium bg-dark py-3 w-full rounded-lg'><Play size={20}/>Play now</p>
            </DialogTrigger>
            <DialogContent className=''>
              <DialogHeader>
                <DialogTitle>Play now</DialogTitle>
                <DialogDescription>
                  Once you continue game id will be copied, dont forget to enter your game id when you are in the game.
                </DialogDescription>
              </DialogHeader>

              <div className=' flex items-center justify-end gap-2'>
                <button onClick={() => setOpen(!open)} className=' px-4 py-2 bg-gray-200 rounded-md ~text-xs/sm'>Cancel</button>
                <a onClick={copyGameid} href={gamerUrl} target='_blank' className=' px-4 w-fit text-sm text-white font-medium bg-dark py-2 rounded-lg'>Continue</a>

              </div>


            </DialogContent>
          </Dialog>

          </div>
          
        </div>

        <h2 className=' text-sm mt-6'>Follow us on:</h2>

        <div className=' w-full grid grid-cols-6 gap-2'>
          {list.map((item, index) => (
            <a key={index} href={item.link} className=' socials' target='_blank'>
            {icon(item.title)}
          </a>
          ) )}
        </div>


    </div>
  )
}
