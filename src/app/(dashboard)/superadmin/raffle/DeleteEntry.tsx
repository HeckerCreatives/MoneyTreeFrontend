'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import refreshStore from '@/store/refresh';
import loadingStore from '@/store/loading';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FaS } from 'react-icons/fa6'

interface Props{
    username: string,
    id: string
}
export default function DeleteEntry({username, id}: Props) {
    const { loading, setLoading, clearLoading } = loadingStore();
    const { refresh, setRefresh} = refreshStore()
    const router = useRouter()
      const [open, setOpen] = useState(false)
    
        

          const deleteUserEntry = async () => {
             setLoading(true);
             setRefresh('true')
                 try {
               const response = await axios.post(
                 `${process.env.NEXT_PUBLIC_API_URL}/raffle/deleteselectedplayer`,
                 {
                   playerid: id,
                 },
                 {
                   withCredentials: true,
                   headers: {
                     'Content-Type': 'application/json',
                   },
                 }
               );
         
               toast.success('User raffle entry deleted successfully!');
               clearLoading();
               setRefresh('false')
               setOpen(false)
         
             } catch (error) {
               setLoading(false);
               setRefresh('false')
               setOpen(false)

         
               if (axios.isAxiosError(error)) {
                 const axiosError = error as AxiosError<{ message: string; data: string }>;
                 if (axiosError.response && axiosError.response.status === 401) {
                   toast.error(`${axiosError.response.data.data}`);
                   router.push('/')
                 }
         
                 if (axiosError.response && axiosError.response.status === 400) {
                   toast.error(`${axiosError.response.data.data}`);
                 }
         
                 if (axiosError.response && axiosError.response.status === 402) {
                   toast.error(`${axiosError.response.data.data}`);
                 }
         
                 if (axiosError.response && axiosError.response.status === 403) {
                   toast.error(`${axiosError.response.data.data}`);
                 }
         
                 if (axiosError.response && axiosError.response.status === 404) {
                   toast.error(`${axiosError.response.data.data}`);
                 }
               }
             }
            
          }
  return (
          <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger>
                                       <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                            </Button>
    
                                </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Delete Raffle Entry</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete <strong>{username}</strong>'s entry? This action cannot be undone.
                                </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={() => deleteUserEntry()} disabled={loading}>
                                    {loading ? "Deleting..." : "Delete"}
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                            </Dialog>
  )
}
