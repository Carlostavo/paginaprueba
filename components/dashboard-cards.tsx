import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, BarChart3, FileText, Target, MapPin, Calendar } from "lucide-react"

export function DashboardCards() {
  const cards = [
    {
      title: "Gestión de Recolección",
      description: "Programar y monitorear rutas de recolección de residuos",
      icon: Truck,
      color: "bg-primary",
      features: ["Rutas optimizadas", "Seguimiento en tiempo real", "Programación automática"],
    },
    {
      title: "Indicadores Ambientales",
      description: "Visualizar métricas de impacto ambiental y sostenibilidad",
      icon: BarChart3,
      color: "bg-secondary",
      features: ["Reducción de CO₂", "Tasas de reciclaje", "Eficiencia energética"],
    },
    {
      title: "Reportes y Análisis",
      description: "Generar informes detallados y análisis de tendencias",
      icon: FileText,
      color: "bg-accent",
      features: ["Reportes automáticos", "Análisis predictivo", "Exportación de datos"],
    },
    {
      title: "Metas y Objetivos",
      description: "Establecer y seguir objetivos de sostenibilidad",
      icon: Target,
      color: "bg-chart-3",
      features: ["Objetivos personalizados", "Seguimiento de progreso", "Alertas de cumplimiento"],
    },
    {
      title: "Mapas y Ubicaciones",
      description: "Visualizar puntos de recolección y áreas de servicio",
      icon: MapPin,
      color: "bg-chart-4",
      features: ["Mapas interactivos", "Puntos de interés", "Cobertura de servicio"],
    },
    {
      title: "Programación",
      description: "Gestionar horarios y calendarios de recolección",
      icon: Calendar,
      color: "bg-chart-5",
      features: ["Calendarios dinámicos", "Notificaciones", "Gestión de recursos"],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="bg-card border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">{card.title}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-muted-foreground mt-2">{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {card.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Acceder</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
