import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlayerTable from './UserTable'
import PlayerCount from './PlayerCount'


export default function ManageAccount() {
  return (
    <div className=' w-full flex flex-col py-8'>
          <PlayerCount/>
          <PlayerTable/>
    </div>
  )
}
