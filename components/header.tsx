import { Button } from "@/components/ui/button"
import { Recycle, User, LogOut } from "lucide-react"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8" />
              <span className="text-xl font-bold">EcoGestión</span>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Recolección
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Indicadores
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Reportes
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                Configuración
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <User className="h-4 w-4 mr-2" />
              Usuario
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
