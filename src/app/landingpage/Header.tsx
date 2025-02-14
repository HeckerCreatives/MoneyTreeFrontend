import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { navigation } from '../data'
  



export default function Header() {
  return (
    <section id={'home'} className=' w-full max-h-[1080px] h-screen flex flex-col items-center py-4'
    style={{backgroundImage: 'url(/assets/Background.png)', backgroundPosition:'bottom', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
    >
        <nav className='relative w-full max-w-[1440px] h-[100px] flex items-center justify-center px-4'
        >
            <img src="/assets/header-bg.png" alt="header" className=' w-[1440px] h-[90px]' />

            <div className=' w-full max-w-[85%] lg:max-w-[90%] flex items-center justify-between absolute mb-5'>
                <div className=' '>
                    <img src="/assets/logo.png" alt="" width={150} height={150} className=' w-[100px] lg:w-[120px]' />
                </div>

                <div className=' hidden lg:flex items-center justify-center gap-2'>
                    {navigation.map((item, index) => (
                        <a key={index} href={item.route} className=' text-amber-50 font-bold text-lg hover:bg-amber-800 px-3 py-1 rounded-full transition-all duration-200'>{item.name}</a>
                    ))}
                </div>

                <Sheet>
                <SheetTrigger className=' block lg:hidden p-2 bg-amber-800 rounded-md text-white'>
                    <Menu size={20}/>
                </SheetTrigger>
                <SheetContent className=' flex flex-col items-center bg-transparent border-none'
                style={{backgroundImage: 'url(/assets/nav-bg.png)', backgroundPosition:'left', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                >
                    <SheetHeader>
                    <SheetTitle>
                         <div className=' '>
                            <img src="/assets/logo.png" alt="" width={170} height={170} />

                        </div>
                    </SheetTitle>
                    <SheetDescription>
                       
                    </SheetDescription>
                    </SheetHeader>
                    <div className='flex flex-col text-amber-900 items-center justify-center gap-2'>
                        {navigation.map((item, index) => (
                            <a key={index} href={item.route} className='  font-bold text-lg hover:text-amber-50 hover:bg-amber-800 px-3 py-1 rounded-full transition-all duration-200'>{item.name}</a>
                        ))}
                    </div>

                    <a href='/auth/login' className=' relative w-[140px] h-[50px] flex items-center justify-center hover:scale-105 transition-all duration-200'
                    >
                        <p className=' relative z-20 text-amber-800 font-black text-lg'>Login</p>
                        <img src="/assets/header-button-bg.png" alt="button" width={200} className=' absolute' />
                    </a>
                </SheetContent>
                </Sheet>


                <a href='/auth/login' className=' relative w-[140px] h-[50px] hidden lg:flex items-center justify-center hover:scale-105 transition-all duration-200'

                >
                    <p className=' relative z-20 text-amber-800 font-black text-lg'>Login</p>
                    <img src="/assets/header-button-bg.png" alt="button" width={200} className=' absolute' />
                </a>
            </div>
       

        </nav>

        <div className=' relative w-full max-w-[1440px] h-full flex items-center justify-center'>
            <img src="/assets/logo.png" alt="" width={550} height={550} className=' md:-translate-y-28'/>
            <img src="/assets/Maskot.png" alt="" width={400} height={400} className=' hidden md:block absolute left-0 bottom-4 scale-x-[-1] -translate-x-16'/>

        </div>

    </section>
  )
}
