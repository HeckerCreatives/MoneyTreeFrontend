import { banks } from '@/app/data'
import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { bgTreeImage } from '@/helpers/assets'

type ComplanTree = {
  duration: number
  id: string
  isActive: boolean
  limit: number
  price: number
  profit: number
  stocks: number
  type: string
  timesBought: number

  name: string,
  scientificName: string,
  description: string,
  healthBenefits: string[]
  isPurchased: boolean,
  purchasedCount: number,
}

type Props = {
    _id: string,
    name: string
    sname: string
    description: string
    benefits: string[]
    type: string
    duration: number,
    profit: number,
    isActive: boolean
    limit: number,
    stocks: number,
    price: number,
    owned: number
}

export default function BanksTreeStore(prop: Props) {
    const [val, setVal] = useState(0);
    const [dialog, setDialog] = useState(false)
    const [isOpen, setIsopen] = useState('')
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [drawer, setDrawer] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const buyBank = async () => {
        setDialog(false)
        setLoading(true)
        setRefresh('true')
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tinventory/buytbank`,{
              tbankid: prop._id,
              quantity: quantity
            },{
                withCredentials: true,
                headers:{
                    'Content-Type':'Application/json'
                }
            })

            const response = await toast.promise(request, {
                loading: `Purchasing ${prop.name}...`,
                success: `You succesfully purchased ${prop.name}`,
                error: `Error while purchasing ${prop.name}`,
            });
            if(response.data.message === 'success'){
                setLoading(false)
                router.push('?state=false')
                setRefresh('false')
                setDrawer(false)
                setIsLoading(false)



            }

        } catch (error) {
            setLoading(false)
            setRefresh('false')

             if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message: string, data: string }>;
                    if (axiosError.response && axiosError.response.status === 401) {
                        toast.error(`${axiosError.response.data.data}`)
                        router.push('/')

                    }

                    if (axiosError.response && axiosError.response.status === 400) {
                        toast.error(`${axiosError.response.data.data}`)

                    }

                    if (axiosError.response && axiosError.response.status === 402) {
                        toast.error(`${axiosError.response.data.data}`)

                    }

                    if (axiosError.response && axiosError.response.status === 403) {
                        toast.error(`${axiosError.response.data.data}`)

                    }

                    if (axiosError.response && axiosError.response.status === 404) {
                        toast.error(`${axiosError.response.data.data}`)
                    }
            }


        }
    }
  

    const findBank = banks.find((item) => item.id === prop.name)

     const bgImage = () => {
            if(prop.name === 'Mango'){
                return '/tree/mango_4.jpg'
            }else if(prop.name === 'Avocado'){
                return '/tree/avocado_4.jpg'
            } else if(prop.name === 'Moneytree'){
                return '/tree/apple_4.jpg'
            } else if(prop.name === 'Lanzones'){
                return '/tree/lanzones_4.jpg'
            } else {
                return '/tree/rambutan_4.jpg'
            }
    }

  return (
    <div  className={`relative w-fit h-auto flex items-center justify-center rounded-md overflow-hidden`}
    style={{backgroundImage: `url('/assets/BG.png')`, backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}
    >
         <div className=' w-full h-full absolute bg-zinc-950/30'>

        </div>
        <div className=' relative z-10 w-full flex gap-4 items-center justify-center h-full '>
            <div className='  w-full max-h-[16rem] '
            //  style={{backgroundImage: `url(${bgTreeImage(prop.name)})`, backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'top'}}
            >
                <img src={bgTreeImage(prop.name)} alt="bank" width={100} height={100} className=' w-full h-full ' />
            </div>

            <div className=' w-full flex flex-col text-amber-50 text-xs font-bold p-3'>
                <h2 className=' text-lg font-black'>{prop.name}</h2>

                
             
                <p>Revenue: {prop.profit * 100} %</p>
                <p>Maturi-Tree: {prop.duration} days</p>
                <p>Unit Price: {prop.price.toLocaleString()} php</p>
                   



                <Drawer open={drawer} onOpenChange={setDrawer}>
                <DrawerTrigger className='bg-[#A8DC08] px-3 py-2 text-sm font-bold text-amber-950 rounded-sm mt-6'>
                    Buy now
                </DrawerTrigger>
                <DrawerContent className=' flex flex-col items-center justify-center md:h-fit h-screen bg-cream border-amber-100 '>
                    <DrawerHeader>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                    </DrawerHeader>

                    <div className=' w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 h-screen md:h-auto bg-amber-50 rounded-sm overflow-auto'>
                        <div className=' w-full hidden md:flex items-center justify-center overflow-hidden '>
                            <img src={bgTreeImage(prop.name)} alt="bank" width={100} height={100} className=' w-full object-cover object-center  h-[16rem] md:h-full' />
                        </div>

                        <div className=' w-full flex flex-col justify-center text-amber-950 p-4 md:p-6'>
                            {/* <h2 className=' text-lg font-black'>{prop.name}</h2> */}

                            <div className=' flex gap-2 items-center w-full'>
                                <div className=' flex items-center flex-wrap gap-2'>
                                    <img src={bgTreeImage(prop.name)} alt="bank" width={100} height={100} className=' block md:hidden w-[4rem] h-[4rem] rounded-full' />
                                    <p className=' text-lg font-black'>{prop.name}</p>
                                    <p className=' text-sm'>({prop.sname})</p>
                                </div>
                            </div>

                             <div className=' flex gap-2 items-center w-full'>
                                   <p className=' text-sm font-bold mt-2'>Description</p>
                               </div>
                               <p className=' text-xs whitespace-pre-wrap'>{prop.description}</p>

                               
                             <div className=' flex gap-2 items-center w-full'>
                                   <p className=' text-sm font-bold mt-2'>Health Benefits</p>
                               </div>
                              <div className=' flex flex-col gap-1 mb-6'>
                                {prop.benefits.map((item, index) => (
                                    <p key={index} className=' text-xs'>{index + 1}. {item}</p>
                                ))}

                            </div>


                            <p>Revenue: {prop.profit * 100} %</p>
                            <p>Lead Time: {prop.duration} days</p>
                            <p>Unit Price: {prop.price.toLocaleString()} php</p>

                            {/* <div className=' flex items-end w-full gap-1'>
                                 <div className=' flex flex-col gap-1 w-full'>
                                    <label htmlFor="" className=' text-xs'>Enter amount</label>
                                    <Input type='number' min={500} value={val} onChange={(e) => setVal(e.target.valueAsNumber)} placeholder='Amount'/>
                                </div>
                                <button onClick={() => setVal(val + 1)} className=' bg-blue-600 text-white h-10 px-3 rounded-md text-lg font-bold'>+</button>
                                <button disabled={val === 0} onClick={() => setVal(val - 1)} className=' bg-red-600 text-white h-10 px-3 rounded-md text-lg font-bold'>-</button>
                            </div> */}

                            <div className='flex flex-col gap-1 mt-2'>
                                <label htmlFor="" className=' text-sm'>Quantity</label>
                                <Input type='number' value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} placeholder='Quantity'/>
                            </div>

                            <div className=' flex items-center gap-2 mt-4'>
                                <p className=' px-3 py-1 bg-red-600 rounded-full text-xs text-white'>Seedlings: {prop.stocks} </p>
                                <p className=' px-3 py-1 bg-blue-600 rounded-full text-xs text-white'>Leverage: {prop.owned} </p>

                            </div>

                            <p className=' text-sm mt-2'>Total Amount: Php {(prop.price * quantity).toLocaleString()}</p>

                           

                            <div className=' w-full flex items-center gap-4 mt-6'>
                            <Button disabled={loading}  onClick={buyBank} className=' w-full '>
                                {loading && (
                                    <span className='loader'></span>
                                )}
                                Buy</Button>
                            <DrawerClose className=' w-full'>
                            <Button variant="outline" className=' w-full '>Cancel</Button>
                            </DrawerClose>
                            </div>

                            {/* {prop.stocks === 0 ? (
                                <p className=' text-xs text-red-600 mt-4'>No stocks left.</p>
                            ) : (
                                <p className=' mt-4 '>Stocks Left: {prop.stocks}</p>
                            )} */}



                        </div>
                    </div>

                </DrawerContent>
                </Drawer>

                {prop.stocks === 0 ? (
                    <p className=' text-xs text-red-600 mt-4'>No stocks left.</p>
                ) : (
                    <p className=' mt-4 text-blue-700'>Stocks Left: {prop.stocks}</p>
                )}

            </div>
        </div>
    </div>
  )
}
