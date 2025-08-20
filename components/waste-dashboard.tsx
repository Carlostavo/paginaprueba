"use client"

import type React from "react"
import { useState, useEffect } from "react"

const USERS = {
  usuario: { password: "123456", role: "user", name: "Usuario Normal" },
  tecnico: { password: "123456", role: "technician", name: "Técnico" },
  admin: { password: "123456", role: "admin", name: "Administrador" },
}

export function WasteDashboard() {
  const [activeSection, setActiveSection] = useState("Inicio")
  const [isDark, setIsDark] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  // Verificar sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setCurrentUser(user)
      setIsLoggedIn(true)
    }

    // Verificar tema guardado
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark))
  }, [])

  // Aplicar tema
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = USERS[loginForm.username as keyof typeof USERS]

    if (user && user.password === loginForm.password) {
      const userData = { username: loginForm.username, ...user }
      setCurrentUser(userData)
      setIsLoggedIn(true)
      setShowLogin(false)
      setLoginError("")
      localStorage.setItem("currentUser", JSON.stringify(userData))
    } else {
      setLoginError("Usuario o contraseña incorrectos")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowDropdown(false)
    localStorage.removeItem("currentUser")
  }

  const canAccess = (section: string) => {
    if (!isLoggedIn) return false

    switch (section) {
      case "Inicio":
        return true
      case "Metas":
        // Solo administradores pueden gestionar metas
        return currentUser?.role === "admin"
      case "Indicadores":
        // Todos pueden visualizar, solo admin puede gestionar
        return true
      case "Avances":
        // Técnicos y administradores pueden acceder
        return ["technician", "admin"].includes(currentUser?.role)
      case "Reportes":
        // Técnicos y administradores pueden acceder, otros solo visualizar
        return ["technician", "admin"].includes(currentUser?.role)
      default:
        return false
    }
  }

  const canManage = (section: string) => {
    if (!isLoggedIn) return false

    switch (section) {
      case "Metas":
      case "Indicadores":
        return currentUser?.role === "admin"
      case "Avances":
      case "Reportes":
        return ["technician", "admin"].includes(currentUser?.role)
      default:
        return false
    }
  }

  const handleCardClick = (section: string) => {
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }

    if (!canAccess(section)) {
      alert("No tienes permisos para acceder a esta sección. Contacta al administrador.")
      return
    }

    setActiveSection(section)
  }

  const navigationItems = [
    {
      name: "Inicio",
      desc: "Dashboard principal con estadísticas generales.",
      color: "#3b82f6",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      ),
    },
    {
      name: "Metas",
      desc: "Crear, editar y eliminar metas del proyecto. Solo administradores.",
      color: "#10b981",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 10V3l-7 7" />
          <path d="M3 19l6-6 4 4 8-8" />
        </svg>
      ),
    },
    {
      name: "Indicadores",
      desc: "Gestionar indicadores asociados a metas. Todos visualizan, admin gestiona.",
      color: "#f59e0b",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3v18h18" />
          <path d="M7 13l3 3 7-7" />
        </svg>
      ),
    },
    {
      name: "Avances",
      desc: "Registro periódico de avances. Técnicos y administradores.",
      color: "#8b5cf6",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19h16M4 15h10M4 11h6M4 7h14" />
        </svg>
      ),
    },
    {
      name: "Reportes",
      desc: "Generación de reportes PDF/Excel. Técnicos y administradores.",
      color: "#ef4444",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4h10l6 6v10H4z" />
          <path d="M14 4v6h6" />
        </svg>
      ),
    },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Metas":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: `0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"}`,
                border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
              }}
            >
              <h2 style={{ color: "#10b981", marginBottom: "24px", fontSize: "28px" }}>Gestión de Metas</h2>

              {canManage("Metas") ? (
                <div>
                  <div
                    style={{
                      background: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)",
                      padding: "20px",
                      borderRadius: "12px",
                      marginBottom: "24px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <h3 style={{ color: "#10b981", marginBottom: "16px" }}>Nueva Meta</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <input
                        placeholder="Nombre de la meta"
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                          background: isDark ? "#1f2937" : "#ffffff",
                          color: isDark ? "#e5e7eb" : "#0f172a",
                        }}
                      />
                      <input
                        placeholder="Unidad de medida"
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                          background: isDark ? "#1f2937" : "#ffffff",
                          color: isDark ? "#e5e7eb" : "#0f172a",
                        }}
                      />
                      <input
                        type="date"
                        placeholder="Plazo"
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                          background: isDark ? "#1f2937" : "#ffffff",
                          color: isDark ? "#e5e7eb" : "#0f172a",
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="Descripción de la meta"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                        marginTop: "16px",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                    />
                    <button
                      style={{
                        background: "#10b981",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "16px",
                        fontWeight: "600",
                      }}
                    >
                      Crear Meta
                    </button>
                  </div>

                  <h3 style={{ marginBottom: "16px" }}>Metas Existentes</h3>
                  <div
                    style={{
                      background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                      padding: "20px",
                      borderRadius: "12px",
                      border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
                    }}
                  >
                    <p style={{ color: isDark ? "#9ca3af" : "#6b7280", textAlign: "center" }}>
                      No hay metas registradas. Crea la primera meta para comenzar.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: isDark ? "rgba(220, 38, 38, 0.1)" : "rgba(220, 38, 38, 0.05)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#dc2626", margin: 0 }}>🔒 Solo los administradores pueden gestionar metas.</p>
                </div>
              )}
            </div>
          </div>
        )

      case "Indicadores":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: `0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"}`,
                border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
              }}
            >
              <h2 style={{ color: "#f59e0b", marginBottom: "24px", fontSize: "28px" }}>Gestión de Indicadores</h2>

              {canManage("Indicadores") && (
                <div
                  style={{
                    background: isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.05)",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <h3 style={{ color: "#f59e0b", marginBottom: "16px" }}>Nuevo Indicador</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <select
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    >
                      <option>Seleccionar Meta</option>
                      <option>Meta de Recolección</option>
                      <option>Meta de Reciclaje</option>
                    </select>
                    <input
                      placeholder="Línea base"
                      type="number"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    />
                    <input
                      placeholder="Unidad"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    />
                    <select
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    >
                      <option>Frecuencia</option>
                      <option>Diaria</option>
                      <option>Semanal</option>
                      <option>Mensual</option>
                      <option>Trimestral</option>
                    </select>
                    <input
                      placeholder="Meta objetivo"
                      type="number"
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    />
                  </div>
                  <button
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginTop: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Crear Indicador
                  </button>
                </div>
              )}

              <h3 style={{ marginBottom: "16px" }}>Indicadores Registrados</h3>
              <div
                style={{
                  background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
                }}
              >
                <p style={{ color: isDark ? "#9ca3af" : "#6b7280", textAlign: "center" }}>
                  {canManage("Indicadores")
                    ? "No hay indicadores registrados. Crea el primer indicador para comenzar."
                    : "Todos los usuarios pueden visualizar indicadores aquí una vez que sean creados por un administrador."}
                </p>
              </div>
            </div>
          </div>
        )

      case "Avances":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: `0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"}`,
                border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
              }}
            >
              <h2 style={{ color: "#8b5cf6", marginBottom: "24px", fontSize: "28px" }}>Registro de Avances</h2>

              <div
                style={{
                  background: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                <h3 style={{ color: "#8b5cf6", marginBottom: "16px" }}>Nuevo Avance</h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}
                >
                  <select
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                      background: isDark ? "#1f2937" : "#ffffff",
                      color: isDark ? "#e5e7eb" : "#0f172a",
                    }}
                  >
                    <option>Seleccionar Indicador</option>
                    <option>Toneladas Recolectadas</option>
                    <option>Porcentaje Reciclado</option>
                  </select>
                  <input
                    placeholder="Valor reportado"
                    type="number"
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                      background: isDark ? "#1f2937" : "#ffffff",
                      color: isDark ? "#e5e7eb" : "#0f172a",
                    }}
                  />
                  <input
                    type="date"
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                      background: isDark ? "#1f2937" : "#ffffff",
                      color: isDark ? "#e5e7eb" : "#0f172a",
                    }}
                  />
                </div>
                <textarea
                  placeholder="Comentario (opcional)"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                    background: isDark ? "#1f2937" : "#ffffff",
                    color: isDark ? "#e5e7eb" : "#0f172a",
                    marginTop: "16px",
                    minHeight: "60px",
                    resize: "vertical",
                  }}
                />
                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Evidencia adjunta:</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                      background: isDark ? "#1f2937" : "#ffffff",
                      color: isDark ? "#e5e7eb" : "#0f172a",
                      width: "100%",
                    }}
                  />
                </div>
                <button
                  style={{
                    background: "#8b5cf6",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "16px",
                    fontWeight: "600",
                  }}
                >
                  Registrar Avance
                </button>
              </div>

              <h3 style={{ marginBottom: "16px" }}>Historial de Avances</h3>
              <div
                style={{
                  background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
                }}
              >
                <p style={{ color: isDark ? "#9ca3af" : "#6b7280", textAlign: "center" }}>
                  No hay avances registrados. Registra el primer avance para comenzar el seguimiento.
                </p>
              </div>
            </div>
          </div>
        )

      case "Reportes":
        return (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: `0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"}`,
                border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
              }}
            >
              <h2 style={{ color: "#ef4444", marginBottom: "24px", fontSize: "28px" }}>Generación de Reportes</h2>

              <div
                style={{
                  background: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <h3 style={{ color: "#ef4444", marginBottom: "16px" }}>Configurar Reporte</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Periodo:</label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    >
                      <option>Último mes</option>
                      <option>Último trimestre</option>
                      <option>Último año</option>
                      <option>Personalizado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                      Filtrar por Meta:
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    >
                      <option>Todas las metas</option>
                      <option>Meta de Recolección</option>
                      <option>Meta de Reciclaje</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                      Filtrar por Indicador:
                    </label>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                        background: isDark ? "#1f2937" : "#ffffff",
                        color: isDark ? "#e5e7eb" : "#0f172a",
                      }}
                    >
                      <option>Todos los indicadores</option>
                      <option>Toneladas Recolectadas</option>
                      <option>Porcentaje Reciclado</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    style={{
                      background: "#ef4444",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h10l6 6v10H4z" />
                      <path d="M14 4v6h6" />
                    </svg>
                    Generar PDF
                  </button>

                  <button
                    style={{
                      background: "#10b981",
                      color: "white",
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M7 13l3 3 7-7" />
                    </svg>
                    Generar Excel
                  </button>
                </div>
              </div>

              <h3 style={{ marginBottom: "16px" }}>Reportes Generados</h3>
              <div
                style={{
                  background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
                }}
              >
                <p style={{ color: isDark ? "#9ca3af" : "#6b7280", textAlign: "center" }}>
                  No hay reportes generados. Configura y genera tu primer reporte.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark
          ? "radial-gradient(1200px 600px at 80% -10%, #0a0e1a, transparent 60%), radial-gradient(1000px 500px at -10% 0%, #0a0e1a, transparent 55%), #0b1020"
          : "radial-gradient(1200px 600px at 80% -10%, #eef1f6, transparent 60%), radial-gradient(1000px 500px at -10% 0%, #eef1f6, transparent 55%), #f6f7fb",
        color: isDark ? "#e5e7eb" : "#0f172a",
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(150%) blur(6px);
          /* Mejorar el color de la barra con un gradiente más moderno */
          background: ${
            isDark
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.85) 50%, rgba(30, 165, 106, 0.75) 100%)"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(16, 185, 129, 0.85) 50%, rgba(34, 197, 94, 0.8) 100%)"
          };
          border-bottom: 1px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"};
          color: #fff;
          box-shadow: 0 4px 20px ${isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"};
        }
        .nav-inner {
          max-width: 1200px;
          margin: auto;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .logo {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          background: #fff;
          color: ${isDark ? "#1ea56a" : "#157a4b"};
          border-radius: 10px;
          font-size: 16px;
          font-weight: 900;
        }
        .btn {
          border: 0;
          border-radius: 12px;
          padding: 8px 12px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.12s ease, background 0.2s ease;
          font-size: 14px;
        }
        .btn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.26);
        }
        .btn.active {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn.disabled:hover {
          transform: none;
          background: rgba(255, 255, 255, 0.15);
        }
        .nav-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #fff;
          color: ${isDark ? "#1ea56a" : "#157a4b"};
          font-weight: 800;
          box-shadow: 0 10px 25px ${isDark ? "rgba(0,0,0,.45)" : "rgba(2,6,23,.08)"};
        }
        .dropdown {
          position: absolute;
          right: 0;
          margin-top: 10px;
          width: 220px;
          background: ${isDark ? "#0f172a" : "#ffffff"};
          border-radius: 16px;
          box-shadow: 0 10px 25px ${isDark ? "rgba(0,0,0,.45)" : "rgba(2,6,23,.08)"};
          overflow: hidden;
          border: 1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"};
          display: ${showDropdown ? "block" : "none"};
          animation: ${showDropdown ? "pop 0.16s ease forwards" : "none"};
        }
        @keyframes pop {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dd-item {
          display: flex;
          gap: 10px;
          align-items: center;
          width: 100%;
          padding: 12px 14px;
          background: transparent;
          border: 0;
          text-align: left;
          color: ${isDark ? "#e5e7eb" : "#0f172a"};
          cursor: pointer;
          font-size: 14px;
        }
        .dd-item:hover {
          background: ${isDark ? "rgba(30, 165, 106, 0.08)" : "rgba(21, 122, 75, 0.08)"};
        }
        .hero {
          max-width: 1200px;
          margin: 32px auto 10px;
          padding: 0 20px;
          text-align: center;
        }
        .hero h1 {
          font-size: clamp(24px, 2.4vw + 12px, 38px);
          margin: 0 0 6px;
        }
        .hero p {
          color: ${isDark ? "#9ca3af" : "#6b7280"};
          margin: 0;
        }
        .main-content {
          padding: 20px 0;
          min-height: calc(100vh - 120px);
        }
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .stat-card {
          background: ${isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"};
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"};
          border: 1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"};
        }
        .stat-title {
          font-size: 14px;
          color: ${isDark ? "#9ca3af" : "#6b7280"};
          margin-bottom: 8px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .stat-change {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .login-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: ${showLogin ? "flex" : "none"};
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .login-form {
          background: ${isDark ? "#0f172a" : "#ffffff"};
          padding: 32px;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid ${isDark ? "#374151" : "#d1d5db"};
          border-radius: 8px;
          background: ${isDark ? "#1f2937" : "#ffffff"};
          color: ${isDark ? "#e5e7eb" : "#0f172a"};
        }
        .btn-primary {
          width: 100%;
          background: #10b981;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .btn-secondary {
          width: 100%;
          background: transparent;
          color: ${isDark ? "#e5e7eb" : "#0f172a"};
          padding: 12px;
          border: 1px solid ${isDark ? "#374151" : "#d1d5db"};
          border-radius: 8px;
          cursor: pointer;
        }
        .error {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
        }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <div className="logo">RS</div>
            <div>Gestión Residuos Sólidos</div>
          </div>

          <button className="md:hidden btn" onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Abrir menú">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>

          <div className="nav-buttons hidden md:flex">
            <button
              className={`btn ${activeSection === "Inicio" ? "active" : ""}`}
              onClick={() => handleCardClick("Inicio")}
              aria-label="Ir a inicio"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              Inicio
            </button>

            <button
              className={`btn ${activeSection === "Metas" ? "active" : ""} ${!canAccess("Metas") && isLoggedIn ? "disabled" : ""}`}
              onClick={() => handleCardClick("Metas")}
              aria-label="Gestión de metas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10V3l-7 7" />
                <path d="M3 19l6-6 4 4 8-8" />
              </svg>
              Metas
            </button>

            <button
              className={`btn ${activeSection === "Indicadores" ? "active" : ""} ${!canAccess("Indicadores") && isLoggedIn ? "disabled" : ""}`}
              onClick={() => handleCardClick("Indicadores")}
              aria-label="Gestión de indicadores"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3v18h18" />
                <path d="M7 13l3 3 7-7" />
              </svg>
              Indicadores
            </button>

            <button
              className={`btn ${activeSection === "Avances" ? "active" : ""} ${!canAccess("Avances") && isLoggedIn ? "disabled" : ""}`}
              onClick={() => handleCardClick("Avances")}
              aria-label="Registro de avances"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19h16M4 15h10M4 11h6M4 7h14" />
              </svg>
              Avances
            </button>

            <button
              className={`btn ${activeSection === "Reportes" ? "active" : ""} ${!canAccess("Reportes") && isLoggedIn ? "disabled" : ""}`}
              onClick={() => handleCardClick("Reportes")}
              aria-label="Generación de reportes"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h10l6 6v10H4z" />
                <path d="M14 4v6h6" />
              </svg>
              Reportes
            </button>

            <button className="btn" onClick={() => setIsDark(!isDark)} aria-label="Cambiar tema">
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5 19 19M5 19l-1.5 1.5M20.5 3.5 19 5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.8A9 9 0 0 1 11.2 3 7.5 7.5 0 1 0 21 12.8z" />
                </svg>
              )}
            </button>

            <div style={{ position: "relative" }}>
              {isLoggedIn ? (
                <>
                  <button className="btn" onClick={() => setShowDropdown(!showDropdown)} aria-haspopup="menu">
                    <div className="avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                    <span>{currentUser?.name}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="dropdown">
                    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          borderRadius: "999px",
                          padding: "6px 10px",
                          background: isDark ? "rgba(30, 165, 106, 0.12)" : "rgba(21, 122, 75, 0.12)",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 12a9 9 0 1 0 18 0" />
                        </svg>
                        {currentUser?.role === "admin"
                          ? "Administrador"
                          : currentUser?.role === "technician"
                            ? "Técnico"
                            : "Usuario"}
                      </span>
                    </div>
                    <button className="dd-item" onClick={() => setShowSettings(true)}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.07A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06c.48.48 1.17.62 1.82.33A1.65 1.65 0 0 0 10.4 3.2V3a2 2 0 1 1 4 0v.07a1.65 1.65 0 0 0 1 1.51c.65.29 1.34.15 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.48.48-.62 1.17-.33 1.82.29.65.76 1.19 1.51 1.19H22a2 2 0 1 1 0 4h-.07c-.75 0-1.22.54-1.51 1z" />
                      </svg>
                      Configuración
                    </button>
                    <div
                      style={{
                        height: "1px",
                        background: isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)",
                        margin: "4px 0",
                      }}
                    ></div>
                    <button className="dd-item" onClick={handleLogout} style={{ color: "#dc2626" }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M21 21V3" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                <button className="btn" onClick={() => setShowLogin(true)}>
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button className="btn" onClick={() => setIsDark(!isDark)} aria-label="Cambiar tema">
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5 19 19M5 19l-1.5 1.5M20.5 3.5 19 5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.8A9 9 0 0 1 11.2 3 7.5 7.5 0 1 0 21 12.8z" />
                </svg>
              )}
            </button>

            <div style={{ position: "relative" }}>
              {isLoggedIn ? (
                <>
                  <button className="btn" onClick={() => setShowDropdown(!showDropdown)} aria-haspopup="menu">
                    <div className="avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                  </button>
                  <div className="dropdown">
                    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          borderRadius: "999px",
                          padding: "6px 10px",
                          background: isDark ? "rgba(30, 165, 106, 0.12)" : "rgba(21, 122, 75, 0.12)",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 12a9 9 0 1 0 18 0" />
                        </svg>
                        {currentUser?.role === "admin"
                          ? "Administrador"
                          : currentUser?.role === "technician"
                            ? "Técnico"
                            : "Usuario"}
                      </span>
                    </div>
                    <button className="dd-item" onClick={() => setShowSettings(true)}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.07A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06c.48.48 1.17.62 1.82.33A1.65 1.65 0 0 0 10.4 3.2V3a2 2 0 1 1 4 0v.07a1.65 1.65 0 0 0 1 1.51c.65.29 1.34.15 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.48.48-.62 1.17-.33 1.82.29.65.76 1.19 1.51 1.19H22a2 2 0 1 1 0 4h-.07c-.75 0-1.22.54-1.51 1z" />
                      </svg>
                      Configuración
                    </button>
                    <div
                      style={{
                        height: "1px",
                        background: isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)",
                        margin: "4px 0",
                      }}
                    ></div>
                    <button className="dd-item" onClick={handleLogout} style={{ color: "#dc2626" }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M10 17l5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M21 21V3" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                <button className="btn" onClick={() => setShowLogin(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div
            className="md:hidden"
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              background: isDark
                ? "linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))",
              backdropFilter: "blur(10px)",
              borderBottom: `1px solid ${isDark ? "rgba(30, 165, 106, 0.2)" : "rgba(21, 122, 75, 0.2)"}`,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              zIndex: 50,
            }}
          >
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  className={`btn ${activeSection === "Inicio" ? "active" : ""}`}
                  onClick={() => {
                    handleCardClick("Inicio")
                    setShowMobileMenu(false)
                  }}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                  Inicio
                </button>

                <button
                  className={`btn ${activeSection === "Metas" ? "active" : ""} ${!canAccess("Metas") && isLoggedIn ? "disabled" : ""}`}
                  onClick={() => {
                    handleCardClick("Metas")
                    setShowMobileMenu(false)
                  }}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 10V3l-7 7" />
                    <path d="M3 19l6-6 4 4 8-8" />
                  </svg>
                  Metas
                  {!canAccess("Metas") && isLoggedIn && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Restringido
                    </span>
                  )}
                </button>

                <button
                  className={`btn ${activeSection === "Indicadores" ? "active" : ""} ${!canAccess("Indicadores") && isLoggedIn ? "disabled" : ""}`}
                  onClick={() => {
                    handleCardClick("Indicadores")
                    setShowMobileMenu(false)
                  }}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3v18h18" />
                    <path d="M7 13l3 3 7-7" />
                  </svg>
                  Indicadores
                  {!canAccess("Indicadores") && isLoggedIn && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Restringido
                    </span>
                  )}
                </button>

                <button
                  className={`btn ${activeSection === "Avances" ? "active" : ""} ${!canAccess("Avances") && isLoggedIn ? "disabled" : ""}`}
                  onClick={() => {
                    handleCardClick("Avances")
                    setShowMobileMenu(false)
                  }}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 19h16M4 15h10M4 11h6M4 7h14" />
                  </svg>
                  Avances
                  {!canAccess("Avances") && isLoggedIn && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Restringido
                    </span>
                  )}
                </button>

                <button
                  className={`btn ${activeSection === "Reportes" ? "active" : ""} ${!canAccess("Reportes") && isLoggedIn ? "disabled" : ""}`}
                  onClick={() => {
                    handleCardClick("Reportes")
                    setShowMobileMenu(false)
                  }}
                  style={{ justifyContent: "flex-start", width: "100%" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h10l6 6v10H4z" />
                    <path d="M14 4v6h6" />
                  </svg>
                  Reportes
                  {!canAccess("Reportes") && isLoggedIn && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Restringido
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="main-content">
        {activeSection === "Inicio" ? (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: "40px",
                padding: "32px",
                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderRadius: "20px",
                boxShadow: `0 10px 25px ${isDark ? "rgba(0,0,0,.3)" : "rgba(2,6,23,.08)"}`,
                border: `1px solid ${isDark ? "rgba(30, 165, 106, 0.1)" : "rgba(21, 122, 75, 0.1)"}`,
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  marginBottom: "16px",
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #1ea56a, #10b981)"
                    : "linear-gradient(135deg, #157a4b, #10b981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ¡Bienvenido al Sistema de Gestión!
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: isDark ? "#9ca3af" : "#6b7280",
                  marginBottom: "32px",
                  lineHeight: "1.6",
                }}
              >
                Selecciona una sección para comenzar a gestionar los indicadores de residuos sólidos.
                {!isLoggedIn && " Inicia sesión para acceder a todas las funcionalidades."}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                  marginTop: "32px",
                }}
              >
                {navigationItems.slice(1).map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleCardClick(item.name)}
                    style={{
                      background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
                      border: `2px solid ${item.color}20`,
                      borderRadius: "16px",
                      padding: "24px",
                      cursor: !isLoggedIn || canAccess(item.name) ? "pointer" : "not-allowed",
                      opacity: !isLoggedIn || canAccess(item.name) ? 1 : 0.5,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoggedIn || canAccess(item.name)) {
                        e.currentTarget.style.transform = "translateY(-4px)"
                        e.currentTarget.style.boxShadow = `0 20px 40px ${item.color}20`
                        e.currentTarget.style.borderColor = `${item.color}40`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoggedIn || canAccess(item.name)) {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                        e.currentTarget.style.borderColor = `${item.color}20`
                      }
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                        borderRadius: "0 16px 0 60px",
                      }}
                    ></div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          boxShadow: `0 8px 20px ${item.color}30`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: "700",
                            color: item.color,
                          }}
                        >
                          {item.name}
                        </h3>
                        {!canAccess(item.name) && isLoggedIn && (
                          <span
                            style={{
                              background: "#dc2626",
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "600",
                              marginLeft: "8px",
                            }}
                          >
                            🔒 RESTRINGIDO
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: isDark ? "#9ca3af" : "#6b7280",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.desc}
                    </p>

                    {!canAccess(item.name) && isLoggedIn && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "12px",
                          fontSize: "11px",
                          color: "#dc2626",
                          fontWeight: "600",
                        }}
                      >
                        {item.name === "Metas"
                          ? "Solo Administradores"
                          : ["Avances", "Reportes"].includes(item.name)
                            ? "Técnicos y Administradores"
                            : ""}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                  fontSize: "22px",
                  color: isDark ? "#e5e7eb" : "#0f172a",
                }}
              >
                Resumen de Indicadores
              </h3>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-title">Residuos Recolectados</div>
                  <div className="stat-value" style={{ color: "#10b981" }}>
                    2,847 Ton
                  </div>
                  <div className="stat-change" style={{ color: "#10b981" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    +12% vs mes anterior
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Material Reciclado</div>
                  <div className="stat-value" style={{ color: "#f59e0b" }}>
                    1,234 Ton
                  </div>
                  <div className="stat-change" style={{ color: "#10b981" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    +8% vs mes anterior
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Eficiencia de Reciclaje</div>
                  <div className="stat-value" style={{ color: "#3b82f6" }}>
                    43.4%
                  </div>
                  <div className="stat-change" style={{ color: "#10b981" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    +3.2% vs mes anterior
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Rutas Completadas</div>
                  <div className="stat-value" style={{ color: "#8b5cf6" }}>
                    156/160
                  </div>
                  <div className="stat-change" style={{ color: "#10b981" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    97.5% cumplimiento
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderSectionContent()
        )}
      </div>

      {/* Modal de Login */}
      <div className="login-modal">
        <div className="login-form">
          <h2 style={{ marginTop: 0, marginBottom: "20px" }}>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Usuario:</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="usuario, tecnico o admin"
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="123456"
                required
              />
            </div>
            {loginError && <div className="error">{loginError}</div>}
            <button type="submit" className="btn-primary">
              Ingresar
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowLogin(false)
                setLoginError("")
                setLoginForm({ username: "", password: "" })
              }}
            >
              Cancelar
            </button>
          </form>
          <div style={{ marginTop: "16px", fontSize: "12px", color: isDark ? "#9ca3af" : "#6b7280" }}>
            <strong>Usuarios de prueba:</strong>
            <br />• usuario / 123456 (acceso limitado)
            <br />• tecnico / 123456 (técnico)
            <br />• admin / 123456 (acceso completo)
          </div>
        </div>
      </div>

      <p
        style={{
          maxWidth: "1200px",
          margin: "0 auto 40px",
          padding: "0 20px",
          color: isDark ? "#9ca3af" : "#6b7280",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        Sistema de Gestión de Residuos Sólidos - Indicadores Daule
      </p>
    </div>
  )
}

export default WasteDashboard
