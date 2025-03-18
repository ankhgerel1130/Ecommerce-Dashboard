"use client";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
const formSchema = z.object({
  name: z.string().min(1, "Store name is required"),
});

//Дэлгүүрийн нэр дамжуулах 
export const StoreModal = () => {
  const storeModal = useStoreModal();

  //load hiih
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
//Дэлгүүрийн нэр дамжуулах тест
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   try{
    const response = await axios.post('/api/stores', values);
  
    window.location.assign(`/${response.data.id}`);
    toast.success("Store created,"); // success alert gargah
  
    console.log(response.data);
   } catch (error){
    toast.error("Something went wrong"); 
   } finally{
    setLoading(false)
   }
  };

  //form hiih 
  return (
    <Modal
      title="Create a Store"
      description="Add a new store to manage"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                    disabled={loading} //
                    {...field} 
                    placeholder="E-commerce" {...field} />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full" >

            <Button disabled={loading} //load hiihed disable hiih
            type="submit"> Continue </Button>
           <Button variant="outline" onClick={storeModal.onClose} > Cancel </Button>
        
           </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
