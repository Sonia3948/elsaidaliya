
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RegistrationNoticeProps {
  role: "pharmacien" | "fournisseur";
}

const RegistrationNotice = ({ role }: RegistrationNoticeProps) => {
  return (
    <Alert className="bg-amber-50 border-amber-300 mb-4">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 font-medium">Votre compte est en attente de validation</AlertTitle>
      <AlertDescription className="text-amber-700">
        Veuillez patienter pendant que l'administrateur vérifie votre inscription. Vous recevrez une notification dès que votre compte sera activé.
      </AlertDescription>
    </Alert>
  );
};

export default RegistrationNotice;
