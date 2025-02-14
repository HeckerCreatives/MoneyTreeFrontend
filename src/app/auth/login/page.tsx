import { LoginForm } from '@/components/forms/Login'
import React from 'react'

export default function page() {
  return (
    <div className=' relative w-full h-screen bg-amber-50 flex items-center justify-center p-4 overflow-x-hidden'
    style={{backgroundImage: 'url(/assets/Background.png)', backgroundPosition:'bottom', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
    >
        <LoginForm/>

        <img src="/assets/Maskot.png" alt="" width={400} height={400} className=' hidden md:block absolute -translate-x-[600px] bottom-4 scale-x-[-1]'/>

    </div>
  )
}
