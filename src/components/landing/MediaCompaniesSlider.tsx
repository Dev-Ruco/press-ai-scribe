
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Globe } from "lucide-react";

const mediaCompanies = [
  { name: "Global News", icon: Globe },
  { name: "News Daily", icon: Globe },
  { name: "Metro Press", icon: Globe },
  { name: "The Chronicle", icon: Globe },
  { name: "Media Corp", icon: Globe },
  { name: "City Journal", icon: Globe },
];

export function MediaCompaniesSlider() {
  return (
    <section className="py-12 bg-white/5">
      <div className="container mx-auto">
        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mediaCompanies.map((company, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <div className="flex flex-col items-center justify-center p-6 h-32 rounded-lg bg-white/5 border border-gray-100/10">
                  <company.icon className="w-12 h-12 text-gray-700" />
                  <span className="mt-2 text-sm font-medium text-gray-600">{company.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
