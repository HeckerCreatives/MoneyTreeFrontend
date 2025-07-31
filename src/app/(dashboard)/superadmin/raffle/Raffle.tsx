"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Trophy, Users, RotateCcw, Clock12, ChevronsUpDown, Check, Award } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { addRaffleEntry, AddRaffleEntry } from "@/validitions/validation"
import { cn } from "@/lib/utils"
import axios, { AxiosError } from "axios"
import loadingStore from "@/store/loading"
import refreshStore from "@/store/refresh"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Pagination from "@/components/common/Pagination"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import DeleteEntry from "./DeleteEntry"
import WinnerHsitory from "./HistoryWinners"



interface Participant {
  id: string
  name: string
}

interface HistoryEntry {
  id: string
  date: string
  username: string
  raffleNumber: number
}


interface UserSerach {
    id: string
    username: string
    referralUsername: string
    status:string
    createdAt: string
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface UserResponse {
  message: string;
  data: User[];
  pagination: Pagination;
}



export default function RaffleSection() {
    const { loading, setLoading, clearLoading } = loadingStore();
    const { refresh, setRefresh} = refreshStore()
    const router = useRouter()
    const [totalpage, setTotalPage] = useState(0)
    const [currentpage, setCurrentPage] = useState(0)
    
  const [open, setOpen] = useState(false)
    const [user, setUser] = useState("")
  const [username, setUsername] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentWinner, setCurrentWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [raffleCount, setRaffleCount] = useState(1)
    const [users, setUsers] = useState<UserSerach[]>([])
    const [entry, setEntry] = useState<User[]>([])
  

   const {
      register,
      handleSubmit,
      control,
      watch,
      reset,
      setValue,
      formState: { errors },
    } = useForm<AddRaffleEntry>({
      resolver: zodResolver(addRaffleEntry),
    });

 const selectedUsername = watch("username");

 
    useEffect(() => {
    const getList = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/searchplayerlist?playerusername=${user}&limit=99999`,
          { withCredentials: true }
        )
        setUsers(res.data.data.userlist)
      } catch (err) {
        console.error("Fetch failed", err)
      }
    }

    if (user.trim() === "") {
      getList()
      return
    }

    const delayDebounce = setTimeout(() => {
      if (user.trim().length > 0) {
        getList()
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [user])


 useEffect(() => {
     const getList = async () => {
       try {
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffle/getselectedplayers?page=${currentpage}&limit=10`,{
         withCredentials:true
         })

         setEntry(response.data.data)
         setTotalPage(response.data.pagination.totalPages)

         
       } catch (error) {
 
         if (axios.isAxiosError(error)) {
           const axiosError = error as AxiosError<{ message: string, data: string }>;
           if (axiosError.response && axiosError.response.status === 401) {
              
             }    
           } 
       }
     }
     getList()
 },[refresh, currentpage])

 useEffect(() => {
      const getList = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raffle/getrafflewinners`,{
          withCredentials:true
          })
 
          setCurrentWinner(response.data.lastwinner.owner)
          
        } catch (error) {
  
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string, data: string }>;
            if (axiosError.response && axiosError.response.status === 401) {
               
              }    
            } 
        }
      }
      getList()
  },[refresh])

  console.log(entry)





  const addUserEntry = async (data: AddRaffleEntry) => {
     setLoading(true);
     setRefresh('true')
         try {
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_URL}/raffle/addselectedplayer`,
         {
           playerid: data.username,
         },
         {
           withCredentials: true,
           headers: {
             'Content-Type': 'application/json',
           },
         }
       );
 
       toast.success('User raffle entry added successfully!');
       reset()
       clearLoading();
       setRefresh('false')
 
     } catch (error) {
       setLoading(false);
       setRefresh('false')
 
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

   const resetUserEntry = async () => {
     setLoading(true);
     setRefresh('true')
         try {
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_URL}/raffle/resetselectedplayers`,{},
         
         {
           withCredentials: true,
           headers: {
             'Content-Type': 'application/json',
           },
         }
       );
 
       toast.success('User raffle entry reset successfully!');
       reset()
       clearLoading();
       setRefresh('false')
       setEntry([])
 
     } catch (error) {
       setLoading(false);
       setRefresh('false')
 
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


     const pickWinnerEntry = async () => {
     setLoading(true);
     setRefresh('true')
         try {
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_API_URL}/raffle/selectwinner`,{},
         
         {
           withCredentials: true,
           headers: {
             'Content-Type': 'application/json',
           },
         }
       );
 
       toast.success(response.data.message);
       reset()
       clearLoading();
       setRefresh('false')
       setEntry([])
 
     } catch (error) {
       setLoading(false);
       setRefresh('false')
 
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

  



  const pickWinner = () => {
    if (participants.length === 0) return

    const randomIndex = Math.floor(Math.random() * participants.length)
    const winner = participants[randomIndex]
    setCurrentWinner(winner.name)
  }

  const resetRaffle = () => {
    if (currentWinner) {
      const newHistoryEntry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        username: currentWinner,
        raffleNumber: raffleCount,
      }
      setHistory([newHistoryEntry, ...history])
      setRaffleCount(raffleCount + 1)
    }

    setParticipants([])
    setCurrentWinner(null)
  }



  const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 py-6">
      <Card className=" border-none">
        <CardHeader>
          <CardTitle className=" text-lg flex items-center gap-2">
            <Clock12 className="w-5 h-5" />
            Raffle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 border-none">

            <p className=" flex items-center gap-2 font-semibold text-lg md:text-2xl"><Award size={30} />Winner : <span className=" text-orange-400">{currentWinner ? currentWinner : ' No winner yet!'}</span> </p>
          <form onSubmit={handleSubmit(addUserEntry)} className="flex flex-wrap gap-4 items-end">
            <Controller
              name="username"
              control={control}
              render={({ field }) => {
                const selectedUser = users.find((item) => item.id === field.value)

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full max-w-[300px] justify-between bg-gray-100"
                      >
                        {selectedUser ? selectedUser.username : "Select username..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          value={user}
                          onValueChange={setUser}
                          placeholder="Search user..."
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.username} // ✅ use username for filtering
                                onSelect={() => {
                                  field.onChange(item.id) // ✅ store id in form
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === item.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {item.username}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              }}
            />



                        <Button type="submit" disabled={loading}>
                             {loading ? 'Loading...' : 'Add'}
                        </Button>

                        
                       

                        <Button
                        onClick={pickWinnerEntry}
                        disabled={entry.length === 0}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                        >
                        <Trophy className="w-4 h-4"  />
                       {loading ? 'Loading...' : 'Pick Winner'}
                        </Button>
                        <Button onClick={resetUserEntry} disabled={loading} variant="outline" className="flex items-center gap-2 bg-transparent">
                        <RotateCcw className="w-4 h-4" />
                            {loading ? 'Loading...' : 'Reset'}
                        </Button>
          </form>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Participants</h3>
            </div>

           
             <Table>
              {entry.length === 0 && (
                <TableCaption>
                  <div className="text-center py-8 text-gray-500 text-sm">No participants added yet</div>
                </TableCaption>

              )}
                <TableHeader>
                    <TableRow className="bg-gray-100 py-2">
                    <TableHead colSpan={2} className="text-left py-2">Name</TableHead>
                    <TableHead className="text-right py-2">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entry.map((participant, index) => (
                    <TableRow key={index}>
                        <TableCell colSpan={2}>{participant.username}</TableCell>
                        <TableCell className=" flex items-end justify-end">
                            <DeleteEntry username={participant.username} id={participant.id}/>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>




             {entry.length !== 0 && (
                            <div className=' w-full flex items-center justify-center mt-6'>
                                <Pagination currentPage={currentpage} total={totalpage} onPageChange={handlePageChange}/>
                            </div>
                        )}
          </div>
        </CardContent>
      </Card>

     <WinnerHsitory/>
    </div>
  )
}
