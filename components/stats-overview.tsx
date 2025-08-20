import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Recycle, TreePine, TrendingUp } from "lucide-react"

export function StatsOverview() {
  const stats = [
    {
      title: "Residuos Recolectados",
      value: "2,847 Ton",
      change: "+12.5%",
      icon: Truck,
      color: "text-chart-1",
    },
    {
      title: "Material Reciclado",
      value: "1,423 Ton",
      change: "+18.2%",
      icon: Recycle,
      color: "text-chart-2",
    },
    {
      title: "CO₂ Reducido",
      value: "892 Ton",
      change: "+8.7%",
      icon: TreePine,
      color: "text-chart-3",
    },
    {
      title: "Eficiencia",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-accent font-medium">{stat.change} desde el mes pasado</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
