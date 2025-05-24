import Playerlayout from '@/components/layout/Playerlayout'
import React from 'react'
import ClaimHistory from './Claimhistory'
import Mybanks from './Mybanks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DailyClaimHistory from './GameDailyclaimHistory'



export default function page() {
  return (
    <Playerlayout>
       <Mybanks/>
       {/* <ClaimHistory/> */}
       <Tabs defaultValue="Claim" className="w-full mt-8">
               <TabsList className=' bg-cream'>
                   <TabsTrigger value="Claim">Earnings History</TabsTrigger>
                   <TabsTrigger value="Daily">Game History</TabsTrigger>
               </TabsList>
               <TabsContent value="Claim">
                   <ClaimHistory/>
               </TabsContent>
               <TabsContent value="Daily">
                   <DailyClaimHistory/>
               </TabsContent>
               </Tabs>
    </Playerlayout>
  )
}
