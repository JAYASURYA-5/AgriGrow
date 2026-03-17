import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@livestock/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@livestock/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@livestock/components/ui/select";
import { Input } from "@livestock/components/ui/input";
import { Button } from "@livestock/components/ui/button";
import { Textarea } from "@livestock/components/ui/textarea";
import { useToast } from "@livestock/hooks/use-toast";
import { supabase } from "@livestock/integrations/supabase/client";

const healthRecordSchema = z.object({
  animal_id: z.string().min(1, "Please select an animal"),
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  next_due_date: z.string().optional(),
});

type HealthRecordFormData = z.infer<typeof healthRecordSchema>;

const recordTypes = [
  { label: "Vaccination", value: "vaccination" },
  { label: "Health Check", value: "health_check" },
  { label: "Deworming", value: "deworming" },
  { label: "Treatment", value: "treatment" },
  { label: "Surgery", value: "surgery" },
  { label: "Dental", value: "dental" },
  { label: "Other", value: "other" },
];

interface Animal {
  id: string;
  name: string;
  type: string;
}

interface AddHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordAdded?: () => void;
}

export function AddHealthRecordDialog({ 
  open, 
  onOpenChange,
  onRecordAdded 
}: AddHealthRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const { toast } = useToast();

  const form = useForm<HealthRecordFormData>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      animal_id: "",
      title: "",
      type: "",
      description: "",
      next_due_date: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchAnimals();
    }
  }, [open]);

  const fetchAnimals = async () => {
    setLoadingAnimals(true);
    try {
      const { data, error } = await supabase
        .from("animals")
        .select("id, name, type")
        .order("name");

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load animals",
        variant: "destructive",
      });
    } finally {
      setLoadingAnimals(false);
    }
  };

  const onSubmit = async (data: HealthRecordFormData) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from("health_records").insert({
        animal_id: data.animal_id,
        title: data.title,
        type: data.type,
        description: data.description || null,
        next_due_date: data.next_due_date || null,
      });

      if (error) throw error;

      toast({
        title: "Record added!",
        description: "Health record has been saved successfully.",
      });

      form.reset();
      onOpenChange(false);
      onRecordAdded?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add health record";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Health Record</DialogTitle>
          <DialogDescription>
            Record a health event, vaccination, or treatment for an animal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="animal_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingAnimals ? "Loading..." : "Select an animal"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animals.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.name} ({animal.type})
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recordTypes.map((type) => (
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Vaccination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes about this record..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                {isSubmitting ? "Saving..." : "Add Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

