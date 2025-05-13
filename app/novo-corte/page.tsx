"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  data: z.date({
    required_error: "Selecione uma data para o corte.",
  }),
})

type FormValues = z.infer<typeof formSchema>

// Dados simulados para o exemplo
const dadosCorte = {
  mercearia: [
    { produto: "Arroz Tipo 1 5kg", quantidade: 15, responsavel: "Carlos Silva", percentual: 12 },
    { produto: "Feijão Carioca 1kg", quantidade: 20, responsavel: "Carlos Silva", percentual: 15 },
    { produto: "Óleo de Soja 900ml", quantidade: 18, responsavel: "Ana Oliveira", percentual: 10 },
    { produto: "Açúcar Refinado 1kg", quantidade: 12, responsavel: "Ana Oliveira", percentual: 8 },
  ],
  pereciveis: [
    { produto: "Leite Integral 1L", quantidade: 25, responsavel: "Marcos Santos", percentual: 18 },
    { produto: "Queijo Mussarela 500g", quantidade: 10, responsavel: "Marcos Santos", percentual: 20 },
    { produto: "Iogurte Natural 500g", quantidade: 15, responsavel: "Juliana Costa", percentual: 15 },
    { produto: "Presunto Fatiado 200g", quantidade: 8, responsavel: "Juliana Costa", percentual: 12 },
  ],
}

const dadosGrafico = [
  { data: "01/05", percentual: 3.2 },
  { data: "02/05", percentual: 2.8 },
  { data: "03/05", percentual: 3.5 },
  { data: "04/05", percentual: 2.9 },
  { data: "05/05", percentual: 3.1 },
  { data: "06/05", percentual: 3.3 },
  { data: "07/05", percentual: 3.6 },
]

export default function NovoCorte() {
  const [isLoading, setIsLoading] = useState(false)
  const [corteGerado, setCorteGerado] = useState(false)
  const [validacaoStatus, setValidacaoStatus] = useState<{
    estoque: boolean | null
    demanda: boolean | null
  }>({ estoque: null, demanda: null })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)

    // Simulando validação de API
    setTimeout(() => {
      setValidacaoStatus({
        estoque: true,
        demanda: true,
      })
      setIsLoading(false)
    }, 1500)
  }

  const gerarCorte = () => {
    setIsLoading(true)

    // Simulando geração de corte
    setTimeout(() => {
      setCorteGerado(true)
      setIsLoading(false)
    }, 2000)
  }

  const mediaHistorica = 3.2
  const percentualAtual = 3.6
  const diferenca = ((percentualAtual - mediaHistorica) / mediaHistorica) * 100

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Novo Corte</h1>
        <p className="text-muted-foreground mb-8">Selecione uma data para gerar um novo corte de produtos</p>
      </motion.div>

      {!corteGerado ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Selecione a Data</CardTitle>
              <CardDescription>Escolha a data para realizar o corte de produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data do Corte</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        Validar Disponibilidade
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {validacaoStatus.estoque !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  <Alert variant={validacaoStatus.estoque ? "default" : "destructive"}>
                    {validacaoStatus.estoque ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>Estoque</AlertTitle>
                    <AlertDescription>
                      {validacaoStatus.estoque
                        ? "Dados de estoque disponíveis para a data selecionada."
                        : "Dados de estoque não disponíveis. Faça o upload em Configurações."}
                    </AlertDescription>
                  </Alert>

                  <Alert variant={validacaoStatus.demanda ? "default" : "destructive"}>
                    {validacaoStatus.demanda ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>Demanda</AlertTitle>
                    <AlertDescription>
                      {validacaoStatus.demanda
                        ? "Dados de demanda disponíveis para a data selecionada."
                        : "Dados de demanda não disponíveis. Faça o upload em Configurações."}
                    </AlertDescription>
                  </Alert>

                  {validacaoStatus.estoque && validacaoStatus.demanda && (
                    <Button onClick={gerarCorte} className="w-full mt-4" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando corte...
                        </>
                      ) : (
                        "Gerar Corte"
                      )}
                    </Button>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultado do Corte</CardTitle>
                  <CardDescription>Data: {format(new Date(), "PPP", { locale: ptBR })}</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-3 bg-primary/10 text-primary">
                  {percentualAtual}% de corte
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert
                className={cn(diferenca > 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}
              >
                <AlertTitle>Comparativo</AlertTitle>
                <AlertDescription>
                  Corte{" "}
                  {diferenca > 0 ? (
                    <span>{diferenca.toFixed(1)}% acima</span>
                  ) : (
                    <span>{Math.abs(diferenca).toFixed(1)}% abaixo</span>
                  )}{" "}
                  da média dos últimos 7 dias
                </AlertDescription>
              </Alert>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dadosGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPercentual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="data" />
                    <YAxis domain={[2, 4]} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                      formatter={(value) => [`${value}%`, "Percentual de Corte"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="percentual"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorPercentual)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <Tabs defaultValue="mercearia" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mercearia">Mercearia</TabsTrigger>
                  <TabsTrigger value="pereciveis">Perecíveis</TabsTrigger>
                </TabsList>
                <TabsContent value="mercearia" className="mt-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                      <div className="col-span-5">Produto</div>
                      <div className="col-span-2 text-center">Qtd</div>
                      <div className="col-span-3">Responsável</div>
                      <div className="col-span-2 text-right">%</div>
                    </div>
                    {dadosCorte.mercearia.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
                        <div className="col-span-5 font-medium">{item.produto}</div>
                        <div className="col-span-2 text-center">{item.quantidade}</div>
                        <div className="col-span-3">{item.responsavel}</div>
                        <div className="col-span-2 text-right">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {item.percentual}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="pereciveis" className="mt-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                      <div className="col-span-5">Produto</div>
                      <div className="col-span-2 text-center">Qtd</div>
                      <div className="col-span-3">Responsável</div>
                      <div className="col-span-2 text-right">%</div>
                    </div>
                    {dadosCorte.pereciveis.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center">
                        <div className="col-span-5 font-medium">{item.produto}</div>
                        <div className="col-span-2 text-center">{item.quantidade}</div>
                        <div className="col-span-3">{item.responsavel}</div>
                        <div className="col-span-2 text-right">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {item.percentual}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCorteGerado(false)}>
                Voltar
              </Button>
              <Button>Salvar Corte</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
