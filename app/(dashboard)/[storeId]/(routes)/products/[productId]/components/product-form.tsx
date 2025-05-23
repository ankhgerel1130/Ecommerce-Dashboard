"use client";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react";
import * as z from "zod";
import { Category, Image, Product, Color, Size} from "@prisma/client";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  initialData: (Product & { images: Image[] }
    
    
    ) | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}


const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().optional(), 
  images: z.object({ url: z.string() }).array().nonempty("At least one image is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  categoryId: z.string().min(1, "Category is required"),
  colorId: z.string().min(1, "Color is required"),
  sizeId: z.string().min(1, "Size is required"),
  description: z.string().optional(), //nem
  quality: z.coerce.number().optional(), //nem
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({
   initialData,
   categories,
   colors,
   sizes



}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit an existing product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          label: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          description: "",
          quality: 0,
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
        setLoading(true);
        if (initialData) {
            await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
        } else {
            await axios.post(`/api/${params.storeId}/products`, data)
        }
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success(toastMessage)
    } catch(err) {
        toast.error("Something went wrong ym shig bn.");
    } finally {
        setLoading(false)
    }
}

const onDelete = async () => {
    try {
        setLoading(true);
        await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success("Produuct deleted.")
    } catch(err) {
        toast.error("Something went wrong");
    } finally {
        setLoading(false)
        setOpen(false);
    }
};


  return (
    <>
      {/* ✅ Confirm Delete Modal */}
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

      {/* ✅ Header with Delete Button */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* ✅ Product Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          {/* ✅ Image Upload */}
          <FormField
    control={form.control}
    name="images"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
                <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange((field.value = [...field.value, { url }]))}
                    onRemove={(url) => field.onChange(field.value.filter((current) => current.url !== url))}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>

          {/* ✅ Product Details */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

                          <FormField
                            control={form.control} 
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select disabled={loading} 
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value} 
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a Category"
                                                /> 

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category)=>(
                                                <SelectItem
                                                key={category.id}
                                                value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            )) }
    
                                        </SelectContent>
                                    </Select>
                                   
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
              <FormField
                            control={form.control} 
                            name="sizeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select disabled={loading} 
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value} 
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a size"
                                                /> 

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size)=>(
                                                <SelectItem
                                                key={size.id}
                                                value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            )) }
    
                                        </SelectContent>
                                    </Select>
                                   
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Input 
          disabled={loading} 
          placeholder="Product description" 
          {...field} 
          value={field.value || ''}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="quality"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Quality</FormLabel>
      <FormControl>
        <Input 
          type="number" 
          disabled={loading} 
          placeholder="1-100 (optional)" 
          {...field} 
          value={field.value || ''}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers between 1-100 or empty string
            if (value === '' || (Number(value) >= 1 && Number(value) <= 100)) {
              field.onChange(value === '' ? undefined : parseInt(value));
            }
          }}
          min="1"
          max="100"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
                          <FormField
                            control={form.control} 
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select disabled={loading} 
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value} 
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a color"
                                                /> 

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color)=>(
                                                <SelectItem
                                                key={color.id}
                                                value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            )) }
    
                                        </SelectContent>
                                    </Select>
                                   
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
              <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                    checked={field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                    
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>

                      Home featured хэсэгт харагдана
                    </FormDescription>



                  </div>
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                    checked={field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                    
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>

                      Архив
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />


            
            
            
          </div>

          {/* ✅ Submit Button */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default ProductForm;
