"use client";

import { Separator } from "@/components/ui/separator";
import SearchForm, { FormSchema } from "@/sections/support/form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import SRTable from "@/sections/support/table";
import { useState } from "react";

import BigNumber from "bignumber.js";
import {
  findSupportResistanceLevels,
  getBinancePriceData,
} from "@/sections/support/api";

export default function SupportResistance() {
  const [symbol, setSymbol] = useState<string>("");
  const [period, setPeriod] = useState<string>("");

  const [strongSupport, setStrongSupport] = useState<BigNumber[]>([]);
  const [weakSupport, setWeakSupport] = useState<BigNumber[]>([]);
  const [strongResistance, setStrongResistance] = useState<BigNumber[]>([]);
  const [weakResistance, setWeakResistance] = useState<BigNumber[]>([]);
  const [currentValue, setCurrentValue] = useState<number>(0);

  async function handleSupportResistance(data: z.infer<typeof FormSchema>) {
    setSymbol(data.symbol);
    setPeriod(data.period);
    toast({
      title: "Please wait a moment.",
      description: `It's coming for ${data.symbol} ${data.period} ${data.limit} ${data.window}`,
    });
    await getBinancePriceData(data.symbol, data.period, data.limit)
      .then((res: number[]) => {
        setCurrentValue(res[res.length - 1]);
        const { strongSupport, weakSupport, strongResistance, weakResistance } =
          findSupportResistanceLevels(res, data.window);
        setStrongResistance(strongResistance);
        setWeakResistance(weakResistance);
        setStrongSupport(strongSupport);
        setWeakSupport(weakSupport);
      })
      .catch((err: any) => {
        toast({
          title: "Error",
          description: "An error occurred while fetching data.",
        });
        setCurrentValue(0);
        setStrongResistance([]);
        setWeakResistance([]);
        setStrongSupport([]);
        setWeakSupport([]);
      });
  }

  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Support/Resistance
        </h2>
        <p className="text-sm text-muted-foreground">
          S/R Finder is a powerful tool that helps you find support and
          resistance levels for any stock.
        </p>
      </div>
      <Separator className="my-4" />

      <SearchForm handleSupportResistance={handleSupportResistance} />

      {currentValue > 0 && (
        <>
          <Separator className="my-4" />
          <h1>Current Value: {currentValue}</h1>
        </>
      )}

      {(strongResistance.length > 0 ||
        weakResistance.length > 0 ||
        strongSupport.length > 0 ||
        weakSupport.length > 0) && (
        <SRTable
          symbol={symbol}
          period={period}
          strongResistance={strongResistance}
          weakResistance={weakResistance}
          strongSupport={strongSupport}
          weakSupport={weakSupport}
        />
      )}
    </>
  );
}
