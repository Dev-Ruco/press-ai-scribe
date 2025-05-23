
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface AuthPromptProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthPrompt({ isOpen, onClose }: AuthPromptProps) {
  const navigate = useNavigate()

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-normal">
            Autenticação necessária
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Para acessar esta funcionalidade, faça login ou crie uma conta gratuita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            className="w-full" 
            onClick={() => {
              onClose()
              navigate("/auth")
            }}
          >
            Entrar ou Cadastrar
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
