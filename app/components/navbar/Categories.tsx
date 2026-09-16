'use client';

import Container from '../Container'
import { TbBeach } from 'react-icons/tb'
import { 
    GiBoatFishing, 
    GiCaveEntrance,
    GiForestCamp, 
    GiIsland, 
    GiMountainRoad
} from 'react-icons/gi'
import { 
    MdLocationCity, 
    MdOutlineSavings,
    MdOutlineVilla, 
    MdOutlineWaves, 
    MdPool 
} from 'react-icons/md'
import CategoryBox from '../CategoryBox'
import { usePathname, useSearchParams } from 'next/navigation'
import { IoDiamond } from 'react-icons/io5'

type Props = {}

export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "Stay near beautiful beaches"
  },
  {
    label: "Mountain",
    icon: GiMountainRoad,
    description: "Peaceful stays surrounded by mountains"
  },
  {
    label: "Caves",
    icon: GiCaveEntrance,
    description: "Explore caves and natural wonders"
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "Modern and stylish accommodations"
  },
  {
    label: "City",
    icon: MdLocationCity,
    description: "Stay in the heart of the city"
  },
  {
    label: "Pool",
    icon: MdPool,
    description: "Properties with swimming pools"
  },
  {
    label: "Ocean View",
    icon: MdOutlineWaves,
    description: "Beautiful views of the ocean"
  },
  {
    label: "Budget",
    icon: MdOutlineSavings,
    description: "Affordable stays"
  },
  {
    label: "Luxury",
    icon: IoDiamond,
    description: "this property is a luxurious"
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "Properties near lakes and rivers"
  },
  {
    label: "Island",
    icon: GiIsland,
    description: "Escape to beautiful island destinations"
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "Experience the great outdoors"
  },
]


export default function Categories({}: Props) {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();

  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }
  
  return (
    <Container>
        <div
            className="
              pt-4
              flex
              flex-row
              items-center
              justify-between
              overflow-x-auto
            "
        >
            {categories.map((item) => (
                <CategoryBox 
                  key={item.label}
                  label={item.label}
                  selected={category === item.label}
                  icon={item.icon}
                />
            ))}
        </div>
    </Container>
  )
}