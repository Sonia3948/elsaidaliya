
import { useState } from "react";
import { Search, FilePdf, FileText } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Example medication data
const medications = [
  {
    id: "1",
    name: "Paracétamol",
    dosage: "500mg",
    form: "Comprimé",
    manufacturer: "Pharma Algérie",
    suppliers: [
      { id: "1", name: "MediStock Algérie", stock: "En stock", price: "150 DA" },
      { id: "2", name: "PharmaSupply", stock: "En stock", price: "160 DA" }
    ],
    category: "Analgésique",
    details: "Traitement de la douleur et de la fièvre"
  },
  {
    id: "2",
    name: "Amoxicilline",
    dosage: "1g",
    form: "Gélule",
    manufacturer: "SAIDAL",
    suppliers: [
      { id: "3", name: "AlgéPharm", stock: "Stock limité", price: "320 DA" }
    ],
    category: "Antibiotique",
    details: "Traitement des infections bactériennes"
  },
  {
    id: "3",
    name: "Oméprazole",
    dosage: "20mg",
    form: "Comprimé",
    manufacturer: "LPA Laboratoires",
    suppliers: [
      { id: "1", name: "MediStock Algérie", stock: "En stock", price: "280 DA" },
      { id: "3", name: "AlgéPharm", stock: "Rupture de stock", price: "260 DA" }
    ],
    category: "Anti-ulcéreux",
    details: "Inhibiteur de la pompe à protons"
  }
];

const PharmacistMedicines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof medications>([]);
  const [activeTab, setActiveTab] = useState("recherche");
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      toast({
        title: "Recherche vide",
        description: "Veuillez saisir un terme de recherche",
        variant: "destructive",
      });
      return;
    }

    // Filter medications based on search query
    const results = medications.filter(
      (med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
    setActiveTab("resultats");

    if (results.length === 0) {
      toast({
        title: "Aucun résultat",
        description: "Aucun médicament ne correspond à votre recherche",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Recherche complétée",
        description: `${results.length} médicament(s) trouvé(s)`,
      });
    }
  };

  const handleViewMedication = (medication: any) => {
    setSelectedMedication(medication);
    setActiveTab("details");
  };

  const downloadAsPdf = (medicationId: string) => {
    // This would normally generate or fetch a PDF document
    toast({
      title: "Téléchargement PDF",
      description: "Le document PDF est en cours de téléchargement",
    });
    console.log(`Downloading PDF for medication ID: ${medicationId}`);
    // In a real app, this would trigger a PDF download
  };

  const viewPrescriptionDetails = (medicationId: string) => {
    // This would normally show prescription details in a modal or navigate to details page
    toast({
      title: "Détails d'ordonnance",
      description: "Affichage des détails d'ordonnance pour ce médicament",
    });
    console.log(`Viewing prescription details for medication ID: ${medicationId}`);
    // In a real app, this would show more details
  };

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recherche de Médicaments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="recherche">Recherche</TabsTrigger>
                <TabsTrigger value="resultats">Résultats</TabsTrigger>
                <TabsTrigger value="details">Détails</TabsTrigger>
              </TabsList>

              <TabsContent value="recherche" className="space-y-4 pt-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Nom du médicament, fabricant ou catégorie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />
                  </div>
                  <Button onClick={handleSearch} className="bg-pharmacy-accent">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <h3 className="font-medium mb-2">Recherches récentes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setSearchQuery("Paracétamol")}
                    >
                      Paracétamol
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setSearchQuery("Antibiotique")}
                    >
                      Antibiotique
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setSearchQuery("SAIDAL")}
                    >
                      SAIDAL
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resultats" className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Forme</TableHead>
                      <TableHead>Fabricant</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell>{medication.name}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.form}</TableCell>
                        <TableCell>{medication.manufacturer}</TableCell>
                        <TableCell>{medication.category}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewMedication(medication)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => downloadAsPdf(medication.id)}
                            >
                              <FilePdf className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => viewPrescriptionDetails(medication.id)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="details" className="pt-4">
                {selectedMedication ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center justify-between">
                        {selectedMedication.name}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAsPdf(selectedMedication.id)}
                          >
                            <FilePdf className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPrescriptionDetails(selectedMedication.id)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Ordonnance
                          </Button>
                        </div>
                      </h2>
                      <div className="flex items-center mt-2">
                        <Badge>{selectedMedication.category}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Informations</h3>
                        <div className="bg-white p-4 rounded-md border">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Dosage</p>
                              <p>{selectedMedication.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Forme</p>
                              <p>{selectedMedication.form}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Fabricant</p>
                              <p>{selectedMedication.manufacturer}</p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p>{selectedMedication.details}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">Fournisseurs</h3>
                        <div className="bg-white p-4 rounded-md border">
                          {selectedMedication.suppliers.map((supplier: any) => (
                            <div
                              key={supplier.id}
                              className="border-b last:border-0 py-2"
                            >
                              <p className="font-medium">{supplier.name}</p>
                              <div className="flex justify-between text-sm">
                                <span
                                  className={`${
                                    supplier.stock === "En stock"
                                      ? "text-green-600"
                                      : supplier.stock === "Stock limité"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {supplier.stock}
                                </span>
                                <span className="font-medium">
                                  {supplier.price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Sélectionnez un médicament pour voir les détails</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistMedicines;
