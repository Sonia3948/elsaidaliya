
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface DocumentsViewerProps {
  userId?: number;
  commerceRegisterUrl?: string;
  bankReceiptUrl?: string;
  userName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  documentUrl?: string;
  title?: string;
  info?: string;
}

const DocumentsViewer = ({ 
  userId, 
  commerceRegisterUrl, 
  bankReceiptUrl, 
  userName = "", 
  isOpen,
  onClose,
  documentUrl,
  title,
  info
}: DocumentsViewerProps) => {
  const [activeTab, setActiveTab] = useState("register");
  
  // If used as a modal and isOpen is false, don't render
  if (isOpen === false) return null;
  
  // Determine if we're viewing a single document or using tabs
  const isSingleDocument = documentUrl !== undefined;
  
  if (isSingleDocument && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose && onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-4">{info}</p>
            <div className="border rounded-md overflow-hidden">
              <img 
                src={documentUrl} 
                alt={title} 
                className="w-full object-contain" 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Documents de {userName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registre de Commerce</TabsTrigger>
            <TabsTrigger value="receipt">Reçu de Virement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="mt-4">
            {commerceRegisterUrl ? (
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={commerceRegisterUrl} 
                    alt="Registre de Commerce" 
                    className="w-full object-contain h-[200px]" 
                  />
                </div>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Agrandir le document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Registre de Commerce - {userName}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <img 
                          src={commerceRegisterUrl} 
                          alt="Registre de Commerce" 
                          className="w-full object-contain" 
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Aucun registre de commerce disponible
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="receipt" className="mt-4">
            {bankReceiptUrl ? (
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={bankReceiptUrl} 
                    alt="Reçu de Virement" 
                    className="w-full object-contain h-[200px]" 
                  />
                </div>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Agrandir le reçu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Reçu de Virement - {userName}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <img 
                          src={bankReceiptUrl} 
                          alt="Reçu de Virement" 
                          className="w-full object-contain" 
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Aucun reçu de virement disponible
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentsViewer;
