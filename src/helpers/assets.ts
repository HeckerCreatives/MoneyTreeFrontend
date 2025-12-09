 export const bgTreeImage = (name: string) => {
           
            if(name === 'Avocado'){
                return '/tree/Avocado/Stage4.png'
            }else if(name === 'Durian'){
                return '/tree/Durian/Stage4.png'
            }else if(name === 'Lanzones'){
                return '/tree/Lanzones/Stage4.png'
            } else if(name === 'Mango'){
                return '/tree/Mango/Stage4.png'
            }else if(name === 'Mangosteen'){
                return '/tree/Mangosteen/Stage4.png'
            } else if(name === 'Marang'){
                return '/tree/Marang/Stage4.png'
            }else if(name === 'Moneytree'){
                return '/tree/Moneytree/Stage4.png'
            }else if(name === 'Pineapple'){
                return '/tree/Pineapple/Stage4.png'
            }else if(name === 'Pomello'){
                return '/tree/Pomelo/Stage4.png'
            }else if(name === 'Rambutan'){
                return '/tree/Rambutan/Stage4.png'
            }
        
    }


     export const bgTreeOwnImage = (name: string, tier: number) => {
           
            if(name === 'Avocado'){
                return `/tree/Avocado/Stage${tier}.png`
            }else if(name === 'Durian'){
                return `/tree/Durian/Stage${tier}.png`
            }else if(name === 'Lanzones'){
                return `/tree/Lanzones/Stage${tier}.png`
            } else if(name === 'Mango'){
                return `/tree/Mango/Stage${tier}.png`
            }else if(name === 'Mangosteen'){
                return `/tree/Mangosteen/Stage${tier}.png`
            } else if(name === 'Marang'){
                return `/tree/Marang/Stage${tier}.png`
            }else if(name === 'Moneytree'){
                return `/tree/Moneytree/Stage${tier}.png`
            }else if(name === 'Pineapple'){
                return `/tree/Pineapple/Stage${tier}.png`
            }else if(name === 'Pomello'){
                return `/tree/Pomelo/Stage${tier}.png`
            }else if(name === 'Rambutan'){
                return `/tree/Rambutan/Stage${tier}.png`
            }
        
    }

export const findBadge = (data: string) => {
    if(data.includes('1')){
         return '/badge/1.png'
    }else  if(data.includes('2')){
         return '/badge/2.png'
    }else  if(data.includes('3')){
         return '/badge/3.png'
    }else  if(data.includes('4')){
         return '/badge/4.png'
    }else  if(data.includes('5')){
         return '/badge/5.png'
    }else  if(data.includes('6')){
         return '/badge/6.png'
    }
}