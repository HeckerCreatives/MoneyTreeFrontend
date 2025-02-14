import React from 'react'
import Header from './Header'
import Gameplay from './Gameplay'
import Footer from './Footer'

export default function Landingpage() {
  return (
   <div className=' w-full h-full flex flex-col items-center justify-center overflow-x-hidden'
   style={{backgroundImage: 'url(/assets/content-bg.jpg)', backgroundSize:'cover'}}
   
   >
    <Header/>
    
    <Gameplay/>
    <Footer/>
   </div>
  )
}
