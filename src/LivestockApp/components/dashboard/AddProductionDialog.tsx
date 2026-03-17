import { useState } from "react";
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

const productionSchema = z.object({
  animal_type: z.string().min(1, "Animal type is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.string().min(1, "Quantity is required"),
  notes: z.string().optional(),
});

type ProductionFormData = z.infer<typeof productionSchema>;

const productionCategories = [
  { label: "Milk (Liters)", value: "milk", unit: "L", types: ["cattle", "goat", "sheep", "buffalo"] },
  { label: "Eggs (Count)", value: "eggs", unit: "pcs", types: ["chicken", "duck", "turkey"] },
  { label: "Wool (Kg)", value: "wool", unit: "kg", types: ["sheep", "goat"] },
  { label: "Meat (Kg)", value: "meat", unit: "kg", types: ["cattle", "goat", "sheep", "pig", "chicken"] },
  { label: "Honey (Kg)", value: "honey", unit: "kg", types: ["bee"] },
];

const animalTypes = [
  { label: "Cattle", value: "cattle" },
  { label: "Buffalo", value: "buffalo" },
  { label: "Goat", value: "goat" },
  { label: "Sheep", value: "sheep" },
  { label: "Pig", value: "pig" },
  { label: "Chicken", value: "chicken" },
  { label: "Duck", value: "duck" },
  { label: "Turkey", value: "turkey" },
  { label: "Horse", value: "horse" },
  { label: "Bee", value: "bee" },
];

interface AddProductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductionAdded?: () => void;
}

export function AddProductionDialog({ 
  open, 
  onOpenChange,
  onProductionAdded 
}: AddProductionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      animal_type: "",
      category: "",
      quantity: "",
      notes: "",
    },
  });

  const selectedType = form.watch("animal_type");
  const selectedCategory = form.watch("category");

  const availableCategories = productionCategories.filter(
    cat => !selectedType || cat.types.includes(selectedType)
  );

  const getUnit = () => {
    const category = productionCategories.find(c => c.value === selectedCategory);
    return category?.unit || "";
  };

  const onSubmit = async (data: ProductionFormData) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const category = productionCategories.find(c => c.value === data.category);

      const { error } = await supabase.from("daily_production").upsert({
        date: new Date().toISOString().split('T')[0],
        animal_type: data.animal_type,
        category: data.category,
        quantity: parseFloat(data.quantity),
        unit: category?.unit || "",
        notes: data.notes || null,
      }, {
        onConflict: 'user_id,date,animal_type,category'
      });

      if (error) throw error;

      toast({
        title: "Production recorded!",
        description: `${data.quantity}${getUnit()} ${data.category} from ${data.animal_type} has been logged.`,
      });

      form.reset();
      onOpenChange(false);
      onProductionAdded?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record production",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Daily Production</DialogTitle>
          <DialogDescription>
            Record today's production for any animal category.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="animal_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity *{getUnit() && ` (${getUnit()})`}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder={`e.g., 50`} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes..."
                      className="resize-none"
                      rows={2}
                      {...field} 
                    />
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
                {isSubmitting ? "Saving..." : "Record Production"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

