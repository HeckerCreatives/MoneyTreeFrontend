import { Facebook, Send, Twitter } from 'lucide-react'
import React from 'react'
import { FaDiscord, FaX, FaXTwitter } from 'react-icons/fa6'
import { navigation } from '../data'

export default function Footer() {
  return (
    <div className=' w-full bg-amber-950 h-auto py-8 flex items-center justify-center'>
        <div className=' max-w-[1440px] w-full flex lg:flex-row flex-col gap-8 items-center justify-between'>
            <div className=' flex flex-col lg:flex-row items-center gap-4  '>
                <img src="/assets/logo.png" alt="" width={130} height={130} />

                <div className=' flex items-center gap-2'>
                    <a href="" className=' p-2 rounded-full bg-amber-50 text-amber-800'>
                    <Facebook size={20}/>
                    </a>

                    <a href="" className=' p-2 rounded-full bg-amber-50 text-amber-800'>
                    <Send size={20}/>
                    </a>

                    <a href="" className=' p-2 rounded-full bg-amber-50 text-amber-800'>
                    <FaXTwitter size={20}/>
                    </a>

                    <a href="" className=' p-2 rounded-full bg-amber-50 text-amber-800'>
                    <FaDiscord size={20}/>
                    </a>

                </div>
            </div>
            <div className=' flex lg:flex-row flex-col items-center justify-center gap-2 '>
                {navigation.map((item, index) => (
                    <a key={index} href={item.route} className=' text-amber-50 font-bold text-lg hover:bg-amber-800 px-3 py-1 rounded-full transition-all duration-200'>{item.name}</a>
                ))}
            </div>

            

            <p className=' text-amber-50 text-sm'>2025 Money Tree. All Rights Reserved </p>
        </div>

    </div>
  )
}
