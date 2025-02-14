import { Activity, Banknote, BarChart, Cable, ChartColumnBig, ChartPie, Cog, CreditCard, Folder, Grid2X2, Info, PawPrint, Play, Settings, ShoppingBag, Users, Wallet, Wrench } from "lucide-react";
import { FaBox } from "react-icons/fa6";


export const user = [
    {name: 'Dashboard', icon: <Grid2X2 size={20}/>, 
    path:'/user/dashboard', subpath:[]},

    {name: 'Sponsor', icon: <Cable size={20}/>, 
    path:'/user/sponsor', subpath:[]},

    {name: 'Withdraw', icon: <CreditCard size={20}/>, 
    path:'/user/withdraw', subpath:[]},

    {name: 'Store', icon: <ShoppingBag size={20}/>, 
    path:'/user/store', subpath:[]},

    {name: 'My Banks', icon: <FaBox size={20}/>, 
    path:'/user/mybanks', subpath:[]},

    {name: 'Faq', icon: <Info size={20}/>, 
    path:'/user/faq', subpath:[]},
    {name: 'Video', icon: <Play size={20}/>, 
    path:'/user/video', subpath:[]},

    {name: 'Account', icon: <Settings size={20}/>, 
    path:'/user/account', subpath:[]},
    
]

export const superadmin = [
    {name: 'Analytics', icon: <ChartPie size={15}/>, 
    path:'/superadmin/analytics', subpath:[]},
    {name: 'Manage Account', icon: <Users size={15}/>, 
    path:'/superadmin/manageaccount', subpath:[]},
    {name: 'Payin', icon: <Wallet size={15}/>, 
    path:'/superadmin/payin', subpath:[]},

    {name: 'Payout', icon: <Wallet size={15}/>, 
    path:'/superadmin/payout', subpath:[]},
    {name: 'Complan', icon: <Folder size={15}/>, 
    path:'/superadmin/complan', subpath:[]},
    {name: 'Sales', icon: <Banknote size={15}/>, 
    path:'/superadmin/sales', subpath:[]},
    {name: 'Top Commission', icon: <Users size={15}/>, 
    path:'/superadmin/topcommission', subpath:[]},
    {name: 'Leaderboard', icon: <Users size={15}/>, 
    path:'/superadmin/leaderboard', subpath:[]},
    
    {name: 'Maintenance', icon: <Wrench size={15}/>, 
    path:'/superadmin/maintenance', subpath:[]},
    {name: 'Settings', icon: <Settings size={15}/>, 
    path:'/superadmin/settings', subpath:[]},
]

export const admin = [
    {name: 'Analytics', icon: <ChartPie size={15}/>, 
    path:'/admin/analytics', subpath:[]},
    {name: 'Manage Account', icon: <Users size={15}/>, 
    path:'/admin/manageaccount', subpath:[]},

    {name: 'Payout', icon: <Wallet size={15}/>, 
    path:'/admin/payout', subpath:[]},
    {name: 'Settings', icon: <Settings size={15}/>, 
    path:'/admin/settings', subpath:[]},
]

