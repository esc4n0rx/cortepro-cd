"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileSpreadsheet, Info, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Configuracoes() {
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = (fileType: string) => {
    setUploading(fileType)
    setUploadProgress(0)

    // Simulando progresso de upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploading(null)
            setUploadProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground mb-8">Gerencie arquivos e ajuste parâmetros do sistema</p>
      </motion.div>

      <Tabs defaultValue="arquivos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
          <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
        </TabsList>

        <TabsContent value="arquivos">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-primary/10 text-primary">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <CardTitle>Estoque</CardTitle>
                <CardDescription>Faça upload do arquivo de estoque atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="estoque">Arquivo CSV/Excel</Label>
                  <div className="flex gap-2">
                    <Input id="estoque" type="file" accept=".csv,.xlsx,.xls" />
                    <Button size="sm" onClick={() => handleUpload("estoque")} disabled={uploading === "estoque"}>
                      {uploading === "estoque" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {uploading === "estoque" && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% concluído</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-orange-500/10 text-orange-500">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <CardTitle>Demanda</CardTitle>
                <CardDescription>Faça upload do arquivo de demanda do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="demanda">Arquivo CSV/Excel</Label>
                  <div className="flex gap-2">
                    <Input id="demanda" type="file" accept=".csv,.xlsx,.xls" />
                    <Button size="sm" onClick={() => handleUpload("demanda")} disabled={uploading === "demanda"}>
                      {uploading === "demanda" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {uploading === "demanda" && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-orange-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% concluído</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 bg-purple-500/10 text-purple-500">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <CardTitle>Cadastro de Itens</CardTitle>
                <CardDescription>Faça upload do arquivo de cadastro de itens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="cadastro">Arquivo CSV/Excel</Label>
                  <div className="flex gap-2">
                    <Input id="cadastro" type="file" accept=".csv,.xlsx,.xls" />
                    <Button size="sm" onClick={() => handleUpload("cadastro")} disabled={uploading === "cadastro"}>
                      {uploading === "cadastro" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {uploading === "cadastro" && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% concluído</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="ajustes">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ajustes Gerais</CardTitle>
                <CardDescription>Configure os parâmetros do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="formato-calculo">Formato de Cálculo</Label>
                    <Select defaultValue="percentual">
                      <SelectTrigger id="formato-calculo">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentual">Percentual</SelectItem>
                        <SelectItem value="absoluto">Valor Absoluto</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dias-media">Dias para Média Histórica</Label>
                    <Select defaultValue="7">
                      <SelectTrigger id="dias-media">
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="14">14 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Nome dos Setores</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setor1" className="text-xs text-muted-foreground">
                        Setor 1
                      </Label>
                      <Input id="setor1" defaultValue="Mercearia" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="setor2" className="text-xs text-muted-foreground">
                        Setor 2
                      </Label>
                      <Input id="setor2" defaultValue="Perecíveis" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Responsáveis por Setor</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resp-mercearia" className="text-xs text-muted-foreground">
                        Mercearia
                      </Label>
                      <Input id="resp-mercearia" defaultValue="Carlos Silva, Ana Oliveira" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resp-pereciveis" className="text-xs text-muted-foreground">
                        Perecíveis
                      </Label>
                      <Input id="resp-pereciveis" defaultValue="Marcos Santos, Juliana Costa" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="sobre">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Sobre o CortePro CD
                </CardTitle>
                <CardDescription>Informações sobre o sistema e documentação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">CortePro CD</h3>
                  <p className="text-muted-foreground">
                    Plataforma de gestão inteligente de cortes para Centros de Distribuição. Versão 1.0.0
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Documentação</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Como funciona o algoritmo de corte?</AccordionTrigger>
                      <AccordionContent>
                        O algoritmo de corte utiliza dados de estoque e demanda para calcular automaticamente a
                        quantidade ideal de produtos a serem cortados, considerando fatores como giro de estoque,
                        validade dos produtos e histórico de vendas.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Como importar arquivos de estoque?</AccordionTrigger>
                      <AccordionContent>
                        Os arquivos de estoque devem estar no formato CSV ou Excel (.xlsx/.xls) com as colunas: Código,
                        Produto, Quantidade, Validade. Utilize a aba Arquivos para fazer o upload.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Como exportar relatórios?</AccordionTrigger>
                      <AccordionContent>
                        Na seção de Relatórios, você pode filtrar os dados desejados e utilizar o botão Exportar para
                        baixar os relatórios em formato XLSX ou PDF.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Créditos</h3>
                  <p className="text-muted-foreground">Desenvolvido para o Centro de Distribuição Pavuna.</p>
                  <p className="text-muted-foreground mt-2">© 2023-2024 CortePro CD. Todos os direitos reservados.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
