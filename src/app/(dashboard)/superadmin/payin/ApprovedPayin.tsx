import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import loadingtableStore from '@/store/tableloading'
import refreshStore from '@/store/refresh'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface List {
    id: string
    username: string
    userid: string
    firstname: string
    lastname: string
    value: string
    status:  string
    createdAt: string
    processby: string

}


type Props = {
    data: List
}
export default function ApprovedPayin({data}: Props) {
    const [open, setOpen] = useState(false)
    const {loading, setLoading, clearLoading} = loadingtableStore()
    const { refresh, setRefresh} = refreshStore()
    const router = useRouter()

    const [status, setStatus] = useState('')

    const processPayout = async (id: string) => {
    setLoading(true);
    setRefresh('true')
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/processpayout`,
        {
          payoutid: data.id,
          status: status
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Payout sucessfully processed.');
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger  className='text-[.6rem] primary-green text-white px-2 py-1 rounded-sm font-medium flex items-center gap-1 justify-center'><Check size={12}/>Approved</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Process Payin</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. Process payin form <span className=' text-amber-800'>{data.username}</span>  amount of <span className=' text-amber-800'>{data.value.toLocaleString()} php</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className=' w-full flex flex-col gap-4'>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="done">Approved</SelectItem>
                              <SelectItem value="reject">Reject</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className=' w-full flex flex-col gap-1'>
                            <Button onClick={() => processPayout(data.id)} disabled={loading} className=' mt-4'>
                              {loading === true && (
                                <span className='loader'></span>
                              )}
                              Continue</Button>


                            
                          </div>


                          </div>
                        </DialogContent>
                      </Dialog>
  )
}
