import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'
import { Button } from '../ui/button'

type Props = {
    title: string
    link: string
    id: string
}
export default function DeleteSocials(prop: Props) {
    const { refresh, setRefresh } = refreshStore();
    const { loading, setLoading, clearLoading } = loadingStore();
    const router = useRouter();
    const [open, setOpen] = useState(false)
  
  
  const deleteSocials = async () => {
      setRefresh('true');
      setLoading(true);
      try {
          const request = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sociallinks/deletesociallink?id=${prop.id}`, {
              withCredentials: true,
              headers: {
                  'Content-Type': 'Application/json'
              }
          });
  
          const response = await toast.promise(request, {
              loading: `Deleting social media...`,
              success: `Deleted successfully. `,
              error: `Error while deleting social media.`,
          });
          if (response.data.message === 'success') {
              setRefresh('false');
              setLoading(false);
              setOpen(false)
          }
      } catch (error) {
          setRefresh('true');
          setLoading(false);
  
          if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message: string, data: string }>;
              if (axiosError.response && axiosError.response.status === 401) {
                  toast.error(`${axiosError.response.data.data}`);
                  router.push('/');
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
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className=' text-red-600'><Trash2 size={12}/></DialogTrigger>
                <DialogContent className=' bg-cream'>
                  <DialogHeader>
                    <DialogTitle>Delete {prop.title}</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete {prop.title} data.
                    </DialogDescription>
                  </DialogHeader>

                  <div className=' flex items-end justify-end w-full'>
                    <Button variant={'destructive'} disabled={loading} onClick={deleteSocials} className=' w-fit'>
                    {loading === true && (
                        <span className='loader'></span>
                    )}
                        Delete</Button>
                  </div>
                </DialogContent>
              </Dialog>
  )
}
