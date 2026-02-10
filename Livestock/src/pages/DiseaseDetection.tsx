// placeholder for DiseaseDetection page
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Stethoscope,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

interface Symptom {
  id: string;
  label: string;
  category: string;
}

interface DiseaseResult {
  name: string;
  probability: number;
  severity: "low" | "medium" | "high";
  description: string;
  actions: string[];
}

const symptomsList: Symptom[] = [
  { id: "fever", label: "Fever / High Temperature", category: "general" },
  { id: "lethargy", label: "Lethargy / Weakness", category: "general" },
  { id: "loss_appetite", label: "Loss of Appetite", category: "general" },
  { id: "weight_loss", label: "Weight Loss", category: "general" },
  { id: "coughing", label: "Coughing", category: "respiratory" },
  { id: "nasal_discharge", label: "Nasal Discharge", category: "respiratory" },
  { id: "breathing_difficulty", label: "Difficulty Breathing", category: "respiratory" },
  { id: "diarrhea", label: "Diarrhea", category: "digestive" },
  { id: "bloating", label: "Bloating", category: "digestive" },
  { id: "vomiting", label: "Vomiting", category: "digestive" },
  { id: "skin_lesions", label: "Skin Lesions / Rashes", category: "skin" },
  { id: "hair_loss", label: "Hair / Feather Loss", category: "skin" },
  { id: "limping", label: "Limping / Lameness", category: "mobility" },
  { id: "swelling", label: "Swelling in Body Parts", category: "mobility" },
  { id: "eye_discharge", label: "Eye Discharge", category: "other" },
  { id: "drooling", label: "Excessive Drooling", category: "other" },
];

const diseaseDatabase: Record<string, DiseaseResult[]> = {
  "cattle_fever_lethargy_loss_appetite": [
    {
      name: "Foot and Mouth Disease (FMD)",
      probability: 75,
      severity: "high",
      description: "Highly contagious viral disease affecting cloven-hoofed animals",
      actions: [
        "Isolate affected animals immediately",
        "Contact veterinarian urgently",
        "Disinfect affected areas",
        "Report to local animal health authorities",
      ],
    },
  ],
  "cattle_coughing_nasal_discharge": [
    {
      name: "Bovine Respiratory Disease (BRD)",
      probability: 70,
      severity: "medium",
      description: "Respiratory infection common in cattle",
      actions: [
        "Separate sick animals",
        "Ensure good ventilation",
        "Consult veterinarian for antibiotics",
        "Monitor temperature daily",
      ],
    },
  ],
  "chicken_lethargy_loss_appetite_breathing_difficulty": [
    {
      name: "Newcastle Disease",
      probability: 65,
      severity: "high",
      description: "Viral disease affecting poultry respiratory and nervous systems",
      actions: [
        "Quarantine affected birds",
        "Contact poultry veterinarian immediately",
        "Improve biosecurity measures",
        "Consider vaccination for healthy birds",
      ],
    },
  ],
  "goat_diarrhea_weight_loss": [
    {
      name: "Parasitic Infection (Worms)",
      probability: 80,
      severity: "medium",
      description: "Internal parasites affecting digestive system",
      actions: [
        "Conduct fecal examination",
        "Administer appropriate dewormer",
        "Rotate grazing pastures",
        "Maintain hygiene in shelter",
      ],
    },
  ],
  default: [
    {
      name: "General Health Concern",
      probability: 50,
      severity: "medium",
      description: "Multiple symptoms require professional examination",
      actions: [
        "Schedule veterinary check-up",
        "Monitor symptoms for 24-48 hours",
        "Ensure adequate food and water",
        "Keep animal comfortable and clean",
      ],
    },
  ],
};

export default function DiseaseDetection() {
  const [animalType, setAnimalType] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<DiseaseResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully");
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    if (!animalType || selectedSymptoms.length === 0) {
      toast.error("Please select animal type and at least one symptom");
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const key = `${animalType}_${selectedSymptoms.sort().join("_")}`;
      const matchedResults = diseaseDatabase[key] || diseaseDatabase.default;
      setResults(matchedResults);
      setIsAnalyzing(false);
      toast.success("Analysis complete");
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-success text-success-foreground";
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            Disease Detection
          </h1>
          <p className="mt-1 text-muted-foreground">
            Upload images and describe symptoms for early disease identification
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Animal Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded animal"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Animal Type */}
            <Card>
              <CardHeader>
                <CardTitle>Animal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Animal Type</Label>
                  <Select value={animalType} onValueChange={setAnimalType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cattle">Cattle</SelectItem>
                      <SelectItem value="goat">Goat</SelectItem>
                      <SelectItem value="sheep">Sheep</SelectItem>
                      <SelectItem value="chicken">Chicken</SelectItem>
                      <SelectItem value="pig">Pig</SelectItem>
                      <SelectItem value="horse">Horse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Describe any other observations..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Symptoms Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Observed Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {symptomsList.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={symptom.id}
                        checked={selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={() => toggleSymptom(symptom.id)}
                      />
                      <label
                        htmlFor={symptom.id}
                        className="text-sm cursor-pointer"
                      >
                        {symptom.label}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={analyzeSymptoms}
                  className="w-full mt-6"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border bg-card p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {result.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {result.description}
                            </p>
                          </div>
                          <Badge className={getSeverityColor(result.severity)}>
                            {result.severity.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${result.probability}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {result.probability}% match
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            Recommended Actions
                          </p>
                          <ul className="space-y-1">
                            {result.actions.map((action, actionIdx) => (
                              <li
                                key={actionIdx}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Select symptoms and click "Analyze" to get disease
                      predictions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Important Disclaimer</p>
                    <p className="text-sm text-muted-foreground">
                      This tool provides preliminary analysis only. Always
                      consult a qualified veterinarian for accurate diagnosis
                      and treatment. Early detection can save animal lives.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
