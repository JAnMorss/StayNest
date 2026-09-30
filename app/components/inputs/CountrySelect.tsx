'use client';

import useCountries from "@/app/hooks/useCountries";
import Select from "react-select";

export type CountrySelectValue= {
    value: string;
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    subregion: string;
}

interface CountrySelectProps {
    value?: CountrySelectValue | null;
    onChange: (value: CountrySelectValue | null) => void;
}

export default function CountrySelect({
    value,
    onChange
}: CountrySelectProps) {
  const { getAll } = useCountries();

  return (
    <div>
        <Select
            placeholder="AnyWhere"
            isClearable
            options={getAll()}
            value={value}
            onChange={(value) => onChange(value as CountrySelectValue | null)}
            formatOptionLabel={(option: CountrySelectValue) => (
                <div className="flex flex-row items-center gap-3">
                    <span
                        className="
                            h-5
                            w-7
                            shrink-0
                            rounded-sm
                            bg-cover
                            bg-center
                            bg-no-repeat
                        "
                        style={{
                            backgroundImage: `url(https://flagcdn.com/w40/${option.value.toLowerCase()}.png)`,
                        }}
                    />
                    <div>
                        {option.label},
                        <span className="text-neutral-500 ml-1">
                            {option.region}
                        </span>
                    </div>
                </div>
            )}
            classNames={{
                control: () => 'p-3 border-2',
                input: () => 'text-lg', 
                option: () => 'text-lg',
            }}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                    ...theme.colors,
                    primary: 'black',
                    primary25: '#ffe4e6',
                },
            })}
        />
    </div>
  )
}