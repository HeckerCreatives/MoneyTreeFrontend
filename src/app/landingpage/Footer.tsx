'use client'
import { Facebook, Instagram, Send, Twitter, Youtube } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaDiscord, FaTelegram, FaX, FaXTwitter } from 'react-icons/fa6'
import { navigation, privacypolicy, trems } from '../data'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios'

interface List {
    _id: string,
    link: string,
    title: string,
  }




export default function Footer() {
  const [activeTab, setActiveTab] = useState("terms")

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
    <div className=' w-full bg-amber-950 h-auto py-8 flex flex-col items-center justify-center'>
        <div className=' max-w-[1440px] w-full flex lg:flex-row flex-col gap-8 items-center justify-between'>
            <div className=' flex flex-col lg:flex-row items-center gap-4  '>
                <img src="/assets/logo.png" alt="" width={130} height={130} />

                <div className=' flex items-center gap-2'>
                    {list.map((item, index) => (
                        <a key={index} href={item.link} className=' hover:scale-110 transition-all duration-200 p-2 rounded-full bg-amber-50 text-amber-800'>
                            {icon(item.title)}
                        </a>
                    ))}
                   

                   

                </div>
            </div>
            <div className=' flex lg:flex-row flex-col items-center justify-center gap-2 '>
                {navigation.map((item, index) => (
                    <a key={index} href={item.route} className=' text-amber-50 font-bold text-lg hover:bg-amber-800 px-3 py-1 rounded-full transition-all duration-200'>{item.name}</a>
                ))}
            </div>

            


            <Dialog>
            <DialogTrigger>
              <div className=' flex items-center gap-4 mt-4 text-sm text-amber-50'>
                <p onClick={() => setActiveTab('terms')} className=' hover:text-amber-600 cursor-pointer'>Terms & Conditions</p>
                <p onClick={() => setActiveTab('privacy')} className=' hover:text-amber-600 cursor-pointer'>Privacy Policy</p>

              </div>
            </DialogTrigger>
            <DialogContent className=' bg-amber-50 text-amber-950 w-[95%] md:w-full max-h-[90%] overflow-y-auto'
            
            >
              <DialogHeader>
                <DialogTitle>Money Tree Legal Information</DialogTitle>
                <DialogDescription>
                  Please review our Terms & Conditions and Privacy Policy
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-w-4xl mx-auto text-sm">
              
             
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-cream">
                      <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                    </TabsList>
                    <TabsContent value="terms">
                     <h2>{trems.title}</h2>
                     <p className=' whitespace-pre-wrap'>{trems.content}</p>
                    </TabsContent>
                    <TabsContent value="privacy">
                        <h2>{privacypolicy.title}</h2>
                        <p className=' whitespace-pre-wrap'>{privacypolicy.content}</p>
                    </TabsContent>
                  </Tabs>
               
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className=' text-amber-50 ~text-xs/sm mt-12'>2025 Money Tree. All Rights Reserved </p>


    </div>
  )
}
