"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Package, Settings } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const cards = [
    {
      id: "novo-corte",
      title: "Novo Corte",
      description: "Criar um novo corte de produtos",
      icon: Package,
      href: "/novo-corte",
      color: "bg-primary/10 text-primary",
    },
    {
      id: "relatorios",
      title: "Relatórios",
      description: "Visualizar histórico de cortes",
      icon: BarChart3,
      href: "/relatorios",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      id: "configuracoes",
      title: "Configurações",
      description: "Ajustar parâmetros do sistema",
      icon: Settings,
      href: "/configuracoes",
      color: "bg-purple-500/10 text-purple-500",
    },
  ]

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2">Bem-vindo ao CortePro CD</h1>
        <p className="text-muted-foreground mb-8">
          Plataforma de gestão inteligente de cortes para o Centro de Distribuição Pavuna
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 },
            }}
            onHoverStart={() => setHoveredCard(card.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href={card.href}>
              <Card className="h-full cursor-pointer border-2 transition-all duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="h-1 bg-primary/30 rounded-full mt-2"
                    initial={{ width: "0%" }}
                    animate={{
                      width: hoveredCard === card.id ? "100%" : "30%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
