'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { complanSchema, complanTreeSchema, SaveComplan, SaveTreeComplan } from '@/validitions/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Switch } from '../ui/switch'
import { banks, petimg } from '@/app/data'
import loadingStore from '@/store/loading'
import refreshStore from '@/store/refresh'
import { Button } from '../ui/button'
import { Check, Plus, SquarePen } from 'lucide-react'
import { ComplanTree } from '@/app/(dashboard)/superadmin/complan/Complan'

type Props = {
    prop: ComplanTree
}


export default function Complantreecard( {prop} :Props) {
    const { loading, setLoading, clearLoading } = loadingStore()
    const router = useRouter()
    const {refresh, setRefresh} = refreshStore()
    const [editBenefit, setEditBenefit] = useState(false)
    const [editDesc, setEditDesc] = useState(false)
    const [editName, setEditName] = useState(false)
    

    // Form handler
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        trigger,
        control,
        formState: { errors },
    } = useForm<SaveTreeComplan>({
        resolver: zodResolver(complanTreeSchema),
        defaultValues: ({
             duration: prop.duration,
             profit: prop.profit * 100,
             price: prop.price,
             isActive: prop.isActive,
             limit: prop.limit,
             stocks: prop.stocks,
             description: prop.description,
             name: prop.name,
             benefits: prop.healthBenefits.map((item) => ({ benefit: item })),
             sname: prop.scientificName
        })
    });

   



   



     useEffect(() => {
         reset({
           duration: prop.duration,
             profit: prop.profit * 100,
             price: prop.price,
             isActive: prop.isActive,
             limit: prop.limit,
             stocks: prop.stocks,
             description: prop.description,
             name: prop.name,
             benefits: prop.healthBenefits.map((item) => ({ benefit: item })),
             sname: prop.scientificName
         });
       }, [prop, reset]);

    const onsubmit = async (data: SaveTreeComplan) => {
        setRefresh('true');
        setLoading(true);
        const benefitsPayload = data.benefits.map((item) => item.benefit)
        try {
            const request = axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tbank/edittbank`, {
                isActive: data.isActive,
                tbankid: prop.id,
                profit: data.profit / 100 ,
                duration: data.duration ,
                price: data.price,
                stocks: data.stocks,
                limit: data.limit,
                description: data.description,
                healthBenefits: benefitsPayload,
                name: data.name,
                scientificName: data.sname
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'Application/json'
                }
            });

            const response = await toast.promise(request, {
                loading: `Updating complan for ${prop.name}...`,
                success: `Complan updated successfully. `,
                error: `Error while updating complan for ${prop.name}.`,
            });
            if (response.data.message === 'success') {
                setRefresh('false');
                reset();
                setLoading(false);
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

    const img = banks.find((item) => item.id === prop.name)

     const bgImage = () => {
           
            
            if(prop.name === 'Avocado'){
                return '/tree/Avocado/Stage4.png'
            }else if(prop.name === 'Durian'){
                return '/tree/Durian/Stage4.png'
            }else if(prop.name === 'Lanzones'){
                return '/tree/Lanzones/Stage4.png'
            } else if(prop.name === 'Mango'){
                return '/tree/Mango/Stage4.png'
            }else if(prop.name === 'Mangosteen'){
                return '/tree/Mangosteen/Stage4.png'
            } else if(prop.name === 'Marang'){
                return '/tree/Marang/Stage4.png'
            }else if(prop.name === 'Moneytree'){
                return '/tree/Moneytree/Stage4.png'
            }else if(prop.name === 'Pineapple'){
                return '/tree/Pineapple/Stage4.png'
            }else if(prop.name === 'Pomello'){
                return '/tree/Pomelo/Stage4.png'
            }else if(prop.name === 'Rambutan'){
                return '/tree/Rambutan/Stage4.png'
            }
            
        
    }


    const { fields: benefitsFields, append: appendValue, remove: removeValue } =
    useFieldArray<SaveTreeComplan>({
        control,
        name: 'benefits',
    })


    const wDescription = watch('description')
    const wBenefits = watch('benefits')
    const wName = watch('name')
    const wSName = watch('sname')





     


  



  return (
    <div className={` group w-full h-auto bg-cream rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 `}>

                   

                        <div className=' relative transition-all duration-300 w-full h-[24rem] md:h-full overflow-hidden  shadow-sm flex items-center justify-center'
                         style={{backgroundImage: `url(${bgImage()})`, backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'top'}}
                        
                        >
                            {/* <img src={bgImage()} alt="tree"  className=' object-cover'/> */}

                        </div>

                       <form onSubmit={handleSubmit(onsubmit)} action="" className=' p-4 w-full'>
                        
                        <div className=' w-full flex justify-between'>
                            <p className=' text-sm font-medium'>Available on Store</p>
                            <Switch 
                            checked={watch("isActive")} 
                            onCheckedChange={(value) => setValue("isActive", value)} 
    />
                        </div>
                         {editName ? (
                            <>
                            <div className=' flex flex-col gap-2 w-full mt-2'>
                                <div className=' flex gap-2 items-center w-full justify-between'>
                                    {/* <p className=' text-lg font-black'>{prop.name}</p> */}
                                    <Input placeholder='Name' {...register('name')}/>
                                    <Input placeholder='Scientific name' {...register('sname')}/>
                                     <button
                                        type="button"
                                        onClick={() => setEditName(!editName)}
                                        className=' bg-green-500 text-white p-2 rounded-sm'
                                        >
                                        <Check size={15}/>
                                        </button>
                                </div>

                            </div>
                            </>
                        ):(
                            <>
                            <div className=' flex gap-2 items-center w-full mt-2'>
                                <div className=' flex flex-wrap gap-2'>
                                    <p className=' text-lg font-black'>{wName}</p>
                                    <p className=' text-lg font-black'>({wSName})</p>
                                </div>
                                
                                <button type='button' onClick={() => setEditName(!editDesc)}><SquarePen size={15}/></button>
                            </div>
                            </>
                        )}
                        {errors.name && <p className='text-[.6em] text-red-500'>{errors.name.message}</p>}
                        {errors.sname && <p className='text-[.6em] text-red-500'>{errors.sname.message}</p>}

                        {editDesc ? (
                            <>
                            <div className=' flex flex-col gap-2 w-full mt-2'>
                                <div className=' flex gap-2 items-center w-full justify-between'>
                                    <p className=' text-sm font-bold mt-2'>Description</p>
                                     <button
                                        type="button"
                                        onClick={() => setEditDesc(!editDesc)}
                                        className=' bg-green-500 text-white p-2 rounded-sm'
                                        >
                                        <Check size={15}/>
                                        </button>
                                </div>

                                <textarea placeholder='Description' className=' text-xs p-2 rounded-md' {...register('description')}/>
                            </div>
                            </>
                        ):(
                            <>
                            <div className=' flex gap-2 items-center w-full mt-2'>
                                <p className=' text-sm font-bold mt-2'>Description</p>
                                <button type='button' onClick={() => setEditDesc(!editDesc)}><SquarePen size={15}/></button>
                            </div>
                            <p className=' text-xs whitespace-pre-wrap'>{wDescription}</p>
                            </>
                        )}
                        {errors.description && <p className='text-[.6em] text-red-500'>{errors.description.message}</p>}

                         

                        {editBenefit ? (
                            <>
                            <div className="p-4 border rounded-lg space-y-3 mt-2">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Benefits</p>

                                    <div className=' flex items-center gap-2'>
                                        <button
                                        type="button"
                                        onClick={() => setEditBenefit(!editBenefit)}
                                        className=' bg-green-500 text-white p-2 rounded-sm'
                                        >
                                        <Check size={15}/>
                                        </button>
                                        <button
                                        type="button"
                                        onClick={() => appendValue({ benefit: "" })}
                                        className=' bg-blue-500 text-white p-2 rounded-sm'
                                        >
                                        <Plus size={15}/>
                                        </button>
                                    </div>
                                    
                                </div>

                                <div className=' flex flex-col gap-1 max-h-[12rem] overflow-y-auto p-2'>
                                    {benefitsFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center">
                                        <Input
                                        placeholder='Enter a benefit'
                                            type="text"
                                            {...register(`benefits.${index}.benefit` as const)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeValue(index)}
                                            className=' bg-red-500 p-2 rounded-md text-white h-fit'
                                        >
                                            ✕
                                        </button>
                                        </div>
                                    ))}
                                </div>
                              
                                
                            </div>
                            </>
                        ):(
                            <>
                            <div className=' flex gap-2 items-center mt-2'>
                                <p className=' text-sm font-bold mt-2'>Health Benefits</p>
                                <button type='button' onClick={() => setEditBenefit(!editBenefit)}><SquarePen size={15}/></button>
                            </div>

                            <div className=' flex flex-col gap-1'>
                                {wBenefits.map((item, index) => (
                                    <p key={index} className=' text-xs'>{index + 1}. {item.benefit}</p>
                                ))}

                            </div>
                            </>
                        )}

                        {errors.benefits && Array.isArray(errors.benefits) && (
                        <ul className="text-xs text-red-500 space-y-1">
                            {errors.benefits.map((err, index) => (
                            err?.benefit?.message && (
                                <li key={index}>{index}.{err.benefit.message}</li>
                            )
                            ))}
                        </ul>
                        )}


                        

                        

      

                        <p className=' text-sm font-bold mt-2'>Complan</p>

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Revenue (%)</label>
                        <Input type='number' min={0} className=' text-xs' {...register('profit', {valueAsNumber: true})}/>
                        {errors.profit && <p className='text-[.6em] text-red-500'>{errors.profit.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Maturi-Tree (Days)</label>
                        <Input  type='number' className=' text-xs' {...register('duration', {valueAsNumber: true})}/>
                        {errors.duration && <p className='text-[.6em] text-red-500'>{errors.duration.message}</p>}


                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2'>Unit Price (php)</label>
                        <Input  type='number' className=' text-xs' {...register('price', {valueAsNumber: true})}/>
                        {errors.price && <p className='text-[.6em] text-red-500'>{errors.price.message}</p>}

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Seedlings</label>
                        <Input  type='number' className=' text-xs' {...register('stocks', {valueAsNumber: true})}/>
                        {errors.stocks && <p className='text-[.6em] text-red-500'>{errors.stocks.message}</p>}

                        <label htmlFor="" className=' text-xs text-zinc-500 mt-2' >Leverage</label>
                        <Input  type='number' className=' text-xs' {...register('limit', {valueAsNumber: true})}/>
                        {errors.limit && <p className='text-[.6em] text-red-500'>{errors.limit.message}</p>}

                        <p className=' text-sm text-black mt-4'>Seedlings sold: {prop.timesBought.toLocaleString()}</p>

                        <Button disabled={loading}  className={`w-full mt-4`}>

                           Save
                        </Button>
                       </form>

    </div>
  )
}
