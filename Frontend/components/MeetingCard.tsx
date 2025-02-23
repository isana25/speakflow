'use client';

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section
      className={cn(
        "bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 p-6 rounded-[18px] min-h-[280px] w-full flex flex-col justify-between transition-all transform hover:scale-105 shadow-xl"
      )}
    >
      <article className="flex flex-col gap-4">
        <div className="flex items-center space-x-3">
          <Image src={icon} alt="meeting-icon" width={32} height={32} />
          <div>
            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
            <p className="text-lg text-gray-300">{date}</p>
          </div>
        </div>
      </article>
      
      <article className="relative mt-6">
        <div className="flex justify-start space-x-2 max-sm:hidden">
          {avatarImages.slice(0, 4).map((img, index) => (
            <div key={index} className="relative">
              <Image
                src={img}
                alt="attendee"
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
                style={{ zIndex: 10 - index }}
              />
            </div>
          ))}
          {avatarImages.length > 4 && (
            <div className="flex-center absolute left-[120px] w-12 h-12 rounded-full bg-gray-800 text-white font-semibold">
              +{avatarImages.length - 4}
            </div>
          )}
        </div>

        {!isPreviousMeeting && (
          <div className="flex justify-start gap-3 mt-4">
            <Button
              onClick={handleClick}
              className="bg-green-500 text-white px-8 py-2 rounded-md shadow-md transform hover:scale-105 transition duration-200"
            >
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="button-icon" width={20} height={20} />
              )}
              &nbsp; {buttonText}
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-gray-700 text-white px-8 py-2 rounded-md shadow-md transform hover:scale-105 transition duration-200"
            >
              <Image src="/icons/copy.svg" alt="copy-link" width={20} height={20} />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
