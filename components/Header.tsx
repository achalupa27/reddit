import Image from 'next/image';
import { BellIcon, ChatBubbleOvalLeftIcon, GlobeAmericasIcon, PlusIcon, SparklesIcon, MegaphoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, HomeIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const Header = () => {
    const { data: session } = useSession();

    return (
        <header className='sticky top-0 z-50 flex bg-white px-4 py-1 shadow-sm'>
            <Link href='/' className='flex flex-shrink-0 cursor-pointer items-center space-x-2'>
                <div>
                    <Image src='https://seeklogo.com/images/R/reddit-logo-23F13F6A6A-seeklogo.com.png' alt='' width={32} height={32} />
                </div>
                <div className='hidden lg:inline-block'>
                    <Image src='https://seeklogo.com/images/R/reddit-logo-910A1E8BF5-seeklogo.com.png' alt='' width={70} height={32} />
                </div>
            </Link>
            <div className='mx-7 flex items-center xl:min-w-[300px]'>
                <HomeIcon className='h-5 w-5' />
                <p className='ml-2 hidden flex-1 lg:inline'>Home</p>
                <ChevronDownIcon className='h-5 w-5' />
            </div>
            <form className='flex flex-1 items-center space-x-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-2'>
                <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                <input className='flex-1 bg-transparent outline-none' type='text' placeholder='Search Reddit' />
                <button type='submit' hidden />
            </form>
            <div className='mx-5 hidden items-center space-x-2 text-gray-900 lg:inline-flex'>
                <SparklesIcon className='icon' />
                <GlobeAmericasIcon className='icon' />
                <VideoCameraIcon className='icon' />
                <hr className='h-10 border border-gray-100' />
                <ChatBubbleOvalLeftIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <MegaphoneIcon className='icon' />
            </div>
            <div className='ml-5 mr-2 flex items-center lg:hidden'>
                <Bars3Icon className='icon' />
            </div>
            {session ? (
                <div onClick={() => signOut()} className='hidden cursor-pointer items-center space-x-2 border border-gray-100 p-1 lg:flex'>
                    <Image src='https://links.papareact.com/23l' alt='' width={24} height={24} />
                    <div className='flex-1 text-xs'>
                        <p className='truncate'>{session?.user?.name}</p>
                        <p className='text-gray-400'>1 Karma</p>
                    </div>
                    <ChevronDownIcon className='h-5 flex-shrink-0 text-gray-400' />
                </div>
            ) : (
                <div onClick={() => signIn()} className='hidden cursor-pointer items-center space-x-2 border border-gray-100 p-1 lg:flex'>
                    <Image src='https://links.papareact.com/23l' alt='' width={24} height={24} />
                    <p className='text-gray-400'>Sign In</p>
                </div>
            )}
        </header>
    );
};

export default Header;
