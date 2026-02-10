import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const animalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  breed: z.string().optional(),
  age: z.string().optional(),
  weight: z.string().optional(),
  location: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

const animalTypes = [
  { label: "Cattle", value: "cattle" },
  { label: "Sheep", value: "sheep" },
  { label: "Goat", value: "goat" },
  { label: "Pig", value: "pig" },
  { label: "Chicken", value: "chicken" },
  { label: "Horse", value: "horse" },
];

interface AddAnimalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAnimalDialog({ open, onOpenChange }: AddAnimalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      age: "",
      weight: "",
      location: "",
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (animalId: string): Promise<string | null> => {
    if (!selectedImage) return null;

    const fileExt = selectedImage.name.split(".").pop();
    const fileName = `${animalId}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("animal-images")
      .upload(filePath, selectedImage, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("animal-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: AnimalFormData) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // First insert the animal to get the ID
      const { data: animalData, error } = await supabase
        .from("animals")
        .insert({
          name: data.name,
          type: data.type,
          breed: data.breed || null,
          age: data.age || null,
          weight: data.weight || null,
          location: data.location || null,
          status: "healthy",
          user_id: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Upload image if selected
      if (selectedImage && animalData) {
        const imageUrl = await uploadImage(animalData.id);
        if (imageUrl) {
          await supabase
            .from("animals")
            .update({ image: imageUrl })
            .eq("id", animalData.id);
        }
      }

      toast({
        title: "Animal added!",
        description: `${data.name} has been added to your farm.`,
      });

      form.reset();
      removeImage();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add animal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Animal</DialogTitle>
          <DialogDescription>
            Enter the details of your new animal below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Animal Photo</label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-md hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="mt-1 text-xs text-muted-foreground">Add Photo</span>
                  </div>
                )}
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bella" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Holstein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 450 kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location/Pen</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Barn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Animal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
