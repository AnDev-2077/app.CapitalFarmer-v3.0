"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Scale, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"

import { useNavigate } from "react-router-dom"

export default function LawFirmAuth() {

  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")

  // Función para manejar el registro de usuarios
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      nombre,
      apellido,
      telefono,
      correo,
      contrasena,
      rol_id: "8"
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/capitalfarmer.co/api/v1/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Error al registrar usuario");
      await response.json();
      // Maneja el éxito (redirige, muestra mensaje, etc.)
    } catch (error) {
      // Maneja el error 
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      correo,
      contrasena,
      rememberMe
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/capitalfarmer.co/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Correo o contraseña incorrectos");
      const usuario = await response.json();
      alert("¡Inicio de sesión exitoso!");
      navigate("/home");
    } catch (error) {
      alert("Correo o contraseña incorrectos");
    }
  };
  
  // Función para manejar el cambio del checkbox
  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    setRememberMe(checked === true)
  }

  const handleAcceptTermsChange = (checked: boolean | "indeterminate") => {
    setAcceptTerms(checked === true)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">CapitalFarmer</span>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">{isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}</h1>
            <p className="text-slate-600">{isLogin ? "Accede a tu portal" : "Únete a nuestros clientes"}</p>
          </div>

          {/* Google Sign In */}
          <Button variant="outline" className="w-full h-12 border-slate-300 hover:bg-slate-50">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLogin ? "Continuar con Google" : "Registrarse con Google"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">o</span>
            </div>
          </div>

          {/* Form Fields */}
          
          <form onSubmit={isLogin ? handleLogin : handleRegister}className="space-y-4">
            <div className="space-y-4">
            {/* Name Fields - Only for Registration */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">
                    Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      className="pl-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">
                    Apellido
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Pérez"
                      className="pl-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                      value={apellido}
                      onChange={e => setApellido(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              )}

              {/* Phone Field - Only for Registration */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Teléfono
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 123456789"
                      className="pl-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                    value={contrasena}
                    onChange={e => setContrasena(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field - Only for Registration */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me / Accept Terms */}
            <div className="flex items-center justify-between">
              {isLogin ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={handleRememberMeChange}
                      className="border-slate-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-600">
                      Recordar por 30 días
                    </Label>
                  </div>
                  <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </button>
                </>
              ) : (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={handleAcceptTermsChange}
                    className="border-slate-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                    Acepto los{" "}
                    <button className="text-amber-600 hover:text-amber-700 font-medium">términos y condiciones</button> y
                    la <button className="text-amber-600 hover:text-amber-700 font-medium">política de privacidad</button>
                  </Label>
                </div>
              )}
            </div>

          {/* Submit Button */}
            <Button type="submit" className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-medium">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </Button>
          </form>
        
          {/* Toggle Auth Mode */}
          <div className="text-center">
            <span className="text-slate-600">{isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}</span>
            <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 hover:text-amber-700 font-medium">
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel*/}
      <div className="hidden md:flex-1 md:relative md:bg-gradient-to-br md:from-slate-800 md:via-slate-700 md:to-slate-900 md:block">
        <div className="absolute inset-0 bg-black/20" />

        {/* Background Image Placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=600')`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              {isLogin ? "Protegemos tus derechos con excelencia legal" : "Únete a miles de clientes satisfechos"}
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed max-w-md">
              {isLogin
                ? "Accede a tu portal personalizado y mantente informado sobre el progreso de tu caso. Experiencia, confianza y resultados garantizados."
                : "Regístrate hoy y obtén acceso completo a nuestros servicios legales. Tu primera consulta es completamente gratuita."}
            </p>
            <div className="flex items-center space-x-4 text-amber-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-sm">Consulta gratuita</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-sm">Disponible 24/7</span>
              </div>
              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-sm">Sin compromiso</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 w-24 h-24 border border-amber-400/30 rounded-full" />
        <div className="absolute bottom-32 right-16 w-16 h-16 border border-amber-400/20 rounded-full" />
      </div>
    </div>
  )
}
