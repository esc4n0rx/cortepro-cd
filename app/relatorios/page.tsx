"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Download, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Primeiro, vamos adicionar o import do Dialog e seus componentes
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"

// Dados simulados para o exemplo
const relatorios = [
  {
    id: "1",
    data: "2023-05-01",
    tipo: "Mercearia",
    responsavel: "Carlos Silva",
    percentual: 3.2,
    status: "Concluído",
  },
  {
    id: "2",
    data: "2023-05-02",
    tipo: "Perecíveis",
    responsavel: "Ana Oliveira",
    percentual: 2.8,
    status: "Concluído",
  },
  {
    id: "3",
    data: "2023-05-03",
    tipo: "Mercearia",
    responsavel: "Marcos Santos",
    percentual: 3.5,
    status: "Concluído",
  },
  {
    id: "4",
    data: "2023-05-04",
    tipo: "Perecíveis",
    responsavel: "Juliana Costa",
    percentual: 2.9,
    status: "Concluído",
  },
  {
    id: "5",
    data: "2023-05-05",
    tipo: "Mercearia",
    responsavel: "Carlos Silva",
    percentual: 3.1,
    status: "Concluído",
  },
  {
    id: "6",
    data: "2023-05-06",
    tipo: "Perecíveis",
    responsavel: "Ana Oliveira",
    percentual: 3.3,
    status: "Concluído",
  },
  {
    id: "7",
    data: "2023-05-07",
    tipo: "Mercearia",
    responsavel: "Marcos Santos",
    percentual: 3.6,
    status: "Concluído",
  },
]

// Vamos adicionar dados simulados para os produtos em cada corte
// Adicione isso após a declaração da constante 'relatorios'
const produtosCorte = {
  "1": {
    mercearia: [
      { produto: "Arroz Tipo 1 5kg", quantidade: 15, responsavel: "Carlos Silva", percentual: 12 },
      { produto: "Feijão Carioca 1kg", quantidade: 20, responsavel: "Carlos Silva", percentual: 15 },
      { produto: "Óleo de Soja 900ml", quantidade: 18, responsavel: "Ana Oliveira", percentual: 10 },
    ],
    pereciveis: [
      { produto: "Leite Integral 1L", quantidade: 25, responsavel: "Carlos Silva", percentual: 18 },
      { produto: "Queijo Mussarela 500g", quantidade: 10, responsavel: "Carlos Silva", percentual: 20 },
    ],
    grafico: [
      { data: "24/04", percentual: 3.0 },
      { data: "25/04", percentual: 2.7 },
      { data: "26/04", percentual: 3.1 },
      { data: "27/04", percentual: 2.8 },
      { data: "28/04", percentual: 3.0 },
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
    ],
  },
  "2": {
    mercearia: [
      { produto: "Macarrão Espaguete 500g", quantidade: 12, responsavel: "Ana Oliveira", percentual: 10 },
      { produto: "Molho de Tomate 340g", quantidade: 18, responsavel: "Ana Oliveira", percentual: 14 },
    ],
    pereciveis: [
      { produto: "Iogurte Natural 500g", quantidade: 15, responsavel: "Ana Oliveira", percentual: 15 },
      { produto: "Presunto Fatiado 200g", quantidade: 8, responsavel: "Ana Oliveira", percentual: 12 },
      { produto: "Queijo Prato 500g", quantidade: 10, responsavel: "Ana Oliveira", percentual: 18 },
    ],
    grafico: [
      { data: "25/04", percentual: 2.7 },
      { data: "26/04", percentual: 3.1 },
      { data: "27/04", percentual: 2.8 },
      { data: "28/04", percentual: 3.0 },
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
    ],
  },
  "3": {
    mercearia: [
      { produto: "Café Torrado 500g", quantidade: 10, responsavel: "Marcos Santos", percentual: 15 },
      { produto: "Açúcar Refinado 1kg", quantidade: 12, responsavel: "Marcos Santos", percentual: 8 },
      { produto: "Biscoito Recheado 140g", quantidade: 25, responsavel: "Marcos Santos", percentual: 20 },
    ],
    pereciveis: [
      { produto: "Manteiga 200g", quantidade: 8, responsavel: "Marcos Santos", percentual: 12 },
      { produto: "Requeijão 200g", quantidade: 10, responsavel: "Marcos Santos", percentual: 18 },
    ],
    grafico: [
      { data: "26/04", percentual: 3.1 },
      { data: "27/04", percentual: 2.8 },
      { data: "28/04", percentual: 3.0 },
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
      { data: "03/05", percentual: 3.5 },
    ],
  },
  "4": {
    mercearia: [
      { produto: "Farinha de Trigo 1kg", quantidade: 8, responsavel: "Juliana Costa", percentual: 10 },
      { produto: "Sal Refinado 1kg", quantidade: 5, responsavel: "Juliana Costa", percentual: 5 },
    ],
    pereciveis: [
      { produto: "Iogurte Bandeja 540g", quantidade: 12, responsavel: "Juliana Costa", percentual: 15 },
      { produto: "Margarina 500g", quantidade: 8, responsavel: "Juliana Costa", percentual: 12 },
      { produto: "Leite Condensado 395g", quantidade: 10, responsavel: "Juliana Costa", percentual: 18 },
    ],
    grafico: [
      { data: "27/04", percentual: 2.8 },
      { data: "28/04", percentual: 3.0 },
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
      { data: "03/05", percentual: 3.5 },
      { data: "04/05", percentual: 2.9 },
    ],
  },
  "5": {
    mercearia: [
      { produto: "Achocolatado 400g", quantidade: 10, responsavel: "Carlos Silva", percentual: 12 },
      { produto: "Cereal Matinal 300g", quantidade: 8, responsavel: "Carlos Silva", percentual: 15 },
      { produto: "Leite em Pó 400g", quantidade: 6, responsavel: "Carlos Silva", percentual: 10 },
    ],
    pereciveis: [
      { produto: "Cream Cheese 150g", quantidade: 8, responsavel: "Carlos Silva", percentual: 12 },
      { produto: "Iogurte Grego 100g", quantidade: 15, responsavel: "Carlos Silva", percentual: 18 },
    ],
    grafico: [
      { data: "28/04", percentual: 3.0 },
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
      { data: "03/05", percentual: 3.5 },
      { data: "04/05", percentual: 2.9 },
      { data: "05/05", percentual: 3.1 },
    ],
  },
  "6": {
    mercearia: [
      { produto: "Azeite Extra Virgem 500ml", quantidade: 5, responsavel: "Ana Oliveira", percentual: 20 },
      { produto: "Vinagre 750ml", quantidade: 6, responsavel: "Ana Oliveira", percentual: 15 },
    ],
    pereciveis: [
      { produto: "Queijo Parmesão 100g", quantidade: 8, responsavel: "Ana Oliveira", percentual: 22 },
      { produto: "Salame Italiano 100g", quantidade: 6, responsavel: "Ana Oliveira", percentual: 18 },
      { produto: "Iogurte Líquido 900ml", quantidade: 10, responsavel: "Ana Oliveira", percentual: 15 },
    ],
    grafico: [
      { data: "29/04", percentual: 3.1 },
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
      { data: "03/05", percentual: 3.5 },
      { data: "04/05", percentual: 2.9 },
      { data: "05/05", percentual: 3.1 },
      { data: "06/05", percentual: 3.3 },
    ],
  },
  "7": {
    mercearia: [
      { produto: "Arroz Integral 1kg", quantidade: 8, responsavel: "Marcos Santos", percentual: 15 },
      { produto: "Feijão Preto 1kg", quantidade: 10, responsavel: "Marcos Santos", percentual: 18 },
      { produto: "Macarrão Parafuso 500g", quantidade: 12, responsavel: "Marcos Santos", percentual: 12 },
    ],
    pereciveis: [
      { produto: "Leite Desnatado 1L", quantidade: 15, responsavel: "Marcos Santos", percentual: 20 },
      { produto: "Queijo Coalho 500g", quantidade: 6, responsavel: "Marcos Santos", percentual: 25 },
    ],
    grafico: [
      { data: "30/04", percentual: 3.2 },
      { data: "01/05", percentual: 3.2 },
      { data: "02/05", percentual: 2.8 },
      { data: "03/05", percentual: 3.5 },
      { data: "04/05", percentual: 2.9 },
      { data: "05/05", percentual: 3.1 },
      { data: "06/05", percentual: 3.3 },
      { data: "07/05", percentual: 3.6 },
    ],
  },
}

export default function Relatorios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")
  const [responsavelFiltro, setResponsavelFiltro] = useState("todos")

  // Agora, vamos adicionar o estado para controlar o modal e o relatório selecionado
  // Adicione isso dentro da função Relatorios, após as declarações de estado existentes
  const [modalAberto, setModalAberto] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string | null>(null)
  \

  const responsaveis = [...new Set(relatorios.map((item) => item.responsavel))]

  const filteredRelatorios = relatorios.filter((relatorio) => {
    const matchesSearch =
      relatorio.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format(new Date(relatorio.data), "dd/MM/yyyy").includes(searchTerm)

    const matchesTipo = tipoFiltro === "todos" || relatorio.tipo === tipoFiltro
    const matchesResponsavel = responsavelFiltro === "todos" || relatorio.responsavel === responsavelFiltro

    return matchesSearch && matchesTipo && matchesResponsavel
  })

  // Função para abrir o modal com o relatório selecionado
  const abrirDetalhesCorte = (id: string) => {
    setRelatorioSelecionado(id)
    setModalAberto(true)
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Relatórios</h1>
        <p className="text-muted-foreground mb-8">Histórico de cortes realizados e opções de exportação</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Histórico de Cortes</CardTitle>
                <CardDescription>Visualize e filtre os cortes realizados</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Exportar como XLSX</DropdownMenuItem>
                    <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por responsável ou data..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="Mercearia">Mercearia</SelectItem>
                    <SelectItem value="Perecíveis">Perecíveis</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={responsavelFiltro} onValueChange={setResponsavelFiltro}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os responsáveis</SelectItem>
                    {responsaveis.map((resp) => (
                      <SelectItem key={resp} value={resp}>
                        {resp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">% Corte</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                {/* Vamos modificar a TableRow para adicionar o evento de clique
                Substitua a TableBody existente por esta versão */}
                <TableBody>
                  {filteredRelatorios.map((relatorio) => (
                    <TableRow
                      key={relatorio.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => abrirDetalhesCorte(relatorio.id)}
                    >
                      <TableCell>{format(new Date(relatorio.data), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            relatorio.tipo === "Mercearia"
                              ? "bg-primary/10 text-primary"
                              : "bg-orange-500/10 text-orange-500"
                          }
                        >
                          {relatorio.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{relatorio.responsavel}</TableCell>
                      <TableCell className="text-right font-medium">{relatorio.percentual}%</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {relatorio.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Finalmente, vamos adicionar o Dialog para mostrar os detalhes do corte
      Adicione este código no final, antes do fechamento da div container */}
      {relatorioSelecionado && (
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>
                  Detalhes do Corte -{" "}
                  {format(new Date(relatorios.find((r) => r.id === relatorioSelecionado)?.data || ""), "dd/MM/yyyy")}
                </span>
                <Badge variant="outline" className="text-lg py-1 px-3 bg-primary/10 text-primary">
                  {relatorios.find((r) => r.id === relatorioSelecionado)?.percentual}% de corte
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Responsável: {relatorios.find((r) => r.id === relatorioSelecionado)?.responsavel}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={produtosCorte[relatorioSelecionado as keyof typeof produtosCorte]?.grafico || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPercentual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="data" />
                    <YAxis domain={[2, 4]} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <RechartsTooltip
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
                    {produtosCorte[relatorioSelecionado as keyof typeof produtosCorte]?.mercearia.map((item, index) => (
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
                    {produtosCorte[relatorioSelecionado as keyof typeof produtosCorte]?.pereciveis.map(
                      (item, index) => (
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
                      ),
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
