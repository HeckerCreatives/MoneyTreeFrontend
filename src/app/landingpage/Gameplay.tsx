'use client'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { faqs } from '../data'
  
  

export default function Gameplay() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
   
    React.useEffect(() => {
      if (!api) {
        return
      }
   
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
   
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }, [api])

    const handlePrev = () => {
        if (api) {
          const currentIndex = api.selectedScrollSnap(); // Get the latest active slide
          if (currentIndex > 0) {
            api.scrollTo(currentIndex - 1);
          }
        }
      };
      
      const handleNext = () => {
        if (api) {
          const currentIndex = api.selectedScrollSnap(); // Get the latest active slide
          if (currentIndex < count - 1) {
            api.scrollTo(currentIndex + 1);
          }
        }
      };
      

  return (
    <div className=' w-full max-w-[1440px] h-auto relative flex flex-col items-center justify-center py-12'
    >
        <img src="/assets/content-bg-1-short.png" alt="" className=' w-full' />
        <div className=' w-full flex flex-col items-center justify-center h-full'
        style={{backgroundImage: 'url(/assets/content-bg-2.png)', backgroundPosition:'top', backgroundRepeat:'repeat', backgroundSize:'contain'}}
        >
            <div className=' w-[85%] h-[90%] flex flex-col gap-12 md:gap-20 '>

                <div id='savingplan' className=' scroll-m-12 w-full flex flex-col items-center justify-center'>
                    <div className=' flex items-center justify-center relative mt-12'>
                    <img src="/assets/title-holder.png" alt="holder" width={300} height={200} />

                        <p className=' text-2xl font-black absolute text-amber-800'>Saving Plan</p>
                    </div>

                    <div className=' relative flex items-center justify-center  p-6 rounded-lg'>
                        <div className=' w-[60%] md:w-[90%] lg:w-full h-full flex flex-col'>
                            <Carousel className='' setApi={setApi}>
                            <CarouselContent className=''>
                               

                                <CarouselItem className='  basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5'>
                                    <div className=' w-full flex flex-col h-auto'
                                    >
                                        <div className=' w-full aspect-square flex items-center justify-center rounded-md'
                                        style={{backgroundImage: 'url(/assets/BG.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                                        >
                                            <img src="/assets/Nest.png" alt="nest" width={150} />

                                        </div>

                                        <div className=' flex flex-col gap-1 mt-2'>
                                            <h2 className=' text-xl font-bold text-amber-900'>Nest Stash</h2>
                                            <p className=' text-sm text-amber-700'>The Nest Stash plan is an excellent choice for those just starting out. It offers a simple way to begin saving with a fast return, making it ideal for anyone looking to grow their funds in a short time.
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>

                                <CarouselItem className='  basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5'>
                                    <div className=' w-full flex flex-col h-auto'
                                    >
                                        <div className=' w-full aspect-square flex items-center justify-center rounded-md'
                                        style={{backgroundImage: 'url(/assets/BG.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                                        >
                                            <img src="/assets/jar.png" alt="jar" width={150} />

                                        </div>

                                        <div className=' flex flex-col gap-1 mt-2'>
                                            <h2 className=' text-xl font-bold text-amber-900'>Wealth Jar</h2>
                                            <p className=' text-sm text-amber-700'>The Wealth Jar plan is designed for those looking to save for two weeks. It offers steady growth, allowing you to grow your savings at a reliable pace. Ideal for people who want a balance between time and return on their investment.
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>

                                <CarouselItem className='  basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5'>
                                    <div className=' w-full flex flex-col h-auto'
                                    >
                                        <div className=' w-full aspect-square flex items-center justify-center rounded-md'
                                        style={{backgroundImage: 'url(/assets/BG.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                                        >
                                            <img src="/assets/Piggy.png" alt="piggy bank" width={150} />

                                        </div>

                                        <div className=' flex flex-col gap-1 mt-2'>
                                            <h2 className=' text-xl font-bold text-amber-900'>Piggy Bank</h2>
                                            <p className=' text-sm text-amber-700'>The Piggy Bank plan is perfect for individuals who are ready to commit to saving over a longer period. With a one-month duration, it offers a higher return, making it ideal for those looking to grow larger sums of money while saving steadily over time.
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>

                                <CarouselItem className='  basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5'>
                                    <div className=' w-full flex flex-col h-auto'
                                    >
                                        <div className=' w-full aspect-square flex items-center justify-center rounded-md'
                                        style={{backgroundImage: 'url(/assets/BG.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                                        >
                                            <img src="/assets/Safe.png" alt="money vault" width={150}  className=' grayscale'/>

                                        </div>

                                        <div className=' flex flex-col gap-1 mt-2'>
                                            <h2 className=' text-xl font-bold text-amber-900'>Money Vault <span className=' text-xs'>(Coming Soon!)</span></h2>
                                            {/* <p className=' text-sm text-amber-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
                                        </div>
                                    </div>
                                </CarouselItem>

                                <CarouselItem className='  basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/5'>
                                    <div className=' w-full flex flex-col h-auto'
                                    >
                                        <div className=' w-full aspect-square flex items-center justify-center rounded-md'
                                        style={{backgroundImage: 'url(/assets/BG.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}
                                        >
                                            <img src="/assets/Treasure.png" alt="treasure chest" width={150} className=' grayscale'/>

                                        </div>

                                        <div className=' flex flex-col gap-1 mt-2'>
                                            <h2 className=' text-xl font-bold text-amber-900'>Treasure Chest <span className=' text-xs'>(Coming Soon!)</span></h2>
                                            {/* <p className=' text-sm text-amber-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
                                        </div>
                                    </div>
                                </CarouselItem>
                               
                            </CarouselContent>
                         
                            </Carousel>

                        

                            <div className=' w-full flex items-center justify-center mt-6'>
                                <button>
                                    <img onClick={handlePrev} src="/assets/slide-prev.png" alt="prev"  width={40} height={40} className=' cursor-pointer'/>
                                </button>

                                <button>
                                    <img onClick={handleNext} src="/assets/slide-next.png" alt="prev" width={40} height={40} className=' cursor-pointer' />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div id='play' className=' scroll-m-12 w-full h-auto bg-amber-900 rounded-sm flex flex-col items-center p-6'>
                    <p className=' text-2xl font-black text-amber-50'>How to play</p>

                    <div className=' w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] place-items-center gap-4 mt-8'>

                        <div className=' w-full flex flex-col gap-4  '>
                        <img src="/assets/play1.png" alt="" width={300} height={300} className=' w-full' />
                        <p className=' text-amber-50 ~text-xs/sm h-[80px]'>Press the collect button and tap the hand pump until the container is full.</p>
                        </div>

                        <div className=' w-full flex flex-col gap-4'>
                        <img src="/assets/play2.png" alt="" width={300} height={300} className=' w-full' />
                        <p className=' text-amber-50 ~text-xs/sm h-[80px]'> Once the water container is full, click the "USE" button to water the tree. Then, tap the "Harvest" button to collect the coins that appeared on the tree.
                        </p>

                        </div>

                        <div className=' w-full flex flex-col gap-4'>
                        <img src="/assets/play3.png" alt="" width={300} height={300} className=' w-full' />
                        <p className=' text-amber-50 ~text-xs/sm h-[80px]'> When the Daily Income bar is full, all the collected coins will be automatically transferred to the Saving Plan

                        </p>
                        </div>
                       

                    </div>

                </div>

                <div id='faq' className=' scroll-m-12 w-full flex flex-col items-center justify-center'>
                    

                    <p className=' text-4xl font-black text-amber-900'>FAQ's</p>
                    <Accordion type="single" collapsible className='max-w-[700px] w-full'>

                    {faqs.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className=''>
                            <AccordionTrigger className=' ~text-sm/xl font-bold text-amber-800 text-start' >{item.question}</AccordionTrigger>
                            <AccordionContent className=' ~text-xs/sm text-amber-700 whitespace-pre-wrap'>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                        </Accordion>

                    
                </div>
            </div>
        </div>

        {/* <img src="/assets/content-bg-2.png" alt="" className=' ' />
        <img src="/assets/content-bg-2.png" alt="" className=' md:hidden block ' />
        <img src="/assets/content-bg-2.png" alt="" className=' md:hidden block ' />
        <img src="/assets/content-bg-2.png" alt="" className='  md:hidden block' />
        <img src="/assets/content-bg-2.png" alt="" className='  lg:hidden md:block hidden' /> */}
        <img src="/assets/content-bg-3.png" alt="" className=' ' />

        

        
    </div>
  )
}
