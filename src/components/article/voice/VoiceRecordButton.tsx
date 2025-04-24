
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceRecordButtonProps {
  onRecordingComplete: (file: File) => void;
  onError: (message: string) => void;
}

export function VoiceRecordButton({ onRecordingComplete, onError }: VoiceRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
          onRecordingComplete(audioFile);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } else {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError("Não foi possível acessar o microfone.");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full transition-colors ${
              isRecording 
                ? "text-red-500 hover:text-red-600 hover:bg-red-50 animate-pulse" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
            onClick={toggleRecording}
          >
            <Mic className="h-4 w-4" />
            {isRecording && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1">
                {recordingTime}s
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isRecording ? "Parar gravação" : "Gravar áudio"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
