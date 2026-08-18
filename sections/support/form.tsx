"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const FormSchema = z.object({
  symbol: z.string().min(5, {
    message: "Symbol must be at least 5 characters.",
  }),
  period: z.string().min(2, {
    message: "Period must be at least 2 characters.",
  }),
  limit: z.coerce.number().int().positive("Limit must be greater than 0."),
  window: z.coerce.number().int().positive("Window must be greater than 0."),
});
export default function SearchForm({
  handleSupportResistance,
}: {
  handleSupportResistance: (
    data: z.infer<typeof FormSchema>,
  ) => void | Promise<void>;
}) {
  const form = useForm<
    z.input<typeof FormSchema>,
    undefined,
    z.output<typeof FormSchema>
  >({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symbol: "BTCUSDT",
      period: "15m",
      window: 4,
      limit: 300,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSupportResistance)}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input placeholder="UMAUSDT" {...field} />
              </FormControl>
              <FormDescription>BTCUSDT/DOGEUSDT/ETCUSDT etc.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <FormControl>
                <Input placeholder="Period 15m/4h etc" {...field} />
              </FormControl>
              <FormDescription>15m/30m/1h/4h/1d/1w/1M</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="window"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Window</FormLabel>
              <FormControl>
                <Input
                  placeholder="Window"
                  name={field.name}
                  value={field.value as number}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  type="number"
                />
              </FormControl>
              <FormDescription>Window is ...</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limit</FormLabel>
              <FormControl>
                <Input
                  placeholder="limit"
                  name={field.name}
                  value={field.value as number}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  type="number"
                />
              </FormControl>
              <FormDescription>Limit is ...</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
