
import * as React from "react";
import ReactCountryFlag from "react-country-flag";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { COUNTRIES } from "@/components/auth/constants";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, id, required }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = React.useState(COUNTRIES[0].code);
  const selectedCountryData = COUNTRIES.find(country => country.code === selectedCountry);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/[^\d]/g, '');
    const countryCode = selectedCountryData?.phoneCode || '';
    onChange(`${countryCode}${phoneNumber}`);
  };

  return (
    <div className="grid grid-cols-[130px_1fr] gap-2">
      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
        <SelectTrigger>
          <SelectValue placeholder="País" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map(({ code, name, phoneCode }) => (
            <SelectItem key={code} value={code} className="flex items-center gap-2">
              <ReactCountryFlag countryCode={code} svg />
              <span className="ml-2">{phoneCode}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        value={value.replace(selectedCountryData?.phoneCode || '', '')}
        onChange={handlePhoneChange}
        placeholder="Digite seu número"
        required={required}
      />
    </div>
  );
}
