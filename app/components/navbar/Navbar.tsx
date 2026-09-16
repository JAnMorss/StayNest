'use client';

import { useCurrentUser } from '@/app/hooks/useUser';
import Container from '../Container'
import Logo from './Logo'
import Search from './Search'
import UserMenu from './UserMenu'
import Categories from './Categories';

export default function Navbar() {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
        <div 
            className="
                py-4 
                border-b 
                border-neutral-100
            "
        >
            <Container>
                <div
                    className="
                        flex 
                        flex-row  
                        items-center
                        justify-between
                        gap-3
                        md:gap-0
                    "
                >
                    <Logo />
                    <Search />
                    <UserMenu currentUser={currentUser} />
                </div>
            </Container>
        </div>
        <Categories />
    </div>
  )
}