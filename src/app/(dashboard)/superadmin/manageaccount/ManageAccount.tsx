import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminTable from './AdminTable'
import PlayerTable from './UserTable'
import PlayerCount from './PlayerCount'


export default function ManageAccount() {
  return (
    <div className=' w-full flex flex-col'>

      <Tabs defaultValue="Admin" className=" w-full mt-8">
        <TabsList className=' bg-cream'>
            <TabsTrigger value="Admin">Admin</TabsTrigger>
            <TabsTrigger value="User">User</TabsTrigger>
        </TabsList>
        <TabsContent value="Admin" className=' w-full'>
            <AdminTable/>
        </TabsContent>
        <TabsContent value="User">
          <PlayerCount/>
          <PlayerTable/>
        </TabsContent>
        </Tabs>



    </div>
  )
}
